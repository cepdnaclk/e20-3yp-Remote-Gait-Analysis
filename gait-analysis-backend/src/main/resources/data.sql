-- SELECT * from users;

-- ==============================
--           ROLES
-- ==============================
INSERT INTO role(role_id, role_name) VALUES (1, 'ROLE_ADMIN');
INSERT INTO role(role_id, role_name) VALUES (2, 'ROLE_CLINIC');
INSERT INTO role(role_id, role_name) VALUES (3, 'ROLE_PATIENT');
INSERT INTO role(role_id, role_name) VALUES (4, 'ROLE_DOCTOR');

-- ==============================
--           USERS
-- ==============================

-- ADMIN
INSERT INTO users(user_id, username, email, password)
VALUES (200, 'admin', 'admin@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i'); -- password: password
INSERT INTO user_role(user_id, role_id) VALUES (200, 1);

-- CLINIC 1
INSERT INTO users(user_id, username, email, password)
VALUES (300, 'clinic1', 'clinic1@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (300, 2);
INSERT INTO clinic(id, name, email, phone_number, created_at, user_id)
VALUES (301, 'Clinic 1', 'clinic1@example.com', '0712345000', CURRENT_TIMESTAMP, 300);

-- CLINIC 2
INSERT INTO users(user_id, username, email, password)
VALUES (301, 'clinic2', 'clinic2@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (301, 2);
INSERT INTO clinic(id, name, email, phone_number, created_at, user_id)
VALUES (302, 'Clinic 2', 'clinic2@example.com', '0712345111', CURRENT_TIMESTAMP, 301);

-- ==============================
--           DOCTORS
-- ==============================

-- Clinic 1 Doctors
INSERT INTO users(user_id, username, email, password)
VALUES (302, 'doctor1', 'doctor1@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (302, 4);
INSERT INTO doctor(id, name, email, phone_number, specialization, created_at, clinic_id, user_id)
VALUES (401, 'Dr. Alice', 'doctor1@example.com', '0771234000', 'Physio', CURRENT_TIMESTAMP, 301, 302);

INSERT INTO users(user_id, username, email, password)
VALUES (303, 'doctor2', 'doctor2@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (303, 4);
INSERT INTO doctor(id, name, email, phone_number, specialization, created_at, clinic_id, user_id)
VALUES (402, 'Dr. Bob', 'doctor2@example.com', '0771234011', 'Ortho', CURRENT_TIMESTAMP, 301, 303);

-- Clinic 2 Doctors
INSERT INTO users(user_id, username, email, password)
VALUES (304, 'doctor3', 'doctor3@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (304, 4);
INSERT INTO doctor(id, name, email, phone_number, specialization, created_at, clinic_id, user_id)
VALUES (403, 'Dr. Carol', 'doctor3@example.com', '0771234022', 'Neuro', CURRENT_TIMESTAMP, 302, 304);

INSERT INTO users(user_id, username, email, password)
VALUES (305, 'doctor4', 'doctor4@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (305, 4);
INSERT INTO doctor(id, name, email, phone_number, specialization, created_at, clinic_id, user_id)
VALUES (404, 'Dr. Dan', 'doctor4@example.com', '0771234033', 'Sports', CURRENT_TIMESTAMP, 302, 305);

-- ==============================
--         SENSOR KITS
-- ==============================

-- 6 for clinic1, 6 for clinic2, 4 unassigned
-- ID: 601–616, Serial: 1601–1616
INSERT INTO sensorkit(id, serial_no, firmware_version, status, clinic_id) VALUES
(601, 1601, 1, 'IN_USE', 301),
(602, 1602, 1, 'IN_USE', 301),
(603, 1603, 1, 'IN_USE', 301),
(604, 1604, 1, 'IN_USE', 301),
(605, 1605, 1, 'AVAILABLE', 301),
(606, 1606, 1, 'AVAILABLE', 301),

(607, 1607, 1, 'IN_USE', 302),
(608, 1608, 1, 'IN_USE', 302),
(609, 1609, 1, 'IN_USE', 302),
(610, 1610, 1, 'IN_USE', 302),
(611, 1611, 1, 'AVAILABLE', 302),
(612, 1612, 1, 'AVAILABLE', 302),

(613, 1613, 1, 'IN_STOCK', NULL),
(614, 1614, 1, 'IN_STOCK', NULL),
(615, 1615, 1, 'IN_STOCK', NULL),
(616, 1616, 1, 'IN_STOCK', NULL);

-- ==============================
--          PATIENTS
-- ==============================

-- 8 patients, 4 per clinic (2 per doctor)
-- IDs: 501–508
-- Users: 306–313

-- Clinic 1 Patients
-- Doctor 1 (401): patient1, patient2
INSERT INTO users(user_id, username, email, password)
VALUES (306, 'patient1', 'patient1@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (306, 3);
INSERT INTO patient(id, name, email, phone_number, age, height, weight, gender, created_at, doctor_id, sensor_kit_id, clinic_id, user_id, nic_number)
VALUES (501, 'Patient 1', 'patient1@example.com', '0781111100', 22, 165, 60, 'MALE', CURRENT_TIMESTAMP, 401, 601, 301, 306,'12345611');

INSERT INTO users(user_id, username, email, password)
VALUES (307, 'patient2', 'patient2@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (307, 3);
INSERT INTO patient(id, name, email, phone_number, age, height, weight, gender, created_at, doctor_id, sensor_kit_id, clinic_id, user_id, nic_number)
VALUES (502, 'Patient 2', 'patient2@example.com', '0781111200', 24, 170, 65, 'FEMALE', CURRENT_TIMESTAMP, 401, 602, 301, 307,'12345622');

-- Doctor 2 (402): patient3, patient4
INSERT INTO users(user_id, username, email, password)
VALUES (308, 'patient3', 'patient3@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (308, 3);
INSERT INTO patient(id, name, email, phone_number, age, height, weight, gender, created_at, doctor_id, sensor_kit_id, clinic_id, user_id, nic_number)
VALUES (503, 'Patient 3', 'patient3@example.com', '0781111300', 26, 172, 68, 'MALE', CURRENT_TIMESTAMP, 402, 603, 301, 308, '1234561');

INSERT INTO users(user_id, username, email, password)
VALUES (309, 'patient4', 'patient4@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (309, 3);
INSERT INTO patient(id, name, email, phone_number, age, height, weight, gender, created_at, doctor_id, sensor_kit_id, clinic_id, user_id, nic_number)
VALUES (504, 'Patient 4', 'patient4@example.com', '0781111400', 28, 178, 72, 'FEMALE', CURRENT_TIMESTAMP, 402, 604, 301, 309, '1234562');

-- Clinic 2 Patients
-- Doctor 3 (403): patient5, patient6
INSERT INTO users(user_id, username, email, password)
VALUES (310, 'patient5', 'patient5@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (310, 3);
INSERT INTO patient(id, name, email, phone_number, age, height, weight, gender, created_at, doctor_id, sensor_kit_id, clinic_id, user_id, nic_number)
VALUES (505, 'Patient 5', 'patient5@example.com', '0781111500', 30, 180, 75, 'MALE', CURRENT_TIMESTAMP, 403, 607, 302, 310, '1234563');

INSERT INTO users(user_id, username, email, password)
VALUES (311, 'patient6', 'patient6@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (311, 3);
INSERT INTO patient(id, name, email, phone_number, age, height, weight, gender, created_at, doctor_id, sensor_kit_id, clinic_id, user_id, nic_number)
VALUES (506, 'Patient 6', 'patient6@example.com', '0781111600', 32, 175, 70, 'FEMALE', CURRENT_TIMESTAMP, 403, 608, 302, 311, '1234564');

-- Doctor 4 (404): patient7, patient8
INSERT INTO users(user_id, username, email, password)
VALUES (312, 'patient7', 'patient7@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (312, 3);
INSERT INTO patient(id, name, email, phone_number, age, height, weight, gender, created_at, doctor_id, sensor_kit_id, clinic_id, user_id, nic_number)
VALUES (507, 'Patient 7', 'patient7@example.com', '0781111700', 34, 168, 62, 'MALE', CURRENT_TIMESTAMP, 404, 609, 302, 312, '1234565');

INSERT INTO users(user_id, username, email, password)
VALUES (313, 'patient8', 'patient8@example.com', '$2a$12$.VG3p3nMMhv84T7PUGmuMezvB4UJVNt0mcr.QI0bomMbA7wm/eP3i');
INSERT INTO user_role(user_id, role_id) VALUES (313, 3);
INSERT INTO patient(id, name, email, phone_number, age, height, weight, gender, created_at, doctor_id, sensor_kit_id, clinic_id, user_id, nic_number)
VALUES (508, 'Patient 8', 'patient8@example.com', '0781111800', 36, 166, 64, 'FEMALE', CURRENT_TIMESTAMP, 404, 610, 302, 313, '1234566');
