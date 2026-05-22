-- Add test student: Arjun Mehta
INSERT INTO students (student_id, name, email, password, phone, dob, gender, department_id, semester, batch_year, guardian_name, guardian_phone) 
VALUES ('STU002', 'Arjun Mehta', 'arjun@student.scms.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17ltu2', '8111222333', '2004-03-15', 'Male', 1, 5, 2022, 'Suresh Mehta', '9111000001')
ON DUPLICATE KEY UPDATE id=id;
