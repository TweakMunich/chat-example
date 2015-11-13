CREATE DATABASE IF NOT EXISTS chat_example;
USE chat_example;

CREATE TABLE IF NOT EXISTS messages (
     id INT NOT NULL AUTO_INCREMENT,
     message VARCHAR(255) NOT NULL,
     date_time TIMESTAMP DEFAULT NOW(),
	 user_name VARCHAR(255),
	 PRIMARY KEY (id)
);


INSERT INTO messages (message) VALUES ('Hello World!');
INSERT INTO messages (message) VALUES ('Have a great chat!');

SELECT * FROM messages;
