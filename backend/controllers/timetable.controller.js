const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT tt.*, sub.name AS subject_name, sub.code AS subject_code, f.name AS faculty_name, d.name AS dept_name
       FROM timetable tt
       LEFT JOIN subjects sub ON tt.subject_id=sub.id
       LEFT JOIN faculty f ON tt.faculty_id=f.id
       LEFT JOIN departments d ON tt.department_id=d.id
       ORDER BY FIELD(tt.day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), tt.start_time`
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getByDept = async (req, res) => {
  try {
    const { semester } = req.query;
    let q = `SELECT tt.*, sub.name AS subject_name, f.name AS faculty_name FROM timetable tt
             LEFT JOIN subjects sub ON tt.subject_id=sub.id LEFT JOIN faculty f ON tt.faculty_id=f.id
             WHERE tt.department_id=?`;
    const params = [req.params.deptId];
    if (semester) { q += ' AND tt.semester=?'; params.push(semester); }
    q += ` ORDER BY FIELD(tt.day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), tt.start_time`;
    const [rows] = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getByFaculty = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT tt.*, sub.name AS subject_name, sub.code, d.name AS dept_name FROM timetable tt
       LEFT JOIN subjects sub ON tt.subject_id=sub.id LEFT JOIN departments d ON tt.department_id=d.id
       WHERE tt.faculty_id=?
       ORDER BY FIELD(tt.day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), tt.start_time`,
      [req.params.fid]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getByStudent = async (req, res) => {
  try {
    const [[student]] = await pool.query('SELECT department_id, semester FROM students WHERE id=?', [req.params.sid]);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    const [rows] = await pool.query(
      `SELECT tt.*, sub.name AS subject_name, sub.code, f.name AS faculty_name FROM timetable tt
       LEFT JOIN subjects sub ON tt.subject_id=sub.id LEFT JOIN faculty f ON tt.faculty_id=f.id
       WHERE tt.department_id=? AND tt.semester=?
       ORDER BY FIELD(tt.day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), tt.start_time`,
      [student.department_id, student.semester]
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { subject_id, faculty_id, day_of_week, start_time, end_time, room, semester, department_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO timetable (subject_id,faculty_id,day_of_week,start_time,end_time,room,semester,department_id) VALUES (?,?,?,?,?,?,?,?)',
      [subject_id, faculty_id, day_of_week, start_time, end_time, room, semester, department_id]
    );
    res.status(201).json({ success: true, message: 'Timetable entry created.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { subject_id, faculty_id, day_of_week, start_time, end_time, room } = req.body;
    await pool.query(
      'UPDATE timetable SET subject_id=?,faculty_id=?,day_of_week=?,start_time=?,end_time=?,room=? WHERE id=?',
      [subject_id, faculty_id, day_of_week, start_time, end_time, room, req.params.id]
    );
    res.json({ success: true, message: 'Timetable updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM timetable WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Timetable entry deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
