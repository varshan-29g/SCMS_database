const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, d.name AS dept_name FROM courses c LEFT JOIN departments d ON c.department_id=d.id ORDER BY c.name`
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, d.name AS dept_name FROM courses c LEFT JOIN departments d ON c.department_id=d.id WHERE c.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getSubjects = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, f.name AS faculty_name FROM subjects s LEFT JOIN faculty f ON s.faculty_id=f.id WHERE s.course_id=?`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, code, department_id, semester, credits, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO courses (name, code, department_id, semester, credits, description) VALUES (?,?,?,?,?,?)',
      [name, code, department_id, semester, credits || 3, description]
    );
    res.status(201).json({ success: true, message: 'Course created.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { name, code, department_id, semester, credits, description } = req.body;
    await pool.query(
      'UPDATE courses SET name=?, code=?, department_id=?, semester=?, credits=?, description=? WHERE id=?',
      [name, code, department_id, semester, credits, description, req.params.id]
    );
    res.json({ success: true, message: 'Course updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Course deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, course_id, faculty_id, semester, credits, type } = req.body;
    const [result] = await pool.query(
      'INSERT INTO subjects (name, code, course_id, faculty_id, semester, credits, type) VALUES (?,?,?,?,?,?,?)',
      [name, code, course_id, faculty_id, semester, credits || 3, type || 'Theory']
    );
    res.status(201).json({ success: true, message: 'Subject created.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSubject = async (req, res) => {
  try {
    const { name, code, course_id, faculty_id, semester, credits, type } = req.body;
    await pool.query(
      'UPDATE subjects SET name=?, code=?, course_id=?, faculty_id=?, semester=?, credits=?, type=? WHERE id=?',
      [name, code, course_id, faculty_id, semester, credits, type, req.params.sid]
    );
    res.json({ success: true, message: 'Subject updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.removeSubject = async (req, res) => {
  try {
    await pool.query('DELETE FROM subjects WHERE id=?', [req.params.sid]);
    res.json({ success: true, message: 'Subject deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
