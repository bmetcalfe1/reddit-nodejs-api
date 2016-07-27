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

-- Step 3:

-- In the reddit.js API, add a createSubreddit(sub, callback) function. 
--It should take a subreddit object which contains a name and optional description property. 
--It should insert the new subreddit, and either return an error or the newly created subreddit. 
-- You can take some inspiration from the createPost function which operates in a similar way :)


-- Add comments functionality
-- Step 1:

-- The first step will be to create a comments table. 
--  Each comment should have a unique, auto incrementing id and a text anywhere from 1 to 10000 characters. 
-- It should also have createdAt and updatedAt timestamps that you can copy from an existing table. 
--  Each comment should also have a userId linking it to the user who created the comment (using a foreign key), 
-- a postId linking it to the post which is being commented on, and a parentId linking it to the comment it is replying to. 
-- A top-level comment should have parentId set to NULL.

-- Once you figure out the correct CREATE TABLE statement, add it to reddit.sql with a comment.

CREATE TABLE `comments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `text` VARCHAR(10000) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` TIMESTAMP NOT NULL,
  `userId` INT(11) NOT NULL,
  `postId` INT(11) NOT NULL,
  `parentId` INT(11) DEFAULT NULL,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  FOREIGN KEY (`parentId`) REFERENCES `comments` (`id`)
);

CREATE TABLE votes (
  userId INT(11) NOT NULL,
  postId INT(11) NOT NULL,
  PRIMARY KEY (userId, postId),
  vote TINYINT DEFAULT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id),
  FOREIGN KEY (postId) REFERENCES posts (id)
);

CREATE TABLE `sessions` (
  `session_id` INT(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`session_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

