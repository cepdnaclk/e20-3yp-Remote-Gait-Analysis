-- Roles (if they don't exist or if your tests depend on specific IDs)
INSERT INTO role(role_id, role_name) VALUES (1, 'ROLE_ADMIN');
INSERT INTO role(role_id, role_name) VALUES (2, 'ROLE_CLINIC');
INSERT INTO role(role_id, role_name) VALUES (3, 'ROLE_PATIENT');
INSERT INTO role(role_id, role_name) VALUES (4, 'ROLE_DOCTOR');

-- ADMIN user
-- password-password
INSERT INTO users(user_id, username, email, password)
VALUES (200, 'admin', 'admin@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id)
VALUES (200, 1);

-- CLINIC user (needed for the existing clinic)
-- password-password
INSERT INTO users(user_id, username, email, password)
VALUES (201, 'clinic1', 'clinic1@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id)
VALUES (201, 2);
-- Clinic entity linked to clinic1
INSERT INTO clinic(id, name, email, phone_number, created_at, user_id)
VALUES (301, 'Sunrise Clinic', 'clinic1@example.com', '0712345000', CURRENT_TIMESTAMP, 201);