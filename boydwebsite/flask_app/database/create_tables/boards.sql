CREATE TABLE IF NOT EXISTS `boards` (
`board_id`             int(11)      NOT NULL AUTO_INCREMENT	COMMENT 'The board id',
`user_id`              int(11)      NOT NULL             	COMMENT 'The user id',
`name`                 varchar(255) NOT NULL             	COMMENT 'The name of the skill',
PRIMARY KEY (`skill_id`),
FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Skills I have";