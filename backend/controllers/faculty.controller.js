const pool   = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const { dept, search, page = 1, limit = 20 } = req.query;
    let q = `SELECT f.*, d.name AS dept_name FROM faculty f LEFT JOIN departments d ON f.department_id=d.id WHERE f.is_active=1`;
    const params = [];
    if (dept)   { q += ' AND f.department_id = ?'; params.push(dept); }
    if (search) { q += ' AND (f.name LIKE ? OR f.faculty_id LIKE ? OR f.email LIKE ?)'; params.push(`%${search}%`,`%${search}%`,`%${search}%`); }
    q += ` ORDER BY f.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (page-1)*parseInt(limit));
    const [rows] = await pool.query(q, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM faculty WHERE is_active=1');
    res.json({ success: true, data: rows.map(r => { delete r.password; return r; }), total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [[total]] = await pool.query('SELECT COUNT(*) AS cnt FROM faculty WHERE is_active=1');
    const [byDept]  = await pool.query(`SELECT d.name, COUNT(f.id) AS count FROM faculty f LEFT JOIN departments d ON f.department_id=d.id GROUP BY d.id`);
    res.json({ success: true, data: { total: total.cnt, byDept } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, d.name AS dept_name FROM faculty f LEFT JOIN departments d ON f.department_id=d.id WHERE f.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Faculty not found.' });
    const { password: _, ...safe } = rows[0];
    res.json({ success: true, data: safe });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, phone, department_id, designation, qualification, experience_yrs, joined_date } = req.body;
    const hashed = await bcrypt.hash(password || 'Faculty@123', 10);
    const [[{ cnt }]] = await pool.query('SELECT COUNT(*) AS cnt FROM faculty');
    const faculty_id = `FAC${String(cnt + 1).padStart(3, '0')}`;
    const [result] = await pool.query(
      `INSERT INTO faculty (faculty_id,name,email,password,phone,department_id,designation,qualification,experience_yrs,joined_date) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [faculty_id, name, email, hashed, phone, department_id, designation, qualification, experience_yrs || 0, joined_date]
    );
    res.status(201).json({ success: true, message: 'Faculty created.', id: result.insertId, faculty_id });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { name, phone, department_id, designation, qualification, experience_yrs } = req.body;
    await pool.query(
      `UPDATE faculty SET name=?,phone=?,department_id=?,designation=?,qualification=?,experience_yrs=? WHERE id=?`,
      [name, phone, department_id, designation, qualification, experience_yrs, req.params.id]
    );
    res.json({ success: true, message: 'Faculty updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('UPDATE faculty SET is_active=0 WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Faculty deactivated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
    const url = `/uploads/images/${req.file.filename}`;
    await pool.query('UPDATE faculty SET avatar=? WHERE id=?', [url, req.params.id]);
    res.json({ success: true, url });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getSubjects = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, c.name AS course_name FROM subjects s LEFT JOIN courses c ON s.course_id=c.id WHERE s.faculty_id=?`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.applyLeave = async (req, res) => {
  try {
    const { leave_type, from_date, to_date, reason } = req.body;
    const faculty_id = req.user.id;
    await pool.query(
      'INSERT INTO leave_requests (faculty_id, leave_type, from_date, to_date, reason) VALUES (?,?,?,?,?)',
      [faculty_id, leave_type, from_date, to_date, reason]
    );
    res.status(201).json({ success: true, message: 'Leave request submitted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllLeaves = async (req, res) => {
  try {
    let q = `SELECT lr.*, f.name AS faculty_name, f.faculty_id FROM leave_requests lr
       JOIN faculty f ON lr.faculty_id=f.id`;
    const params = [];
    if (req.user.role === 'Faculty') {
      q += ` WHERE lr.faculty_id = ?`;
      params.push(req.user.id);
    }
    q += ` ORDER BY lr.created_at DESC`;
    const [rows] = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query(
      'UPDATE leave_requests SET status=?, approved_by=? WHERE id=?',
      [status, req.user.id, req.params.leaveId]
    );
    res.json({ success: true, message: `Leave ${status}.` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
    const url = `/uploads/pdfs/${req.file.filename}`;
    res.json({ success: true, message: 'Material uploaded.', url });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
