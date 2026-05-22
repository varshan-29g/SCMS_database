const pool = require('../config/db');

exports.getAllRooms = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hostel_rooms ORDER BY block, room_no');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getRoomById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hostel_rooms WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Room not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createRoom = async (req, res) => {
  try {
    const { room_no, block, floor, capacity, type, facilities, monthly_fee } = req.body;
    const [result] = await pool.query(
      'INSERT INTO hostel_rooms (room_no,block,floor,capacity,type,facilities,monthly_fee) VALUES (?,?,?,?,?,?,?)',
      [room_no, block, floor, capacity||2, type||'Double', facilities, monthly_fee||0]
    );
    res.status(201).json({ success: true, message: 'Room created.', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateRoom = async (req, res) => {
  try {
    const { room_no, block, floor, capacity, type, facilities, monthly_fee } = req.body;
    await pool.query(
      'UPDATE hostel_rooms SET room_no=?,block=?,floor=?,capacity=?,type=?,facilities=?,monthly_fee=? WHERE id=?',
      [room_no, block, floor, capacity, type, facilities, monthly_fee, req.params.id]
    );
    res.json({ success: true, message: 'Room updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.removeRoom = async (req, res) => {
  try {
    await pool.query('DELETE FROM hostel_rooms WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Room deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllAllocations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ha.*, s.name AS student_name, s.student_id AS roll_no, hr.room_no, hr.block
       FROM hostel_allocations ha JOIN students s ON ha.student_id=s.id JOIN hostel_rooms hr ON ha.room_id=hr.id
       ORDER BY ha.allot_date DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.allocate = async (req, res) => {
  try {
    const { student_id, room_id, allot_date } = req.body;
    const [[room]] = await pool.query('SELECT capacity, occupied FROM hostel_rooms WHERE id=?', [room_id]);
    if (room.occupied >= room.capacity)
      return res.status(400).json({ success: false, message: 'Room is at full capacity.' });
    await pool.query(
      'INSERT INTO hostel_allocations (student_id, room_id, allot_date) VALUES (?,?,?)',
      [student_id, room_id, allot_date]
    );
    await pool.query('UPDATE hostel_rooms SET occupied=occupied+1 WHERE id=?', [room_id]);
    res.status(201).json({ success: true, message: 'Room allocated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.vacate = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hostel_allocations WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Allocation not found.' });
    await pool.query(
      "UPDATE hostel_allocations SET status='Vacated', vacate_date=CURDATE() WHERE id=?",
      [req.params.id]
    );
    await pool.query('UPDATE hostel_rooms SET occupied=MAX(0, occupied-1) WHERE id=?', [rows[0].room_id]);
    res.json({ success: true, message: 'Room vacated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getStudentAllocation = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ha.*, hr.room_no, hr.block, hr.floor, hr.type, hr.facilities, hr.monthly_fee
       FROM hostel_allocations ha JOIN hostel_rooms hr ON ha.room_id=hr.id
       WHERE ha.student_id=? AND ha.status='Active'`,
      [req.params.sid]
    );
    res.json({ success: true, data: rows[0] || null });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
