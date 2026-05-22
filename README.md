# 🎓 Smart Campus Management System (SCMS)

A **next-generation, full-stack Campus Management System** with a futuristic black-and-white glassmorphism UI, real-time notifications, and AI chatbot assistant.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JS |
| **Animations** | GSAP 3 + ScrollTrigger, Three.js (3D bg) |
| **Charts** | Chart.js 4 |
| **Backend** | Node.js + Express.js 4 |
| **Database** | MySQL 8.0 |
| **Auth** | JWT + bcryptjs (role-based) |
| **Real-time** | Socket.io 4 |
| **File Uploads** | Multer |
| **Security** | Helmet, express-rate-limit, CORS |

---

## 📁 Project Structure

```
DBMS SCMS/
├── database/
│   ├── schema.sql          ← All 18 tables (CREATE TABLE)
│   ├── seed.sql            ← Dummy data for all tables
│   └── indexes.sql         ← Performance indexes
├── backend/
│   ├── .env                ← Environment variables
│   ├── package.json
│   ├── server.js           ← Express + Socket.io entry
│   ├── config/db.js        ← MySQL connection pool
│   ├── middleware/
│   │   ├── auth.js         ← JWT + role guard
│   │   └── upload.js       ← Multer file uploads
│   ├── routes/             ← 12 route modules
│   └── controllers/        ← 12 controller modules
└── frontend/
    ├── index.html          ← Landing page
    ├── login.html          ← Login / Register
    ├── admin-dashboard.html
    ├── student-dashboard.html
    ├── faculty-dashboard.html
    ├── attendance.html
    ├── fee-management.html
    ├── library.html
    ├── hostel.html
    ├── notifications.html
    ├── timetable.html
    ├── profile.html
    ├── analytics.html
    ├── css/
    │   ├── main.css        ← Global design system, variables, layout
    │   ├── components.css  ← Cards, tables, modals, forms, toasts
    │   └── pages.css       ← Page-specific styles
    └── js/
        ├── main.js         ← Auth, API wrapper, chatbot, cursor, theme
        ├── sidebar.js      ← Dynamic sidebar builder
        ├── three-bg.js     ← Three.js 3D animated background
        ├── gsap-animations.js ← GSAP scroll animations
        ├── charts.js       ← Chart.js wrappers
        └── api.js          ← (imported via main.js)
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** v18+
- **MySQL Server** 8.0+ running locally

---

### Step 1 — Database Setup

Open MySQL shell and run:

```sql
SOURCE f:/PROJECTS/DBMS SCMS/database/schema.sql;
SOURCE f:/PROJECTS/DBMS SCMS/database/seed.sql;
SOURCE f:/PROJECTS/DBMS SCMS/database/indexes.sql;
```

Or via MySQL Workbench — open and execute each file in order.

---

### Step 2 — Backend Setup

```bash
cd "f:/PROJECTS/DBMS SCMS/backend"
npm install
```

Edit `.env` if needed (default credentials shown):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=scms_db
JWT_SECRET=scms_super_secret_jwt_key_2024_change_in_production
PORT=5000
```

Start the server:
```bash
npm run dev      # development (auto-restart)
# or
npm start        # production
```

✅ Server starts at `http://localhost:5000`

---

### Step 3 — Frontend

Simply open the frontend files in a browser. For best results, serve via a local HTTP server:

```bash
# Option 1: VS Code Live Server extension (recommended)
# Option 2: Python
cd "f:/PROJECTS/DBMS SCMS/frontend"
python -m http.server 3000

# Option 3: Node http-server
npx http-server ./frontend -p 3000
```

Then open: `http://localhost:3000`

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@scms.edu` | `Admin@123` |
| **Student** | `arjun@student.scms.edu` | `Student@123` |
| **Faculty** | `ramesh@scms.edu` | `Faculty@123` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login (Admin/Student/Faculty) |
| POST | `/api/auth/register` | Register Student/Faculty |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List all students (paginated) |
| GET | `/api/students/stats` | Student statistics |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Deactivate student |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/attendance` | All attendance records |
| GET | `/api/attendance/student/:id` | Student attendance by subject |
| POST | `/api/attendance/bulk-mark` | Bulk mark attendance |
| GET | `/api/attendance/low-attendance` | Students below threshold |
| GET | `/api/attendance/analytics` | Monthly + subject analytics |

> All other modules follow similar RESTful patterns.

---

## 🗄️ Database Schema (16 core tables)

```
admin, students, faculty, departments, courses, subjects,
attendance, exams, results, fees, library_books, issued_books,
hostel_rooms, hostel_allocations, notifications, timetable,
leave_requests, activity_logs
```

All tables use:
- ✅ Foreign key constraints
- ✅ ON DELETE CASCADE / SET NULL
- ✅ Unique constraints
- ✅ Performance indexes
- ✅ Full-text search indexes (students, faculty, books)

---

## ✨ Key Features

- 🎨 **Futuristic UI** — Black/white glassmorphism, Three.js 3D background, GSAP animations
- 🔐 **JWT Auth** — Role-based access (Admin / Student / Faculty)
- 📊 **Analytics** — Chart.js powered dashboards (bar, line, doughnut, pie)
- 🔔 **Real-time** — Socket.io notifications
- 🤖 **AI Chatbot** — Campus query assistant
- 📱 **Responsive** — Mobile-first sidebar collapse
- 🌙 **Dark Mode** — Toggle persisted to localStorage
- 👁 **Custom Cursor** — Smooth dot + ring follower
- 📚 **Library** — Book catalog, issue/return, fine calculation
- 🏠 **Hostel** — Visual room grid, allocation management
- 📅 **Timetable** — Dynamic weekly grid builder
- 📋 **Attendance** — Bulk marking, reports, low-attendance alerts

---

## 🏗️ Architecture

```
Client (Browser) ─── REST API ──→ Express Router ──→ Controller ──→ MySQL
                  ←── JSON ────                                   ↑ Pool
                                  Socket.io ←──────────────────── ↑
```

---

## 📝 Notes

- Default upload folder: `backend/uploads/` (auto-created)
- Passwords are hashed with **bcrypt** (10 salt rounds)
- JWT tokens expire in **7 days**
- Rate limiting: 50 requests per 15 minutes on `/api/auth`
- All SQL queries use **parameterized statements** (SQL injection safe)
- CORS is open (`*`) — restrict in production

---

*Built with ❤️ — Smart Campus Management System © 2024*
