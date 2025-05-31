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
INSERT INTO sensorkit(id, serial_no, firmware_version, status, clinic_id, is_calibrated) VALUES
(601, 1601, 1, 'IN_USE', 301, TRUE),
(602, 1602, 1, 'IN_USE', 301, FALSE),
(603, 1603, 1, 'IN_USE', 301, FALSE),
(604, 1604, 1, 'IN_USE', 301, FALSE),
(605, 1605, 1, 'AVAILABLE', 301, FALSE),
(606, 1606, 1, 'AVAILABLE', 301, FALSE),

(607, 1607, 1, 'IN_USE', 302, FALSE),
(608, 1608, 1, 'IN_USE', 302, FALSE),
(609, 1609, 1, 'IN_USE', 302, FALSE),
(610, 1610, 1, 'IN_USE', 302, FALSE),
(611, 1611, 1, 'AVAILABLE', 302, FALSE),
(612, 1612, 1, 'AVAILABLE', 302, FALSE),

(613, 1613, 1, 'IN_STOCK', NULL, FALSE),
(614, 1614, 1, 'IN_STOCK', NULL, FALSE),
(615, 1615, 1, 'IN_STOCK', NULL, FALSE),
(616, 1616, 1, 'IN_STOCK', NULL, FALSE);

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


-- ==============================
--          FEEDBACK
-- ==============================

-- Feedback for Patient 1 sessions
INSERT INTO feedback(id, notes, created_at) VALUES
(3001, 'Good improvement in balance score compared to previous sessions. Patient shows consistent heel strike pattern. Recommend continuing current exercise routine with focus on cadence improvement.', '2024-01-15 10:30:00'),
(3002, 'Excellent progress in cadence and overall gait stability. Stride consistency has improved significantly. Patient is responding well to physiotherapy interventions.', '2024-01-22 11:45:00'),
(3003, 'Slight decrease in performance metrics, possibly due to fatigue. Patient reported mild discomfort during session. Recommend rest day before next session and review exercise intensity.', '2024-01-29 15:15:00'),
(3004, 'Back on track with good balance and force distribution. Patient has adapted well to recommended modifications. Continue current treatment plan.', '2024-02-05 17:00:00'),
(3005, 'Outstanding session with highest balance score to date. Patient demonstrates excellent gait mechanics and confidence. Ready to progress to more challenging exercises.', '2024-02-12 12:30:00');

-- Feedback for Patient 2 sessions (session 1010 failed, no feedback)
INSERT INTO feedback(id, notes, created_at) VALUES
(3006, 'Initial assessment shows good baseline metrics. Patient is motivated and follows instructions well. Focus on improving toe force distribution in upcoming sessions.', '2024-01-16 09:15:00'),
(3007, 'Significant improvement in step count and duration. Patient reports feeling more confident while walking. Continue with current exercise regimen.', '2024-01-23 14:00:00'),
(3008, 'Excellent session with peak performance in multiple metrics. Patient has achieved consistent stride pattern. Very pleased with progress.', '2024-01-30 16:30:00'),
(3009, 'Good maintenance of previous gains. Patient shows steady progress without any regression. Recommend gradual increase in exercise complexity.', '2024-02-06 10:00:00');

-- Feedback for Patient 3 sessions
INSERT INTO feedback(id, notes, created_at) VALUES
(3010, 'Exceptional initial performance with high balance scores. Patient has natural gait stability. Focus on maintaining consistency across sessions.', '2024-01-17 11:00:00'),
(3011, 'Consistent performance with good force distribution patterns. Patient demonstrates excellent body awareness during exercises.', '2024-01-24 15:30:00'),
(3012, 'Some decline in metrics, patient reported minor knee discomfort. Adjusted exercise protocol to reduce joint stress. Monitor closely.', '2024-01-31 12:00:00'),
(3013, 'Remarkable recovery and best session yet. Patient has overcome previous difficulties and shows excellent adaptation. Very encouraging progress.', '2024-02-07 18:00:00'),
(3014, 'Solid performance maintaining high standards. Patient ready for advanced gait training protocols. Excellent commitment to therapy.', '2024-02-14 09:15:00');

