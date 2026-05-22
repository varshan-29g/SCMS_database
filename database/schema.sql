-- ============================================================
-- SMART CAMPUS MANAGEMENT SYSTEM (SCMS)
-- Database Schema - MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS scmsd1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scmsd1;

-- ============================================================
-- 1. ADMIN TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    avatar      VARCHAR(255),
    is_active   TINYINT(1) DEFAULT 1,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. DEPARTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL UNIQUE,
    code        VARCHAR(20) NOT NULL UNIQUE,
    hod_name    VARCHAR(100),
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 3. FACULTY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS faculty (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    faculty_id      VARCHAR(20) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    department_id   INT UNSIGNED,
    designation     VARCHAR(100),
    qualification   VARCHAR(150),
    experience_yrs  INT DEFAULT 0,
    avatar          VARCHAR(255),
    is_active       TINYINT(1) DEFAULT 1,
    joined_date     DATE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_faculty_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 4. STUDENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id      VARCHAR(20) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    dob             DATE,
    gender          ENUM('Male','Female','Other'),
    address         TEXT,
    department_id   INT UNSIGNED,
    semester        INT DEFAULT 1,
    batch_year      INT,
    guardian_name   VARCHAR(100),
    guardian_phone  VARCHAR(20),
    avatar          VARCHAR(255),
    is_active       TINYINT(1) DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 5. COURSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(20) NOT NULL UNIQUE,
    department_id   INT UNSIGNED,
    semester        INT NOT NULL,
    credits         INT DEFAULT 3,
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 6. SUBJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS subjects (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(20) NOT NULL UNIQUE,
    course_id       INT UNSIGNED,
    faculty_id      INT UNSIGNED,
    semester        INT NOT NULL,
    credits         INT DEFAULT 3,
    type            ENUM('Theory','Lab','Elective') DEFAULT 'Theory',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subject_course  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE SET NULL,
    CONSTRAINT fk_subject_faculty FOREIGN KEY (faculty_id) REFERENCES faculty(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 7. ATTENDANCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id  INT UNSIGNED NOT NULL,
    subject_id  INT UNSIGNED NOT NULL,
    date        DATE NOT NULL,
    status      ENUM('Present','Absent','Late') DEFAULT 'Absent',
    marked_by   INT UNSIGNED,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_attendance (student_id, subject_id, date),
    CONSTRAINT fk_att_student  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_att_subject  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_att_faculty  FOREIGN KEY (marked_by)  REFERENCES faculty(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 8. EXAMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS exams (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    subject_id      INT UNSIGNED NOT NULL,
    exam_date       DATE NOT NULL,
    start_time      TIME,
    end_time        TIME,
    hall             VARCHAR(50),
    max_marks       INT DEFAULT 100,
    passing_marks   INT DEFAULT 40,
    semester        INT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exam_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 9. RESULTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS results (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id  INT UNSIGNED NOT NULL,
    exam_id     INT UNSIGNED NOT NULL,
    marks       DECIMAL(5,2) DEFAULT 0,
    grade       VARCHAR(5),
    remarks     VARCHAR(200),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_result (student_id, exam_id),
    CONSTRAINT fk_result_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_result_exam    FOREIGN KEY (exam_id)    REFERENCES exams(id)    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 10. FEES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS fees (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id      INT UNSIGNED NOT NULL,
    fee_type        VARCHAR(100) NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    due_date        DATE,
    paid_date       DATE,
    status          ENUM('Paid','Pending','Overdue','Waived') DEFAULT 'Pending',
    receipt_no      VARCHAR(50) UNIQUE,
    payment_mode    ENUM('Cash','Online','DD','Cheque') DEFAULT 'Online',
    scholarship     DECIMAL(10,2) DEFAULT 0,
    remarks         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fee_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 11. LIBRARY BOOKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS library_books (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(250) NOT NULL,
    author          VARCHAR(150),
    isbn            VARCHAR(20) UNIQUE,
    publisher       VARCHAR(150),
    edition         VARCHAR(50),
    category        VARCHAR(100),
    total_copies    INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    shelf_location  VARCHAR(50),
    added_date      DATE,
    cover_image     VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 12. ISSUED BOOKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS issued_books (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    book_id     INT UNSIGNED NOT NULL,
    student_id  INT UNSIGNED,
    faculty_id  INT UNSIGNED,
    issue_date  DATE NOT NULL,
    due_date    DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(8,2) DEFAULT 0,
    fine_paid   TINYINT(1) DEFAULT 0,
    status      ENUM('Issued','Returned','Overdue') DEFAULT 'Issued',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_issue_book    FOREIGN KEY (book_id)    REFERENCES library_books(id) ON DELETE CASCADE,
    CONSTRAINT fk_issue_student FOREIGN KEY (student_id) REFERENCES students(id)      ON DELETE SET NULL,
    CONSTRAINT fk_issue_faculty FOREIGN KEY (faculty_id) REFERENCES faculty(id)       ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 13. HOSTEL ROOMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS hostel_rooms (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    room_no     VARCHAR(20) NOT NULL UNIQUE,
    block       VARCHAR(10) NOT NULL,
    floor       INT NOT NULL,
    capacity    INT DEFAULT 2,
    occupied    INT DEFAULT 0,
    type        ENUM('Single','Double','Triple') DEFAULT 'Double',
    facilities  TEXT,
    monthly_fee DECIMAL(8,2) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 14. HOSTEL ALLOCATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS hostel_allocations (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id  INT UNSIGNED NOT NULL UNIQUE,
    room_id     INT UNSIGNED NOT NULL,
    allot_date  DATE NOT NULL,
    vacate_date DATE,
    status      ENUM('Active','Vacated') DEFAULT 'Active',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alloc_student FOREIGN KEY (student_id) REFERENCES students(id)     ON DELETE CASCADE,
    CONSTRAINT fk_alloc_room    FOREIGN KEY (room_id)    REFERENCES hostel_rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 15. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    message     TEXT NOT NULL,
    type        ENUM('Info','Warning','Exam','Fee','Event','Circular') DEFAULT 'Info',
    target_role ENUM('All','Student','Faculty','Admin') DEFAULT 'All',
    target_id   INT UNSIGNED,
    is_read     TINYINT(1) DEFAULT 0,
    created_by  INT UNSIGNED,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 16. TIMETABLE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS timetable (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subject_id  INT UNSIGNED NOT NULL,
    faculty_id  INT UNSIGNED,
    day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    room        VARCHAR(50),
    semester    INT,
    department_id INT UNSIGNED,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tt_subject FOREIGN KEY (subject_id)    REFERENCES subjects(id)     ON DELETE CASCADE,
    CONSTRAINT fk_tt_faculty FOREIGN KEY (faculty_id)    REFERENCES faculty(id)      ON DELETE SET NULL,
    CONSTRAINT fk_tt_dept   FOREIGN KEY (department_id) REFERENCES departments(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 17. LEAVE REQUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS leave_requests (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    faculty_id  INT UNSIGNED NOT NULL,
    leave_type  ENUM('Sick','Casual','Earned','Maternity','Others') DEFAULT 'Casual',
    from_date   DATE NOT NULL,
    to_date     DATE NOT NULL,
    reason      TEXT,
    status      ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    approved_by INT UNSIGNED,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_faculty FOREIGN KEY (faculty_id)  REFERENCES faculty(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_admin   FOREIGN KEY (approved_by) REFERENCES admin(id)   ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 18. ACTIVITY LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED,
    role        ENUM('Admin','Student','Faculty'),
    action      VARCHAR(255),
    description TEXT,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
