require('dotenv').config();
const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const { Server } = require('socket.io');

// DB test on startup
require('./config/db');

const app    = express();
const server = http.createServer(app);

// ─── Socket.io ──────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', socket => {
  console.log(`🔌  Socket connected: ${socket.id}`);
  socket.on('join_room', room => socket.join(room));
  socket.on('disconnect', () => console.log(`🔌  Socket disconnected: ${socket.id}`));
});

app.set('io', io); // Make io accessible in controllers

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many requests, please try again later.' }
}));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth.routes'));
app.use('/api/students',      require('./routes/student.routes'));
app.use('/api/faculty',       require('./routes/faculty.routes'));
app.use('/api/departments',   require('./routes/department.routes'));
app.use('/api/courses',       require('./routes/course.routes'));
app.use('/api/attendance',    require('./routes/attendance.routes'));
app.use('/api/exams',         require('./routes/exam.routes'));
app.use('/api/fees',          require('./routes/fee.routes'));
app.use('/api/library',       require('./routes/library.routes'));
app.use('/api/hostel',        require('./routes/hostel.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/timetable',     require('./routes/timetable.routes'));

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SCMS API is running', timestamp: new Date() });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥  Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀  SCMS API running at http://localhost:${PORT}`);
  console.log(`📡  Socket.io ready`);
});