-- Feedback for Patient 4 sessions
INSERT INTO feedback(id, notes, created_at) VALUES
(3015, 'Good baseline assessment with room for improvement in balance. Patient is eager to progress and follows recommendations well.', '2024-01-18 10:30:00'),
(3016, 'Excellent improvement in all key metrics. Patient shows strong commitment to home exercise program. Continue current approach.', '2024-01-25 13:00:00'),
(3017, 'Peak performance session with outstanding results. Patient has achieved excellent gait mechanics and confidence levels.', '2024-02-01 16:15:00'),
(3018, 'Good session though slight decline from peak. Normal variation in performance. Patient maintains good overall progress trajectory.', '2024-02-08 11:00:00'),
(3019, 'Some regression noted, patient reported increased work stress affecting sleep. Discussed stress management and its impact on physical performance.', '2024-02-15 14:45:00');

-- Feedback for Patient 5 sessions (session 1025 failed, no feedback)
INSERT INTO feedback(id, notes, created_at) VALUES
(3020, 'Excellent initial session with very high performance metrics. Patient demonstrates superior gait mechanics and balance control.', '2024-01-19 12:00:00'),
(3021, 'Good maintenance of high performance standards. Patient is very disciplined with exercise routine. Continue current protocol.', '2024-01-26 10:15:00'),
(3022, 'Outstanding session with consistent high-quality metrics. Patient serves as excellent example of successful rehabilitation outcomes.', '2024-02-02 14:30:00'),
(3023, 'Peak performance achieved with record-breaking metrics. Patient has exceeded all initial treatment goals. Consider discharge planning.', '2024-02-09 17:15:00');

-- Feedback for Patient 6 sessions
INSERT INTO feedback(id, notes, created_at) VALUES
(3024, 'Initial session shows good potential with room for improvement. Patient is motivated and receptive to feedback. Positive outlook for treatment.', '2024-01-20 09:00:00'),
(3025, 'Steady improvement across all metrics. Patient reports increased confidence in daily activities. Therapy interventions are effective.', '2024-01-27 13:45:00'),
(3026, 'Continued positive progress with good balance and force patterns. Patient demonstrates excellent adherence to treatment recommendations.', '2024-02-03 16:00:00'),
(3027, 'Excellent session with peak performance in multiple areas. Patient has achieved significant functional improvements.', '2024-02-10 12:15:00'),
(3028, 'Good session maintaining progress levels. Patient ready for transition to maintenance phase of treatment. Very satisfied with outcomes.', '2024-02-17 15:00:00');

-- Feedback for Patient 7 sessions
INSERT INTO feedback(id, notes, created_at) VALUES
(3029, 'Solid baseline session with good fundamental gait patterns. Patient shows good potential for improvement with consistent therapy.', '2024-01-21 11:15:00'),
(3030, 'Significant improvement in all key areas. Patient is very engaged in therapy process and follows home program diligently.', '2024-01-28 14:45:00'),
(3031, 'Good progress maintenance with consistent performance. Patient demonstrates steady improvement without major fluctuations.', '2024-02-04 10:00:00'),
(3032, 'Excellent session with best results to date. Patient has achieved major treatment milestones and shows continued improvement.', '2024-02-11 14:15:00'),
(3033, 'Good session though slight performance variation. Patient maintains overall positive trajectory. Continue current treatment approach.', '2024-02-18 16:45:00');

-- Feedback for Patient 8 sessions
INSERT INTO feedback(id, notes, created_at) VALUES
(3034, 'Outstanding initial session with excellent baseline metrics. Patient demonstrates superior gait control and balance abilities.', '2024-01-22 12:15:00'),
(3035, 'Good session maintaining high performance standards. Patient is very committed to therapy goals and shows excellent compliance.', '2024-01-29 16:45:00'),
(3036, 'Excellent performance with consistent high-quality results. Patient continues to exceed treatment expectations and goals.', '2024-02-05 09:15:00'),
(3037, 'Solid session with good overall metrics. Patient maintains steady progress and positive attitude toward therapy interventions.', '2024-02-12 13:00:00'),
(3038, 'Final session shows good maintenance of gains. Patient ready for discharge with excellent functional outcomes achieved.', '2024-02-19 16:30:00');


