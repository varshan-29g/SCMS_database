-- ============================================================
-- SCMS Performance Indexes
-- ============================================================
USE scms_db;

-- Students
CREATE INDEX idx_students_dept    ON students   (department_id);
CREATE INDEX idx_students_sem     ON students   (semester);
CREATE INDEX idx_students_active  ON students   (is_active);
CREATE FULLTEXT INDEX ft_students ON students   (name, email);

-- Faculty
CREATE INDEX idx_faculty_dept     ON faculty    (department_id);
CREATE FULLTEXT INDEX ft_faculty  ON faculty    (name, email, designation);

-- Attendance
CREATE INDEX idx_att_date         ON attendance (date);
CREATE INDEX idx_att_status       ON attendance (status);
CREATE INDEX idx_att_student_sub  ON attendance (student_id, subject_id);

-- Fees
CREATE INDEX idx_fees_status      ON fees       (status);
CREATE INDEX idx_fees_due         ON fees       (due_date);

-- Library
CREATE INDEX idx_books_cat        ON library_books (category);
CREATE FULLTEXT INDEX ft_books    ON library_books (title, author, isbn);

-- Issued Books
CREATE INDEX idx_issue_status     ON issued_books  (status);
CREATE INDEX idx_issue_due        ON issued_books  (due_date);

-- Notifications
CREATE INDEX idx_notif_role       ON notifications (target_role);
CREATE INDEX idx_notif_read       ON notifications (is_read);

-- Results
CREATE INDEX idx_results_grade    ON results       (grade);

-- Timetable
CREATE INDEX idx_tt_day           ON timetable     (day_of_week);
CREATE INDEX idx_tt_sem_dept      ON timetable     (semester, department_id);

-- Activity Logs
CREATE INDEX idx_logs_role        ON activity_logs (role);
CREATE INDEX idx_logs_created     ON activity_logs (created_at);
