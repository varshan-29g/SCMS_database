const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ success: false, message: 'Email, password and role are required.' });

    const tableMap = { Admin: 'admin', Student: 'students', Faculty: 'faculty' };
    const table    = tableMap[role];
    if (!table) return res.status(400).json({ success: false, message: 'Invalid role.' });

    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    if (user.is_active === 0)
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });

    const token = generateToken({ id: user.id, email: user.email, role, name: user.name });

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, role, action, description, ip_address) VALUES (?,?,?,?,?)',
      [user.id, role, 'LOGIN', `${role} logged in`, req.ip]
    );

    const { password: _, ...safeUser } = user;
    res.json({ success: true, message: 'Login successful', token, user: safeUser, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department_id, phone } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, message: 'All fields required.' });

    if (role === 'Admin')
      return res.status(403).json({ success: false, message: 'Admin registration not allowed via API.' });

    const table = role === 'Student' ? 'students' : 'faculty';
    const [exists] = await pool.query(`SELECT id FROM ${table} WHERE email = ?`, [email]);
    if (exists.length) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const prefix = role === 'Student' ? 'STU' : 'FAC';
    const [countRes] = await pool.query(`SELECT COUNT(*) as cnt FROM ${table}`);
    const uid = `${prefix}${String(countRes[0].cnt + 1).padStart(3, '0')}`;

    const idCol = role === 'Student' ? 'student_id' : 'faculty_id';
    await pool.query(
      `INSERT INTO ${table} (${idCol}, name, email, password, phone, department_id) VALUES (?,?,?,?,?,?)`,
      [uid, name, email, hashed, phone || null, department_id || null]
    );

    res.status(201).json({ success: true, message: `${role} registered successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
};