-- ==============================
--        TEST SESSIONS
-- ==============================

-- Patient 1 (501) - 5 sessions
INSERT INTO test_session(id, start_time, end_time, status, patient_id, feedback_id) VALUES
(1001, '2024-01-15 09:00:00', '2024-01-15 09:15:30', 'COMPLETED', 501, 3001),
(1002, '2024-01-22 10:30:00', '2024-01-22 10:42:15', 'COMPLETED', 501, 3002),
(1003, '2024-01-29 14:15:00', '2024-01-29 14:28:45', 'COMPLETED', 501, 3003),
(1004, '2024-02-05 16:00:00', '2024-02-05 16:12:30', 'COMPLETED', 501, 3004),
(1005, '2024-02-12 11:45:00', '2024-02-12 11:58:20', 'COMPLETED', 501, 3005);

-- Patient 2 (502) - 5 sessions
INSERT INTO test_session(id, start_time, end_time, status, patient_id, feedback_id) VALUES
(1006, '2024-01-16 08:30:00', '2024-01-16 08:44:10', 'COMPLETED', 502, 3006),
(1007, '2024-01-23 13:20:00', '2024-01-23 13:35:25', 'COMPLETED', 502, 3007),
(1008, '2024-01-30 15:45:00', '2024-01-30 16:01:15', 'COMPLETED', 502, 3008),
(1009, '2024-02-06 09:15:00', '2024-02-06 09:28:40', 'COMPLETED', 502, 3009),
(1010, '2024-02-13 12:00:00', NULL, 'FAILED', 502, NULL);

-- Patient 3 (503) - 5 sessions
INSERT INTO test_session(id, start_time, end_time, status, patient_id, feedback_id) VALUES
(1011, '2024-01-17 10:00:00', '2024-01-17 10:16:30', 'COMPLETED', 503, 3010),
(1012, '2024-01-24 14:30:00', '2024-01-24 14:45:50', 'COMPLETED', 503, 3011),
(1013, '2024-01-31 11:15:00', '2024-01-31 11:29:20', 'COMPLETED', 503, 3012),
(1014, '2024-02-07 16:45:00', '2024-02-07 17:02:10', 'COMPLETED', 503, 3013),
(1015, '2024-02-14 08:30:00', '2024-02-14 08:44:55', 'COMPLETED', 503, 3014);

-- Patient 4 (504) - 5 sessions
INSERT INTO test_session(id, start_time, end_time, status, patient_id, feedback_id) VALUES
(1016, '2024-01-18 09:45:00', '2024-01-18 10:01:20', 'COMPLETED', 504, 3015),
(1017, '2024-01-25 12:15:00', '2024-01-25 12:31:45', 'COMPLETED', 504, 3016),
(1018, '2024-02-01 15:30:00', '2024-02-01 15:47:10', 'COMPLETED', 504, 3017),
(1019, '2024-02-08 10:20:00', '2024-02-08 10:35:35', 'COMPLETED', 504, 3018),
(1020, '2024-02-15 14:00:00', '2024-02-15 14:13:25', 'COMPLETED', 504, 3019);

-- Patient 5 (505) - 5 sessions
INSERT INTO test_session(id, start_time, end_time, status, patient_id, feedback_id) VALUES
(1021, '2024-01-19 11:00:00', '2024-01-19 11:17:40', 'COMPLETED', 505, 3020),
(1022, '2024-01-26 09:30:00', '2024-01-26 09:46:15', 'COMPLETED', 505, 3021),
(1023, '2024-02-02 13:45:00', '2024-02-02 14:01:30', 'COMPLETED', 505, 3022),
(1024, '2024-02-09 16:15:00', '2024-02-09 16:32:50', 'COMPLETED', 505, 3023),
(1025, '2024-02-16 10:45:00', NULL, 'FAILED', 505, NULL);

