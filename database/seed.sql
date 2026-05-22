-- ============================================================
-- SCMS SEED DATA
-- ============================================================
USE scmsd1;

-- Clear existing data before seeding
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE leave_requests;
TRUNCATE TABLE timetable;
TRUNCATE TABLE notifications;
TRUNCATE TABLE hostel_allocations;
TRUNCATE TABLE hostel_rooms;
TRUNCATE TABLE issued_books;
TRUNCATE TABLE library_books;
TRUNCATE TABLE fees;
TRUNCATE TABLE results;
TRUNCATE TABLE exams;
TRUNCATE TABLE attendance;
TRUNCATE TABLE subjects;
TRUNCATE TABLE courses;
TRUNCATE TABLE students;
TRUNCATE TABLE faculty;
TRUNCATE TABLE departments;
TRUNCATE TABLE admin;
SET FOREIGN_KEY_CHECKS = 1;

-- Admin (password: Admin@123)
INSERT INTO admin (name, email, password, phone) VALUES
('Super Admin', 'admin@scms.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '9876543210');

-- Departments
INSERT INTO departments (name, code, hod_name, description) VALUES
('Computer Science & Engineering', 'CSE', 'Dr. Ramesh Kumar', 'Flagship CS department'),
('Electronics & Communication',    'ECE', 'Dr. Priya Singh',  'Electronics and communication systems'),
('Mechanical Engineering',         'ME',  'Dr. Anil Sharma',  'Mechanical and manufacturing systems'),
('Civil Engineering',              'CE',  'Dr. Neha Verma',   'Civil and structural engineering'),
('Information Technology',         'IT',  'Dr. Vikram Das',   'IT and systems department');

-- Faculty (password: Faculty@123)
INSERT INTO faculty (faculty_id, name, email, password, phone, department_id, designation, qualification, experience_yrs, joined_date) VALUES
('FAC001', 'Dr. Ramesh Kumar',  'ramesh@scms.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '9111222333', 1, 'Professor',          'PhD CSE',  15, '2010-07-01'),
('FAC002', 'Dr. Priya Singh',   'priya@scms.edu',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '9222333444', 2, 'Associate Professor', 'PhD ECE',  10, '2014-07-01'),
('FAC003', 'Prof. Anil Sharma', 'anil@scms.edu',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '9333444555', 3, 'Assistant Professor', 'M.Tech ME', 6, '2018-07-01'),
('FAC004', 'Dr. Neha Verma',    'neha@scms.edu',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '9444555666', 4, 'Professor',           'PhD CE',   12, '2012-07-01'),
('FAC005', 'Dr. Vikram Das',    'vikram@scms.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '9555666777', 5, 'Associate Professor', 'PhD IT',    8, '2016-07-01');

-- Students (password: Student@123)
INSERT INTO students (student_id, name, email, password, phone, dob, gender, department_id, semester, batch_year, guardian_name, guardian_phone) VALUES
('STU001', 'Arjun Mehta',    'arjun@student.scms.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8111222333', '2004-03-15', 'Male',   1, 5, 2022, 'Suresh Mehta',  '9111000001'),
('STU002', 'Sneha Patil',    'sneha@student.scms.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8222333444', '2003-07-22', 'Female', 1, 5, 2022, 'Rakesh Patil',  '9111000002'),
('STU003', 'Rohit Gupta',    'rohit@student.scms.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8333444555', '2004-01-10', 'Male',   2, 3, 2023, 'Mohan Gupta',   '9111000003'),
('STU004', 'Anjali Rao',     'anjali@student.scms.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8444555666', '2003-11-05', 'Female', 1, 7, 2021, 'Venkat Rao',    '9111000004'),
('STU005', 'Karan Singh',    'karan@student.scms.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8555666777', '2004-06-30', 'Male',   3, 3, 2023, 'Harpal Singh',  '9111000005'),
('STU006', 'Divya Nair',     'divya@student.scms.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8666777888', '2003-09-14', 'Female', 5, 5, 2022, 'Gopan Nair',    '9111000006'),
('STU007', 'Aakash Joshi',   'aakash@student.scms.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8777888999', '2004-04-18', 'Male',   1, 5, 2022, 'Deepak Joshi',  '9111000007'),
('STU008', 'Meera Iyer',     'meera@student.scms.edu',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8888999000', '2003-12-25', 'Female', 2, 3, 2023, 'Suresh Iyer',   '9111000008');

-- Courses
INSERT INTO courses (name, code, department_id, semester, credits, description) VALUES
('B.Tech Computer Science',          'BTCS', 1, 8, 160, 'Four year CSE program'),
('B.Tech Electronics',               'BTEC', 2, 8, 160, 'Four year ECE program'),
('B.Tech Mechanical',                'BTME', 3, 8, 160, 'Four year ME program'),
('B.Tech Information Technology',    'BTIT', 5, 8, 160, 'Four year IT program');

-- Subjects
INSERT INTO subjects (name, code, course_id, faculty_id, semester, credits, type) VALUES
('Data Structures & Algorithms', 'CS301', 1, 1, 3, 4, 'Theory'),
('Database Management Systems',  'CS302', 1, 1, 3, 4, 'Theory'),
('Operating Systems',            'CS303', 1, 2, 3, 4, 'Theory'),
('Computer Networks',            'CS401', 1, 1, 4, 3, 'Theory'),
('Machine Learning',             'CS501', 1, 1, 5, 4, 'Theory'),
('Digital Electronics',          'EC301', 2, 2, 3, 4, 'Theory'),
('Signal Processing',            'EC302', 2, 2, 3, 4, 'Theory'),
('Web Technologies',             'IT301', 4, 5, 3, 3, 'Theory'),
('Python Programming Lab',       'CS3L1', 1, 1, 3, 2, 'Lab');

-- Attendance
INSERT INTO attendance (student_id, subject_id, date, status, marked_by) VALUES
(1, 1, '2024-01-08', 'Present', 1),
(1, 1, '2024-01-09', 'Present', 1),
(1, 1, '2024-01-10', 'Absent',  1),
(1, 2, '2024-01-08', 'Present', 1),
(1, 2, '2024-01-09', 'Late',    1),
(2, 1, '2024-01-08', 'Present', 1),
(2, 1, '2024-01-09', 'Absent',  1),
(3, 6, '2024-01-08', 'Present', 2),
(3, 6, '2024-01-09', 'Present', 2),
(4, 5, '2024-01-08', 'Present', 1),
(5, 6, '2024-01-08', 'Absent',  2);

-- Exams
INSERT INTO exams (name, subject_id, exam_date, start_time, end_time, hall, max_marks, passing_marks, semester) VALUES
('Mid Semester Exam - DSA',  1, '2024-03-15', '09:00', '12:00', 'Hall A', 100, 40, 3),
('Mid Semester Exam - DBMS', 2, '2024-03-16', '09:00', '12:00', 'Hall A', 100, 40, 3),
('End Semester Exam - OS',   3, '2024-05-10', '09:00', '12:00', 'Hall B', 100, 40, 3),
('Practical Exam - Python',  9, '2024-05-12', '10:00', '13:00', 'Lab 1',  50,  20, 3);

-- Results
INSERT INTO results (student_id, exam_id, marks, grade, remarks) VALUES
(1, 1, 87.0, 'A',  'Excellent'),
(1, 2, 72.5, 'B+', 'Good'),
(2, 1, 65.0, 'B',  'Good'),
(2, 2, 55.0, 'C',  'Average'),
(3, 3, 91.0, 'O',  'Outstanding'),
(4, 1, 78.0, 'B+', 'Good'),
(5, 3, 48.0, 'C',  'Average'),
(6, 2, 35.0, 'F',  'Failed');

-- Fees
INSERT INTO fees (student_id, fee_type, amount, due_date, paid_date, status, receipt_no, payment_mode, scholarship) VALUES
(1, 'Tuition Fee Sem 5',  45000, '2024-01-15', '2024-01-12', 'Paid',    'RCP-2024-001', 'Online', 5000),
(1, 'Hostel Fee',         12000, '2024-01-15', '2024-01-12', 'Paid',    'RCP-2024-002', 'Online', 0),
(2, 'Tuition Fee Sem 5',  45000, '2024-01-15', NULL,         'Pending', NULL,            'Online', 0),
(3, 'Tuition Fee Sem 3',  45000, '2024-01-15', '2024-01-10', 'Paid',    'RCP-2024-003', 'Cash',   0),
(4, 'Tuition Fee Sem 7',  45000, '2024-01-15', NULL,         'Overdue', NULL,            'Online', 0),
(5, 'Tuition Fee Sem 3',  45000, '2024-01-15', '2024-01-08', 'Paid',    'RCP-2024-004', 'DD',     10000),
(6, 'Tuition Fee Sem 5',  45000, '2024-02-15', NULL,         'Pending', NULL,            'Online', 0),
(7, 'Exam Fee',            2500, '2024-03-01', '2024-02-28', 'Paid',    'RCP-2024-005', 'Online', 0),
(8, 'Library Fine',         150, '2024-01-20', NULL,         'Pending', NULL,            'Cash',   0);

-- Library Books
INSERT INTO library_books (title, author, isbn, publisher, edition, category, total_copies, available_copies, shelf_location, added_date) VALUES
('Introduction to Algorithms',     'Cormen, Leiserson',  '9780262033848', 'MIT Press',     '4th', 'Computer Science', 5, 3, 'A-101', '2020-01-10'),
('Database System Concepts',       'Silberschatz',       '9780073523323', 'McGraw-Hill',   '7th', 'Databases',        4, 2, 'A-102', '2020-01-10'),
('Operating System Concepts',      'Silberschatz',       '9781118063330', 'Wiley',         '9th', 'Computer Science', 3, 3, 'A-103', '2020-01-10'),
('Computer Networks',              'Andrew Tanenbaum',   '9780132126953', 'Pearson',       '5th', 'Networking',       4, 4, 'B-101', '2021-03-15'),
('Digital Electronics',            'Morris Mano',        '9780132359405', 'Pearson',       '4th', 'Electronics',      6, 5, 'B-201', '2021-03-15'),
('Artificial Intelligence',        'Russell & Norvig',   '9780134610993', 'Pearson',       '4th', 'AI/ML',            3, 1, 'C-101', '2022-06-01'),
('Clean Code',                     'Robert C. Martin',   '9780132350884', 'Prentice Hall', '1st', 'Software Eng',     2, 2, 'C-201', '2022-06-01'),
('The Pragmatic Programmer',       'Hunt & Thomas',      '9780135957059', 'Addison-Wesley','2nd', 'Software Eng',     2, 1, 'C-202', '2022-06-01'),
('Machine Learning',               'Tom Mitchell',       '9780070428077', 'McGraw-Hill',   '1st', 'AI/ML',            3, 3, 'C-102', '2023-01-05'),
('Engineering Mathematics',        'B.S. Grewal',        '9788174091955', 'Khanna Pub',    '44th','Mathematics',      8, 7, 'D-101', '2020-01-10');

-- Issued Books
INSERT INTO issued_books (book_id, student_id, issue_date, due_date, return_date, fine_amount, fine_paid, status) VALUES
(1, 1, '2024-01-10', '2024-01-24', '2024-01-23', 0,   1, 'Returned'),
(2, 2, '2024-01-05', '2024-01-19', NULL,          0,   0, 'Overdue'),
(6, 3, '2024-01-12', '2024-01-26', NULL,          0,   0, 'Issued'),
(8, 4, '2023-12-20', '2024-01-03', NULL,          50,  0, 'Overdue'),
(4, 5, '2024-01-15', '2024-01-29', '2024-01-28', 0,   1, 'Returned');

-- Hostel Rooms
INSERT INTO hostel_rooms (room_no, block, floor, capacity, occupied, type, facilities, monthly_fee) VALUES
('A101', 'A', 1, 2, 2, 'Double', 'AC, WiFi, Attached Bath', 4000),
('A102', 'A', 1, 2, 1, 'Double', 'AC, WiFi, Attached Bath', 4000),
('A201', 'A', 2, 1, 0, 'Single', 'AC, WiFi, Attached Bath', 6000),
('B101', 'B', 1, 3, 2, 'Triple', 'Fan, WiFi, Common Bath',  2500),
('B102', 'B', 1, 3, 3, 'Triple', 'Fan, WiFi, Common Bath',  2500),
('B201', 'B', 2, 2, 0, 'Double', 'Fan, WiFi, Common Bath',  3000);

-- Hostel Allocations
INSERT INTO hostel_allocations (student_id, room_id, allot_date, status) VALUES
(1, 1, '2022-07-15', 'Active'),
(2, 1, '2022-07-15', 'Active'),
(3, 4, '2023-07-15', 'Active'),
(5, 4, '2023-07-15', 'Active');

-- Notifications
INSERT INTO notifications (title, message, type, target_role, created_by) VALUES
('Mid Semester Exams Schedule Released',    'Mid semester exams start from March 15th. Check timetable.',       'Exam',     'All',     1),
('Fee Payment Reminder',                    'Semester 5 fee due on Jan 15. Pay before the deadline.',           'Fee',      'Student', 1),
('Annual Technical Fest - TechStorm 2024',  'TechStorm 2024 registrations open. Last date: Feb 28.',           'Event',    'All',     1),
('Library Timing Change',                   'Library will now be open from 8 AM to 9 PM on weekdays.',         'Circular', 'All',     1),
('Low Attendance Alert',                    'Your attendance in CS302 is below 75%. Please attend classes.',    'Warning',  'Student', 1),
('Faculty Meeting',                         'Mandatory faculty meeting on Jan 20 at 2 PM in Conference Room.', 'Info',     'Faculty', 1);

-- Timetable
INSERT INTO timetable (subject_id, faculty_id, day_of_week, start_time, end_time, room, semester, department_id) VALUES
(1, 1, 'Monday',    '09:00', '10:00', 'Room 201', 3, 1),
(2, 1, 'Monday',    '10:00', '11:00', 'Room 201', 3, 1),
(3, 2, 'Monday',    '11:00', '12:00', 'Room 202', 3, 1),
(1, 1, 'Wednesday', '09:00', '10:00', 'Room 201', 3, 1),
(2, 1, 'Wednesday', '10:00', '11:00', 'Room 201', 3, 1),
(4, 1, 'Friday',    '09:00', '10:00', 'Room 201', 4, 1),
(6, 2, 'Tuesday',   '09:00', '10:00', 'Room 301', 3, 2),
(6, 2, 'Thursday',  '09:00', '10:00', 'Room 301', 3, 2);

-- Leave Requests
INSERT INTO leave_requests (faculty_id, leave_type, from_date, to_date, reason, status, approved_by) VALUES
(2, 'Sick',   '2024-01-18', '2024-01-19', 'Fever and cold',              'Approved', 1),
(3, 'Casual', '2024-01-25', '2024-01-26', 'Family function',             'Pending',  NULL),
(4, 'Earned', '2024-02-05', '2024-02-09', 'Conference in Delhi',         'Approved', 1),
(5, 'Casual', '2024-01-22', '2024-01-22', 'Personal work',               'Rejected', 1);
