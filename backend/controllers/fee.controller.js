const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let q = `SELECT f.*, s.name AS student_name, s.student_id AS roll_no FROM fees f JOIN students s ON f.student_id=s.id WHERE 1=1`;
    const params = [];
    if (status) { q += ' AND f.status=?'; params.push(status); }
    q += ` ORDER BY f.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (page-1)*parseInt(limit));
    const [rows] = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPending = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, s.name AS student_name, s.student_id AS roll_no FROM fees f
       JOIN students s ON f.student_id=s.id WHERE f.status IN ('Pending','Overdue') ORDER BY f.due_date ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT
        SUM(CASE WHEN status='Paid' THEN amount - scholarship ELSE 0 END) AS collected,
        SUM(CASE WHEN status IN ('Pending','Overdue') THEN amount ELSE 0 END) AS pending,
        COUNT(CASE WHEN status='Paid' THEN 1 END) AS paid_count,
        COUNT(CASE WHEN status='Pending' THEN 1 END) AS pending_count,
        COUNT(CASE WHEN status='Overdue' THEN 1 END) AS overdue_count
      FROM fees
    `);
    res.json({ success: true, data: stats });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getByStudent = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fees WHERE student_id=? ORDER BY created_at DESC', [req.params.sid]);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { student_id, fee_type, amount, due_date, payment_mode, scholarship, remarks } = req.body;
    const [result] = await pool.query(
      'INSERT INTO fees (student_id, fee_type, amount, due_date, payment_mode, scholarship, remarks) VALUES (?,?,?,?,?,?,?)',
      [student_id, fee_type, amount, due_date, payment_mode || 'Online', scholarship || 0, remarks]
    );
    res.status(201).json({ success: true, message: 'Fee record created.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { fee_type, amount, due_date, status, scholarship, remarks } = req.body;
    await pool.query(
      'UPDATE fees SET fee_type=?, amount=?, due_date=?, status=?, scholarship=?, remarks=? WHERE id=?',
      [fee_type, amount, due_date, status, scholarship, remarks, req.params.id]
    );
    res.json({ success: true, message: 'Fee updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markPaid = async (req, res) => {
  try {
    const receipt_no = `RCP-${Date.now()}`;
    await pool.query(
      "UPDATE fees SET status='Paid', paid_date=CURDATE(), receipt_no=? WHERE id=?",
      [receipt_no, req.params.id]
    );
    res.json({ success: true, message: 'Fee marked as paid.', receipt_no });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM fees WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Fee record deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