-- Patient 6 (506) - 5 sessions
INSERT INTO test_session(id, start_time, end_time, status, patient_id, feedback_id) VALUES
(1026, '2024-01-20 08:15:00', '2024-01-20 08:29:35', 'COMPLETED', 506, 3024),
(1027, '2024-01-27 12:45:00', '2024-01-27 13:02:20', 'COMPLETED', 506, 3025),
(1028, '2024-02-03 15:00:00', '2024-02-03 15:16:45', 'COMPLETED', 506, 3026),
(1029, '2024-02-10 11:30:00', '2024-02-10 11:47:15', 'COMPLETED', 506, 3027),
(1030, '2024-02-17 14:20:00', '2024-02-17 14:35:40', 'COMPLETED', 506, 3028);

-- Patient 7 (507) - 5 sessions
INSERT INTO test_session(id, start_time, end_time, status, patient_id, feedback_id) VALUES
(1031, '2024-01-21 10:30:00', '2024-01-21 10:45:25', 'COMPLETED', 507, 3029),
(1032, '2024-01-28 14:00:00', '2024-01-28 14:18:10', 'COMPLETED', 507, 3030),
(1033, '2024-02-04 09:15:00', '2024-02-04 09:31:55', 'COMPLETED', 507, 3031),
(1034, '2024-02-11 13:30:00', '2024-02-11 13:46:20', 'COMPLETED', 507, 3032),
(1035, '2024-02-18 16:00:00', '2024-02-18 16:14:45', 'COMPLETED', 507, 3033);

-- Patient 8 (508) - 5 sessions
INSERT INTO test_session(id, start_time, end_time, status, patient_id, feedback_id) VALUES
(1036, '2024-01-22 11:15:00', '2024-01-22 11:32:30', 'COMPLETED', 508, 3034),
(1037, '2024-01-29 15:45:00', '2024-01-29 16:01:15', 'COMPLETED', 508, 3035),
(1038, '2024-02-05 08:30:00', '2024-02-05 08:47:40', 'COMPLETED', 508, 3036),
(1039, '2024-02-12 12:15:00', '2024-02-12 12:31:25', 'COMPLETED', 508, 3037),
(1040, '2024-02-19 15:30:00', '2024-02-19 15:45:50', 'COMPLETED', 508, 3038);

-- ==============================
--    PROCESSED TEST RESULTS
-- ==============================

-- Results for Patient 1 (501) - Sessions 1001-1005
INSERT INTO processed_test_results(id, session_id, steps, cadence, avg_heel_force, avg_toe_force, avg_midfoot_force, balance_score, peak_impact, duration_seconds, avg_swing_time, avg_stance_time, pressure_results_path, stride_times) VALUES
(2001, 1001, 1245, 112.5, 8.2, 6.7, 4.3, 85.2, 245, 930.0, 0.42, 0.58, '/results/patient1/session1_pressure.json', '0.89,0.92,0.88,0.91,0.87,0.93,0.90,0.89,0.91,0.88'),
(2002, 1002, 1320, 115.8, 8.5, 7.1, 4.6, 87.4, 258, 735.0, 0.41, 0.57, '/results/patient1/session2_pressure.json', '0.88,0.90,0.89,0.92,0.87,0.91,0.89,0.90,0.88,0.91'),
(2003, 1003, 1189, 110.2, 8.0, 6.9, 4.2, 83.1, 242, 885.0, 0.43, 0.59, '/results/patient1/session3_pressure.json', '0.91,0.89,0.93,0.88,0.90,0.87,0.92,0.88,0.90,0.89'),
(2004, 1004, 1278, 114.3, 8.3, 7.0, 4.5, 86.7, 251, 750.0, 0.42, 0.58, '/results/patient1/session4_pressure.json', '0.87,0.91,0.88,0.90,0.89,0.92,0.87,0.90,0.88,0.91'),
(2005, 1005, 1356, 117.1, 8.7, 7.3, 4.8, 88.9, 263, 800.0, 0.40, 0.56, '/results/patient1/session5_pressure.json', '0.89,0.87,0.91,0.88,0.90,0.89,0.92,0.87,0.91,0.88');

