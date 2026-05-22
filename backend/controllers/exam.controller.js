const pool = require('../config/db');

const gradeFromMarks = (marks, max) => {
  const pct = (marks / max) * 100;
  if (pct >= 90) return 'O';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B+';
  if (pct >= 50) return 'B';
  if (pct >= 40) return 'C';
  return 'F';
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, sub.name AS subject_name, sub.code AS subject_code FROM exams e LEFT JOIN subjects sub ON e.subject_id=sub.id ORDER BY e.exam_date DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getUpcoming = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, sub.name AS subject_name FROM exams e LEFT JOIN subjects sub ON e.subject_id=sub.id WHERE e.exam_date >= CURDATE() ORDER BY e.exam_date ASC LIMIT 10`
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, sub.name AS subject_name FROM exams e LEFT JOIN subjects sub ON e.subject_id=sub.id WHERE e.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Exam not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, subject_id, exam_date, start_time, end_time, hall, max_marks, passing_marks, semester } = req.body;
    const [result] = await pool.query(
      'INSERT INTO exams (name, subject_id, exam_date, start_time, end_time, hall, max_marks, passing_marks, semester) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, subject_id, exam_date, start_time, end_time, hall, max_marks || 100, passing_marks || 40, semester]
    );
    res.status(201).json({ success: true, message: 'Exam scheduled.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { name, exam_date, start_time, end_time, hall, max_marks, passing_marks } = req.body;
    await pool.query(
      'UPDATE exams SET name=?, exam_date=?, start_time=?, end_time=?, hall=?, max_marks=?, passing_marks=? WHERE id=?',
      [name, exam_date, start_time, end_time, hall, max_marks, passing_marks, req.params.id]
    );
    res.json({ success: true, message: 'Exam updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM exams WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Exam deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getResults = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, s.name AS student_name, s.student_id AS roll_no FROM results r JOIN students s ON r.student_id=s.id WHERE r.exam_id=? ORDER BY r.marks DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addResult = async (req, res) => {
  try {
    const { student_id, marks, remarks } = req.body;
    const [[exam]] = await pool.query('SELECT max_marks FROM exams WHERE id=?', [req.params.id]);
    const grade = gradeFromMarks(marks, exam.max_marks);
    await pool.query(
      `INSERT INTO results (student_id, exam_id, marks, grade, remarks) VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE marks=?, grade=?, remarks=?`,
      [student_id, req.params.id, marks, grade, remarks, marks, grade, remarks]
    );
    res.json({ success: true, message: 'Result saved.', grade });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateResult = async (req, res) => {
  try {
    const { marks, remarks } = req.body;
    const [resultRow] = await pool.query('SELECT exam_id FROM results WHERE id=?', [req.params.rid]);
    const [[exam]] = await pool.query('SELECT max_marks FROM exams WHERE id=?', [resultRow[0].exam_id]);
    const grade = gradeFromMarks(marks, exam.max_marks);
    await pool.query('UPDATE results SET marks=?, grade=?, remarks=? WHERE id=?', [marks, grade, remarks, req.params.rid]);
    res.json({ success: true, message: 'Result updated.', grade });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getStudentResults = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, e.name AS exam_name, e.exam_date, e.max_marks, sub.name AS subject_name
       FROM results r JOIN exams e ON r.exam_id=e.id JOIN subjects sub ON e.subject_id=sub.id
       WHERE r.student_id=? ORDER BY e.exam_date DESC`,
      [req.params.sid]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getRanklist = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.name, s.student_id AS roll_no, r.marks, r.grade,
              RANK() OVER (ORDER BY r.marks DESC) AS \`rank\`
       FROM results r JOIN students s ON r.student_id=s.id WHERE r.exam_id=? ORDER BY r.marks DESC`,
      [req.params.examId]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
