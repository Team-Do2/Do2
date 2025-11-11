-- Set the target database
USE do2;

-- Disable checks temporarily to allow for explicit setting of AUTO_INCREMENT values for demonstration
SET FOREIGN_KEY_CHECKS=0;
SET UNIQUE_CHECKS=0;

-- ---
-- 1. USER INSERTS
-- ---
-- NOTE: password_hash (BINARY(128)) and password_salt (BINARY(32)) are stored as placeholder hex strings.

INSERT INTO user (email, password_hash, password_salt, first_name, last_name) VALUES
('john.doe@example.com',
  UNHEX(RPAD('', 256, 'a')), -- Placeholder 128-byte hash (256 hex chars)
  UNHEX(RPAD('', 64, 'a')),  -- Placeholder 32-byte salt (64 hex chars)
  'John', 'Doe'),
('jane.smith@example.com',
  UNHEX(RPAD('', 256, 'b')), -- Another placeholder 128-byte hash
  UNHEX(RPAD('', 64, 'b')),  -- Another placeholder 32-byte salt
  'Jane', 'Smith');

-- ---
-- 2. SETTINGS INSERTS
-- ---

INSERT INTO settings (user_email, theme, time_to_delete) VALUES
('john.doe@example.com', 'dark', 7),   -- John prefers dark theme, tasks deleted after 7 days
('jane.smith@example.com', 'light', 30); -- Jane prefers light theme, tasks deleted after 30 days

-- ---
-- 3. TAG INSERTS
-- ---

INSERT INTO tag (id, color, name) VALUES
(1, '#FF5733', 'Urgent'),
(2, '#33FF57', 'Work'),
(3, '#3357FF', 'Personal'),
(4, '#FFD700', 'Finance');

-- ---
-- 4. TASK INSERTS
-- ---

-- Start tasks at id=1 for clarity in relationships
-- Task 1: John's main project (Supertask)
INSERT INTO task (id, is_pinned, is_done, name, datetime_to_delete, description, supertask_id, user_email) VALUES
(1, 1, 0, 'Project Alpha Planning', NULL, 'Outline the key milestones and deliverables for Alpha.', NULL, 'john.doe@example.com');

-- Task 2: John's subtask (Completed, set for deletion)
INSERT INTO task (id, is_pinned, is_done, name, datetime_to_delete, description, supertask_id, user_email) VALUES
(2, 0, 1, 'Draft Intro Section', '2025-11-18 10:00:00.0', 'Write the project introduction and abstract.', 1, 'john.doe@example.com');

-- Task 3: John's normal task (Personal, has a deadline)
INSERT INTO task (id, is_pinned, is_done, name, datetime_to_delete, description, supertask_id, user_email) VALUES
(3, 0, 0, 'Grocery Shopping', NULL, 'Pick up milk, eggs, and bread for the week.', NULL, 'john.doe@example.com');

-- Task 4: Jane's urgent deadline task (Work, Pinned)
INSERT INTO task (id, is_pinned, is_done, name, datetime_to_delete, description, supertask_id, user_email) VALUES
(4, 1, 0, 'Q4 Report Final Review', NULL, 'Check all numbers and send the final version to the manager.', NULL, 'jane.smith@example.com');

-- Task 5: Jane's planning task
INSERT INTO task (id, is_pinned, is_done, name, datetime_to_delete, description, supertask_id, user_email) VALUES
(5, 0, 0, 'Book Holiday Flights', NULL, 'Research and book travel dates for next month.', NULL, 'jane.smith@example.com');


-- ---
-- 5. DEADLINE_TASK INSERTS
-- ---

INSERT INTO deadline_task (task_id, due_datetime) VALUES
(4, '2025-11-15 17:30:00.0'), -- Q4 Report is due Friday afternoon
(3, '2025-11-12 12:00:00.0');  -- Groceries needed by Tuesday lunch

-- ---
-- 6. TAGGED_BY INSERTS (Linking Tasks and Tags)
-- ---

INSERT INTO tagged_by (task_id, tag_id) VALUES
(1, 2), -- Project Alpha (Work)
(2, 2), -- Draft Intro (Work)
(3, 3), -- Grocery Shopping (Personal)
(4, 1), -- Q4 Report (Urgent)
(4, 2), -- Q4 Report (Work)
(5, 3), -- Book Flights (Personal)
(5, 4); -- Book Flights (Finance)

-- Restore checks
SET FOREIGN_KEY_CHECKS=1;
SET UNIQUE_CHECKS=1;