-- Results for Patient 2 (502) - Sessions 1006-1009 (1010 is FAILED, no results)
INSERT INTO processed_test_results(id, session_id, steps, cadence, avg_heel_force, avg_toe_force, avg_midfoot_force, balance_score, peak_impact, duration_seconds, avg_swing_time, avg_stance_time, pressure_results_path, stride_times) VALUES
(2006, 1006, 1298, 113.7, 7.8, 6.5, 4.1, 82.3, 238, 850.0, 0.44, 0.60, '/results/patient2/session1_pressure.json', '0.92,0.88,0.91,0.89,0.87,0.93,0.88,0.90,0.89,0.91'),
(2007, 1007, 1367, 116.9, 8.1, 6.8, 4.4, 84.6, 249, 925.0, 0.43, 0.59, '/results/patient2/session2_pressure.json', '0.88,0.91,0.87,0.92,0.89,0.88,0.90,0.91,0.87,0.90'),
(2008, 1008, 1423, 118.5, 8.4, 7.2, 4.7, 86.8, 256, 975.0, 0.42, 0.58, '/results/patient2/session3_pressure.json', '0.90,0.89,0.92,0.87,0.91,0.88,0.89,0.92,0.88,0.90'),
(2009, 1009, 1301, 114.2, 8.0, 6.9, 4.3, 85.1, 244, 820.0, 0.43, 0.59, '/results/patient2/session4_pressure.json', '0.89,0.91,0.88,0.90,0.87,0.92,0.89,0.88,0.91,0.87');

-- Results for Patient 3 (503) - Sessions 1011-1015
INSERT INTO processed_test_results(id, session_id, steps, cadence, avg_heel_force, avg_toe_force, avg_midfoot_force, balance_score, peak_impact, duration_seconds, avg_swing_time, avg_stance_time, pressure_results_path, stride_times) VALUES
(2010, 1011, 1456, 119.8, 9.1, 7.6, 5.2, 89.3, 271, 990.0, 0.39, 0.55, '/results/patient3/session1_pressure.json', '0.86,0.90,0.88,0.92,0.87,0.91,0.89,0.88,0.93,0.87'),
(2011, 1012, 1389, 117.4, 8.9, 7.4, 5.0, 87.9, 265, 950.0, 0.40, 0.56, '/results/patient3/session2_pressure.json', '0.88,0.91,0.87,0.90,0.89,0.88,0.92,0.87,0.90,0.89'),
(2012, 1013, 1234, 112.1, 8.6, 7.1, 4.8, 86.2, 259, 860.0, 0.41, 0.57, '/results/patient3/session3_pressure.json', '0.91,0.88,0.90,0.87,0.92,0.89,0.88,0.91,0.87,0.90'),
(2013, 1014, 1512, 121.3, 9.3, 7.8, 5.4, 90.7, 278, 1030.0, 0.38, 0.54, '/results/patient3/session4_pressure.json', '0.87,0.91,0.88,0.93,0.86,0.90,0.88,0.92,0.87,0.91'),
(2014, 1015, 1345, 116.2, 8.8, 7.3, 4.9, 88.1, 262, 895.0, 0.40, 0.56, '/results/patient3/session5_pressure.json', '0.89,0.87,0.91,0.88,0.90,0.87,0.93,0.88,0.91,0.89');

