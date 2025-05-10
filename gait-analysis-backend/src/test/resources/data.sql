-- Insert ROLE_ADMIN
INSERT INTO role(role_id, role_name) VALUES (1, 'ROLE_ADMIN');
INSERT INTO role(role_id, role_name) VALUES (2, 'ROLE_CLINIC');
INSERT INTO role(role_id, role_name) VALUES (3, 'ROLE_PATIENT');

-- Insert test user with ROLE_ADMIN (username: admin, password: password)
INSERT INTO users(user_id, username, email, password)
VALUES (200, 'admin', 'admin@example.com', '$2a$12$Rb8IqbWrjVhZP69xN2k/QOBMOpvmeR.ju6LRqW4CIFezQk181aYLG'); -- "password" BCrypt

-- Assign role to user
INSERT INTO user_role(user_id, role_id) VALUES (200, 1);