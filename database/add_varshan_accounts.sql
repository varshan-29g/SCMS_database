-- Add Admin Account
INSERT INTO admin (name, email, password, phone, is_active) 
VALUES ('Varshan', 'varsh@scms.edu', '$2a$10$EW2Y3ppiPXpZvZdoeDuMpux4ACkd1ocIgpaJOCz95U08/99BE2pBy', '9999999999', 1)
ON DUPLICATE KEY UPDATE id=id;

-- Add Faculty Account  
INSERT INTO faculty (faculty_id, name, email, password, phone, department_id, designation, is_active) 
VALUES ('FAC999', 'Varshan', 'varsh@scms.edu', '$2a$10$EW2Y3ppiPXpZvZdoeDuMpux4ACkd1ocIgpaJOCz95U08/99BE2pBy', '9999999999', 1, 'Assistant Professor', 1)
ON DUPLICATE KEY UPDATE id=id;