-- Results for Patient 4 (504) - Sessions 1016-1020
INSERT INTO processed_test_results(id, session_id, steps, cadence, avg_heel_force, avg_toe_force, avg_midfoot_force, balance_score, peak_impact, duration_seconds, avg_swing_time, avg_stance_time, pressure_results_path, stride_times) VALUES
(2015, 1016, 1367, 115.6, 8.7, 7.2, 4.6, 84.9, 253, 980.0, 0.42, 0.58, '/results/patient4/session1_pressure.json', '0.90,0.88,0.92,0.87,0.91,0.89,0.88,0.90,0.87,0.92'),
(2016, 1017, 1445, 118.9, 9.0, 7.5, 4.9, 87.3, 267, 1005.0, 0.41, 0.57, '/results/patient4/session2_pressure.json', '0.88,0.91,0.87,0.90,0.89,0.92,0.87,0.90,0.88,0.91'),
(2017, 1018, 1523, 120.7, 9.2, 7.7, 5.1, 88.6, 272, 1040.0, 0.40, 0.56, '/results/patient4/session3_pressure.json', '0.87,0.90,0.88,0.92,0.87,0.91,0.89,0.88,0.91,0.87'),
(2018, 1019, 1298, 114.8, 8.5, 7.0, 4.7, 86.1, 248, 915.0, 0.43, 0.59, '/results/patient4/session4_pressure.json', '0.91,0.88,0.90,0.87,0.92,0.88,0.90,0.89,0.87,0.91'),
(2019, 1020, 1187, 111.9, 8.2, 6.8, 4.4, 83.7, 241, 805.0, 0.44, 0.60, '/results/patient4/session5_pressure.json', '0.89,0.92,0.87,0.90,0.88,0.91,0.87,0.92,0.88,0.90');

-- Results for Patient 5 (505) - Sessions 1021-1024 (1025 is FAILED, no results)
INSERT INTO processed_test_results(id, session_id, steps, cadence, avg_heel_force, avg_toe_force, avg_midfoot_force, balance_score, peak_impact, duration_seconds, avg_swing_time, avg_stance_time, pressure_results_path, stride_times) VALUES
(2020, 1021, 1478, 119.2, 9.4, 7.9, 5.3, 91.2, 281, 1060.0, 0.38, 0.54, '/results/patient5/session1_pressure.json', '0.86,0.91,0.88,0.93,0.87,0.90,0.88,0.92,0.87,0.91'),
(2021, 1022, 1356, 116.8, 9.1, 7.6, 5.0, 89.7, 274, 955.0, 0.39, 0.55, '/results/patient5/session2_pressure.json', '0.88,0.90,0.87,0.91,0.89,0.88,0.92,0.87,0.90,0.89'),
(2022, 1023, 1423, 118.4, 9.3, 7.8, 5.2, 90.5, 277, 990.0, 0.38, 0.54, '/results/patient5/session3_pressure.json', '0.87,0.92,0.88,0.90,0.87,0.91,0.89,0.88,0.91,0.87'),
(2023, 1024, 1567, 122.1, 9.6, 8.1, 5.5, 92.8, 287, 1110.0, 0.37, 0.53, '/results/patient5/session4_pressure.json', '0.85,0.90,0.87,0.92,0.86,0.91,0.88,0.93,0.86,0.90');

-- Results for Patient 6 (506) - Sessions 1026-1030
INSERT INTO processed_test_results(id, session_id, steps, cadence, avg_heel_force, avg_toe_force, avg_midfoot_force, balance_score, peak_impact, duration_seconds, avg_swing_time, avg_stance_time, pressure_results_path, stride_times) VALUES
(2024, 1026, 1267, 113.9, 7.9, 6.6, 4.2, 81.7, 236, 875.0, 0.44, 0.60, '/results/patient6/session1_pressure.json', '0.92,0.88,0.91,0.87,0.90,0.89,0.88,0.91,0.87,0.92'),
(2025, 1027, 1389, 117.2, 8.2, 6.9, 4.5, 84.3, 247, 1000.0, 0.43, 0.59, '/results/patient6/session2_pressure.json', '0.88,0.91,0.87,0.90,0.89,0.92,0.87,0.90,0.88,0.91'),
(2026, 1028, 1456, 119.6, 8.5, 7.2, 4.8, 86.9, 254, 1005.0, 0.42, 0.58, '/results/patient6/session3_pressure.json', '0.87,0.90,0.88,0.92,0.87,0.91,0.89,0.88,0.91,0.87'),
(2027, 1029, 1523, 121.4, 8.8, 7.5, 5.1, 88.4, 261, 1035.0, 0.41, 0.57, '/results/patient6/session4_pressure.json', '0.89,0.87,0.92,0.88,0.90,0.87,0.91,0.89,0.88,0.92'),
(2028, 1030, 1334, 115.7, 8.3, 7.0, 4.6, 85.6, 249, 920.0, 0.43, 0.59, '/results/patient6/session5_pressure.json', '0.90,0.88,0.91,0.87,0.92,0.88,0.90,0.89,0.87,0.91');

