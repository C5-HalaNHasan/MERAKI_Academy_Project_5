-- DROP DATABASE MERAKI_PROJECT5;
-- CREATE DATABASE MERAKI_PROJECT5;
USE MERAKI_PROJECT5;

-- creating roles table:
-- CREATE TABLE role(
--     id INT AUTO_INCREMENT NOT NULL,
--     role VARCHAR(255),
--     PRIMARY KEY (id)
-- );

-- -- creating  permissions table:
-- CREATE TABLE permissions(
--     id INT AUTO_INCREMENT NOT NULL,
--     permission VARCHAR(255),
--     PRIMARY KEY (id)
-- );

-- -- creating role_permission table:
-- CREATE TABLE role_permission(
--     id INT AUTO_INCREMENT NOT NULL,
--     role_id INT,
--     FOREIGN KEY (role_id) REFERENCES role (id),
--     permission_id INT,
--     FOREIGN KEY (permission_id) REFERENCES permissions (id),
--     PRIMARY KEY (id)
-- );

-- -- creating users table:
-- -- gender:0 male,1 female
-- CREATE TABLE user(
--     id INT AUTO_INCREMENT NOT NULL,
--     firstName VARCHAR(255) NOT NULL,
--     lastName VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     birthday DATE NOT NULL,
--     country VARCHAR(255) NOT NULL,
--     gender TINYINT DEFAULT 0  NOT NULL,
--     profileImg  VARCHAR(255) DEFAULT 'http://res.cloudinary.com/difjgm3tp/image/upload/v1654090247/xercgf8pjvjgrnwbeucm.jpg',
--     coverImg  VARCHAR(255) DEFAULT 'http://res.cloudinary.com/difjgm3tp/image/upload/v1654090193/bt7ibiyyfs6m8z8kbi2h.jpg',
--     isPrivate TINYINT DEFAULT 0,
--     isReported TINYINT DEFAULT 0,
--     isDeleted TINYINT DEFAULT 0,
--     role_id INT,
--     FOREIGN KEY (role_id) REFERENCES role (id),
--     PRIMARY KEY (id)
-- );

-- -- creating friendship table:
-- CREATE TABLE friendship(
--     id INT AUTO_INCREMENT NOT NULL,
--     friendshipRequest INT,
--     FOREIGN KEY (friendshipRequest) REFERENCES user(id),
--     friendshipAccept INT,
--     FOREIGN KEY (friendshipAccept) REFERENCES user(id),
--     isDeleted TINYINT DEFAULT 0,
--     PRIMARY KEY (id)
-- );

-- -- creating friendship_Notification table//extra feature:
-- CREATE TABLE friendship_Notification (
--     id INT AUTO_INCREMENT NOT NULL,
--     friendshipRequestNotif INT,
--     FOREIGN KEY (friendshipRequestNotif) REFERENCES user(id),
--     friendshipAcceptNotif INT,
--     FOREIGN KEY (friendshipAcceptNotif) REFERENCES user(id),
--     isDeleted TINYINT DEFAULT 0,
--     PRIMARY KEY (id)
-- );

-- -- creating post table:
-- CREATE TABLE post(
--     id INT AUTO_INCREMENT NOT NULL,
--     postText  VARCHAR(255),
--     postImg  VARCHAR(255),
--     postVideo  VARCHAR(255),
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     author_id INT,
--     FOREIGN KEY (author_id) REFERENCES user(id),
--     isPrivate TINYINT DEFAULT 0,
--     isReported TINYINT DEFAULT 0,
--     isDeleted TINYINT DEFAULT 0,
--     PRIMARY KEY (id)
-- );

-- -- creating comment table:
-- CREATE TABLE comment(
--     id INT AUTO_INCREMENT NOT NULL,
--     comment  VARCHAR(255),
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     author_id INT,
--     FOREIGN KEY (author_id) REFERENCES user(id),
--     post_id INT,
--     FOREIGN KEY (post_id) REFERENCES post(id),
--     isReported TINYINT DEFAULT 0,
--     isDeleted TINYINT DEFAULT 0,
--     PRIMARY KEY (id)
-- );

-- -- creating post_reaction table:
-- CREATE TABLE post_reaction(
--     id INT AUTO_INCREMENT NOT NULL,
--     author_id INT,
--     FOREIGN KEY (author_id) REFERENCES user(id),
--     post_id INT,
--     FOREIGN KEY (post_id) REFERENCES post(id),
--     isDeleted TINYINT DEFAULT 0,
--     PRIMARY KEY (id)
-- );

-- -- creating comment_reaction table:
-- CREATE TABLE comment_reaction(
--     id INT AUTO_INCREMENT NOT NULL,
--     author_id INT,
--     FOREIGN KEY (author_id) REFERENCES user(id),
--     comment_id INT,
--     FOREIGN KEY (comment_id) REFERENCES comment(id),
--     isDeleted TINYINT DEFAULT 0,
--     PRIMARY KEY (id)
-- );

-- creating room table:
-- CREATE TABLE room(
--     id INT AUTO_INCREMENT NOT NULL,
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     sentBy INT,
--     FOREIGN KEY (sentBy) REFERENCES user(id),
--     receivedBy INT,
--     FOREIGN KEY (receivedBy) REFERENCES user(id),
--     isDeleted TINYINT DEFAULT 0,
--     PRIMARY KEY (id)
-- );

-- creating message table:
CREATE TABLE message(
    id INT AUTO_INCREMENT NOT NULL,
    message VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sentBy INT,
    FOREIGN KEY (sentBy) REFERENCES user(id),
    receivedBy INT,
    FOREIGN KEY (receivedBy) REFERENCES user(id),
    room INT,
    FOREIGN KEY (room) REFERENCES room(id),
    isDeleted TINYINT DEFAULT 0,
    PRIMARY KEY (id)
);

-- run the following command in the model directory:
-- mysql -u root <"schema.sql" -p

-- DROP TABLE message;