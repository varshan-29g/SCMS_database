const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { subject_id, date, status, page = 1, limit = 50 } = req.query;
    let q = `SELECT a.*, s.name AS student_name, s.student_id AS roll_no, sub.name AS subject_name
             FROM attendance a
             JOIN students s ON a.student_id=s.id
             JOIN subjects sub ON a.subject_id=sub.id WHERE 1=1`;
    const params = [];
    if (subject_id) { q += ' AND a.subject_id=?'; params.push(subject_id); }
    if (date)       { q += ' AND a.date=?';       params.push(date); }
    if (status)     { q += ' AND a.status=?';     params.push(status); }
    q += ` ORDER BY a.date DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (page-1)*parseInt(limit));
    const [rows] = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getByStudent = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, sub.name AS subject_name, sub.code AS subject_code
       FROM attendance a JOIN subjects sub ON a.subject_id=sub.id
       WHERE a.student_id=? ORDER BY a.date DESC`,
      [req.params.studentId]
    );
    // Calculate percentage per subject
    const grouped = {};
    rows.forEach(r => {
      if (!grouped[r.subject_id]) grouped[r.subject_id] = { subject_name: r.subject_name, subject_code: r.subject_code, total: 0, present: 0, records: [] };
      grouped[r.subject_id].total++;
      if (r.status === 'Present' || r.status === 'Late') grouped[r.subject_id].present++;
      grouped[r.subject_id].records.push(r);
    });
    Object.values(grouped).forEach(g => { g.percentage = g.total ? ((g.present / g.total) * 100).toFixed(1) : 0; });
    res.json({ success: true, data: Object.values(grouped) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getBySubject = async (req, res) => {
  try {
    const { date } = req.query;
    let q = `SELECT a.*, s.name AS student_name, s.student_id AS roll_no FROM attendance a JOIN students s ON a.student_id=s.id WHERE a.subject_id=?`;
    const params = [req.params.subjectId];
    if (date) { q += ' AND a.date=?'; params.push(date); }
    const [rows] = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.mark = async (req, res) => {
  try {
    const { student_id, subject_id, date, status } = req.body;
    await pool.query(
      `INSERT INTO attendance (student_id, subject_id, date, status, marked_by) VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE status=?, marked_by=?`,
      [student_id, subject_id, date, status, req.user.id, status, req.user.id]
    );
    res.json({ success: true, message: 'Attendance marked.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.bulkMark = async (req, res) => {
  try {
    const { subject_id, date, records } = req.body; // records: [{student_id, status}]
    const values = records.map(r => [r.student_id, subject_id, date, r.status, req.user.id]);
    await pool.query(
      `INSERT INTO attendance (student_id, subject_id, date, status, marked_by) VALUES ?
       ON DUPLICATE KEY UPDATE status=VALUES(status), marked_by=VALUES(marked_by)`,
      [values]
    );
    res.json({ success: true, message: `Attendance marked for ${records.length} students.` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE attendance SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true, message: 'Attendance updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getLowAttendance = async (req, res) => {
  try {
    const threshold = req.query.threshold || 75;
    const [rows] = await pool.query(`
      SELECT s.id, s.name, s.student_id AS roll_no, sub.name AS subject_name,
             COUNT(a.id) AS total,
             SUM(CASE WHEN a.status IN ('Present','Late') THEN 1 ELSE 0 END) AS present,
             ROUND(SUM(CASE WHEN a.status IN ('Present','Late') THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id), 1) AS percentage
      FROM attendance a
      JOIN students s ON a.student_id=s.id
      JOIN subjects sub ON a.subject_id=sub.id
      GROUP BY s.id, sub.id
      HAVING percentage < ? AND total > 0
      ORDER BY percentage ASC
    `, [threshold]);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getReport = async (req, res) => {
  try {
    const { subject_id, from, to } = req.query;
    const [rows] = await pool.query(`
      SELECT s.name, s.student_id AS roll_no,
             COUNT(a.id) AS total,
             SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,
             SUM(CASE WHEN a.status='Absent'  THEN 1 ELSE 0 END) AS absent,
             SUM(CASE WHEN a.status='Late'    THEN 1 ELSE 0 END) AS late,
             ROUND(SUM(CASE WHEN a.status IN ('Present','Late') THEN 1 ELSE 0 END)*100.0/COUNT(a.id),1) AS percentage
      FROM attendance a JOIN students s ON a.student_id=s.id
      WHERE a.subject_id=? AND a.date BETWEEN ? AND ?
      GROUP BY s.id ORDER BY s.name
    `, [subject_id, from, to]);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [monthly] = await pool.query(`
      SELECT MONTHNAME(date) AS month, MONTH(date) AS m,
             SUM(CASE WHEN status IN ('Present','Late') THEN 1 ELSE 0 END) AS present,
             COUNT(*) AS total
      FROM attendance WHERE YEAR(date)=YEAR(NOW())
      GROUP BY MONTH(date) ORDER BY m
    `);
    const [bySubject] = await pool.query(`
      SELECT sub.name AS subject,
             ROUND(SUM(CASE WHEN a.status IN ('Present','Late') THEN 1 ELSE 0 END)*100.0/COUNT(a.id),1) AS avg_pct
      FROM attendance a JOIN subjects sub ON a.subject_id=sub.id
      GROUP BY sub.id ORDER BY avg_pct DESC
    `);
    res.json({ success: true, data: { monthly, bySubject } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
