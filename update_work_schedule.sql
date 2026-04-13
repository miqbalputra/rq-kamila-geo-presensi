-- Migration to add individual work schedules for teachers
ALTER TABLE `users` 
ADD COLUMN `active_days` VARCHAR(50) DEFAULT '1,2,3,4,5' COMMENT '1=Mon, 2=Tue, ..., 7=Sun',
ADD COLUMN `work_start_time` TIME DEFAULT '07:30:00',
ADD COLUMN `work_end_time` TIME DEFAULT '15:00:00';

-- Update existing teachers to have standard weekday schedule if not set
UPDATE `users` SET `active_days` = '1,2,3,4,5' WHERE `role` = 'guru' AND `active_days` IS NULL;
UPDATE `users` SET `work_start_time` = '07:30:00', `work_end_time` = '15:00:00' WHERE `role` = 'guru' AND `work_start_time` IS NULL;
