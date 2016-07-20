-- This creates the users table. The username field is constrained to unique
-- values only, by using a UNIQUE KEY on that column
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(60) NOT NULL, -- why 60??? ask me :)
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- This creates the posts table. The userId column references the id column of
-- users. If a user is deleted, the corresponding posts' userIds will be set NULL.
CREATE TABLE `posts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(300) DEFAULT NULL,
  `url` VARCHAR(2000) DEFAULT NULL,
  `userId` INT(11) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- STEP 1 

CREATE TABLE `subreddits` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(30) NOT NULL UNIQUE KEY,
  `description` VARCHAR(200) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- STEP 2

-- Then we need to add a subredditId column to the posts table, with associated foreign key. 
-- Once you figure out the correct ALTER TABLE statement, make sure to add it to reddit.sql with a comment.

ALTER TABLE posts 
  ADD COLUMN subredditId INT, 
  ADD FOREIGN KEY (subredditId) REFERENCES `subreddits` (`id`) ON DELETE SET NULL;

