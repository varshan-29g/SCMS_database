const pool   = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const { dept, sem, search, page = 1, limit = 20 } = req.query;
    let q = `SELECT s.*, d.name AS dept_name FROM students s
             LEFT JOIN departments d ON s.department_id = d.id WHERE s.is_active = 1`;
    const params = [];
    if (dept)   { q += ' AND s.department_id = ?'; params.push(dept); }
    if (sem)    { q += ' AND s.semester = ?';      params.push(sem); }
    if (search) { q += ' AND (s.name LIKE ? OR s.student_id LIKE ? OR s.email LIKE ?)';
                  params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    const offset = (page - 1) * limit;
    q += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);
    const [rows] = await pool.query(q, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM students WHERE is_active=1');
    res.json({ success: true, data: rows, total, page: +page, limit: +limit });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [[total]]     = await pool.query('SELECT COUNT(*) AS cnt FROM students WHERE is_active=1');
    const [[newThis]]   = await pool.query("SELECT COUNT(*) AS cnt FROM students WHERE MONTH(created_at)=MONTH(NOW()) AND YEAR(created_at)=YEAR(NOW())");
    const [byDept]      = await pool.query(`SELECT d.name, COUNT(s.id) AS count FROM students s LEFT JOIN departments d ON s.department_id=d.id GROUP BY d.id`);
    const [bySem]       = await pool.query('SELECT semester, COUNT(*) AS count FROM students GROUP BY semester');
    res.json({ success: true, data: { total: total.cnt, newThisMonth: newThis.cnt, byDept, bySem } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, d.name AS dept_name FROM students s LEFT JOIN departments d ON s.department_id=d.id WHERE s.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Student not found.' });
    const { password: _, ...safe } = rows[0];
    res.json({ success: true, data: safe });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, phone, dob, gender, address, department_id, semester, batch_year, guardian_name, guardian_phone } = req.body;
    const hashed = await bcrypt.hash(password || 'Student@123', 10);
    const [[{ cnt }]] = await pool.query('SELECT COUNT(*) AS cnt FROM students');
    const student_id = `STU${String(cnt + 1).padStart(3, '0')}`;
    const [result] = await pool.query(
      `INSERT INTO students (student_id,name,email,password,phone,dob,gender,address,department_id,semester,batch_year,guardian_name,guardian_phone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [student_id, name, email, hashed, phone, dob, gender, address, department_id, semester || 1, batch_year, guardian_name, guardian_phone]
    );
    res.status(201).json({ success: true, message: 'Student created.', id: result.insertId, student_id });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { name, phone, dob, gender, address, department_id, semester, guardian_name, guardian_phone } = req.body;
    await pool.query(
      `UPDATE students SET name=?,phone=?,dob=?,gender=?,address=?,department_id=?,semester=?,guardian_name=?,guardian_phone=? WHERE id=?`,
      [name, phone, dob, gender, address, department_id, semester, guardian_name, guardian_phone, req.params.id]
    );
    res.json({ success: true, message: 'Student updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('UPDATE students SET is_active=0 WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Student deactivated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const url = `/uploads/images/${req.file.filename}`;
    await pool.query('UPDATE students SET avatar=? WHERE id=?', [url, req.params.id]);
    res.json({ success: true, message: 'Avatar updated.', url });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
