const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departments ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departments WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Department not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, code, hod_name, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO departments (name, code, hod_name, description) VALUES (?,?,?,?)',
      [name, code, hod_name, description]
    );
    res.status(201).json({ success: true, message: 'Department created.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { name, code, hod_name, description } = req.body;
    await pool.query(
      'UPDATE departments SET name=?, code=?, hod_name=?, description=? WHERE id=?',
      [name, code, hod_name, description, req.params.id]
    );
    res.json({ success: true, message: 'Department updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM departments WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Department deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
