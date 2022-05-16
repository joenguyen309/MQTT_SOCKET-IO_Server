-- this database will add to http://localhost:8080/phpmyadmin

DROP DATABASE IF EXISTS mydatabase;

CREATE DATABASE mydatabase DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

use mydatabase;

CREATE TABLE IF NOT EXISTS Infor (
    ID INTEGER PRIMARY KEY AUTO_INCREMENT,
    time TIMESTAMP  CURRENT_TIMESTAMP,
    temperature varchar(255) NOT NULL,
    humidity varchar(255) NOT NULL
);
