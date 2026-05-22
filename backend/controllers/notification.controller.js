const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { role, target_id } = req.user;
    let q = `SELECT * FROM notifications WHERE (target_role='All' OR target_role=?)`;
    const params = [role];
    if (target_id) { q += ' OR target_id=?'; params.push(target_id); }
    q += ' ORDER BY created_at DESC LIMIT 50';
    const [rows] = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getUnread = async (req, res) => {
  try {
    const { role } = req.user;
    const [rows] = await pool.query(
      `SELECT * FROM notifications WHERE is_read=0 AND (target_role='All' OR target_role=?) ORDER BY created_at DESC`,
      [role]
    );
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, message, type, target_role, target_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO notifications (title, message, type, target_role, target_id, created_by) VALUES (?,?,?,?,?,?)',
      [title, message, type||'Info', target_role||'All', target_id||null, req.user.id]
    );
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('new_notification', { id: result.insertId, title, message, type, target_role });
    }
    res.status(201).json({ success: true, message: 'Notification sent.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read=1 WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Marked as read.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markAllRead = async (req, res) => {
  try {
    const { role } = req.user;
    await pool.query("UPDATE notifications SET is_read=1 WHERE target_role='All' OR target_role=?", [role]);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Notification deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
