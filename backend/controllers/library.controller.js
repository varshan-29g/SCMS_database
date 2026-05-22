const pool = require('../config/db');

exports.getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM library_books ORDER BY title');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.searchBooks = async (req, res) => {
  try {
    const { q, category } = req.query;
    let sql = 'SELECT * FROM library_books WHERE 1=1';
    const params = [];
    if (q) { sql += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)'; params.push(`%${q}%`,`%${q}%`,`%${q}%`); }
    if (category) { sql += ' AND category=?'; params.push(category); }
    sql += ' ORDER BY title';
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getBookById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM library_books WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Book not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn, publisher, edition, category, total_copies, shelf_location, added_date } = req.body;
    const [result] = await pool.query(
      'INSERT INTO library_books (title,author,isbn,publisher,edition,category,total_copies,available_copies,shelf_location,added_date) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [title, author, isbn, publisher, edition, category, total_copies||1, total_copies||1, shelf_location, added_date||new Date().toISOString().slice(0,10)]
    );
    res.status(201).json({ success: true, message: 'Book added.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, publisher, edition, category, total_copies, shelf_location } = req.body;
    await pool.query(
      'UPDATE library_books SET title=?,author=?,publisher=?,edition=?,category=?,total_copies=?,shelf_location=? WHERE id=?',
      [title, author, publisher, edition, category, total_copies, shelf_location, req.params.id]
    );
    res.json({ success: true, message: 'Book updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.removeBook = async (req, res) => {
  try {
    await pool.query('DELETE FROM library_books WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Book removed.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllIssued = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ib.*, lb.title, lb.author, s.name AS student_name, s.student_id AS roll_no
       FROM issued_books ib JOIN library_books lb ON ib.book_id=lb.id LEFT JOIN students s ON ib.student_id=s.id
       ORDER BY ib.issue_date DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getOverdue = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ib.*, lb.title, s.name AS student_name, DATEDIFF(CURDATE(), ib.due_date) AS days_overdue,
              DATEDIFF(CURDATE(), ib.due_date) * 2 AS fine
       FROM issued_books ib JOIN library_books lb ON ib.book_id=lb.id LEFT JOIN students s ON ib.student_id=s.id
       WHERE ib.status != 'Returned' AND ib.due_date < CURDATE() ORDER BY days_overdue DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.issueBook = async (req, res) => {
  try {
    const { book_id, student_id, faculty_id, issue_date, due_date } = req.body;
    const [[book]] = await pool.query('SELECT available_copies FROM library_books WHERE id=?', [book_id]);
    if (!book || book.available_copies < 1)
      return res.status(400).json({ success: false, message: 'No copies available.' });
    await pool.query('INSERT INTO issued_books (book_id,student_id,faculty_id,issue_date,due_date) VALUES (?,?,?,?,?)',
      [book_id, student_id||null, faculty_id||null, issue_date, due_date]);
    await pool.query('UPDATE library_books SET available_copies=available_copies-1 WHERE id=?', [book_id]);
    res.status(201).json({ success: true, message: 'Book issued.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.returnBook = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM issued_books WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Issue record not found.' });
    const issue = rows[0];
    const daysLate = Math.max(0, Math.floor((Date.now() - new Date(issue.due_date)) / 86400000));
    const fine = daysLate * 2; // Rs.2 per day
    await pool.query(
      "UPDATE issued_books SET return_date=CURDATE(), status='Returned', fine_amount=? WHERE id=?",
      [fine, req.params.id]
    );
    await pool.query('UPDATE library_books SET available_copies=available_copies+1 WHERE id=?', [issue.book_id]);
    res.json({ success: true, message: 'Book returned.', fine_amount: fine });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMemberHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ib.*, lb.title, lb.author FROM issued_books ib JOIN library_books lb ON ib.book_id=lb.id WHERE ib.student_id=? ORDER BY ib.issue_date DESC`,
      [req.params.sid]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
