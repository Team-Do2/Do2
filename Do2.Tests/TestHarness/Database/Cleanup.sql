-- Disable foreign key checks temporarily to allow dropping tables in any order
SET FOREIGN_KEY_CHECKS = 0;

-- Drop dependent tables first
DROP TABLE IF EXISTS `do2`.`deadline_task`;
DROP TABLE IF EXISTS `do2`.`tagged_by`;
DROP TABLE IF EXISTS `do2`.`settings`;

-- Drop tables that are referenced by others
DROP TABLE IF EXISTS `do2`.`task`;
DROP TABLE IF EXISTS `do2`.`tag`;
DROP TABLE IF EXISTS `do2`.`user`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;