-- Results for Patient 7 (507) - Sessions 1031-1035
INSERT INTO processed_test_results(id, session_id, steps, cadence, avg_heel_force, avg_toe_force, avg_midfoot_force, balance_score, peak_impact, duration_seconds, avg_swing_time, avg_stance_time, pressure_results_path, stride_times) VALUES
(2029, 1031, 1298, 114.5, 8.1, 6.8, 4.3, 82.9, 243, 895.0, 0.44, 0.60, '/results/patient7/session1_pressure.json', '0.91,0.88,0.90,0.87,0.92,0.89,0.88,0.91,0.87,0.90'),
(2030, 1032, 1423, 118.7, 8.6, 7.3, 4.7, 87.1, 258, 1090.0, 0.42, 0.58, '/results/patient7/session2_pressure.json', '0.88,0.91,0.87,0.90,0.89,0.92,0.87,0.90,0.88,0.91'),
(2031, 1033, 1367, 116.3, 8.4, 7.1, 4.5, 85.8, 252, 1015.0, 0.43, 0.59, '/results/patient7/session3_pressure.json', '0.87,0.90,0.88,0.92,0.87,0.91,0.89,0.88,0.91,0.87'),
(2032, 1034, 1445, 119.1, 8.7, 7.4, 4.8, 88.2, 264, 980.0, 0.41, 0.57, '/results/patient7/session4_pressure.json', '0.89,0.87,0.92,0.88,0.90,0.87,0.91,0.89,0.88,0.92'),
(2033, 1035, 1289, 113.8, 8.2, 6.9, 4.4, 84.6, 246, 885.0, 0.43, 0.59, '/results/patient7/session5_pressure.json', '0.90,0.88,0.91,0.87,0.92,0.88,0.90,0.89,0.87,0.91');

-- Results for Patient 8 (508) - Sessions 1036-1040
INSERT INTO processed_test_results(id, session_id, steps, cadence, avg_heel_force, avg_toe_force, avg_midfoot_force, balance_score, peak_impact, duration_seconds, avg_swing_time, avg_stance_time, pressure_results_path, stride_times) VALUES
(2034, 1036, 1512, 120.8, 8.9, 7.6, 5.0, 89.4, 269, 1050.0, 0.40, 0.56, '/results/patient8/session1_pressure.json', '0.87,0.91,0.88,0.93,0.86,0.90,0.88,0.92,0.87,0.91'),
(2035, 1037, 1389, 117.5, 8.6, 7.3, 4.7, 86.7, 255, 975.0, 0.42, 0.58, '/results/patient8/session2_pressure.json', '0.88,0.90,0.87,0.91,0.89,0.88,0.92,0.87,0.90,0.89'),
(2036, 1038, 1456, 119.3, 8.8, 7.5, 4.9, 88.1, 262, 1040.0, 0.41, 0.57, '/results/patient8/session3_pressure.json', '0.87,0.92,0.88,0.90,0.87,0.91,0.89,0.88,0.91,0.87'),
(2037, 1039, 1334, 115.9, 8.4, 7.1, 4.6, 85.3, 248, 945.0, 0.43, 0.59, '/results/patient8/session4_pressure.json', '0.89,0.88,0.92,0.87,0.90,0.89,0.88,0.91,0.87,0.90'),
(2038, 1040, 1267, 113.2, 8.1, 6.8, 4.3, 83.8, 241, 890.0, 0.44, 0.60, '/results/patient8/session5_pressure.json', '0.91,0.87,0.90,0.88,0.92,0.87,0.91,0.88,0.90,0.89');

