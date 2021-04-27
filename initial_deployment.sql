CREATE DATABASE calendar;

USE calendar;

CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE Event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    weekday VARCHAR(100),
    description VARCHAR(100),
    start_time DATETIME,
    end_time DATETIME,
    owned_by INT,
    FOREIGN KEY (owned_by) REFERENCES User(id)
);

CREATE TABLE AppointmentType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number_of_allowed_bookings INT,
    title VARCHAR(100),
    description VARCHAR(100)
);

CREATE TABLE FreeTimeSlot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    weekday VARCHAR(100),
    start_time DATETIME,
    end_time DATETIME,
    appointment_type INT,
    owned_by INT,
    FOREIGN KEY (owned_by) REFERENCES User(id),
    FOREIGN KEY (appointment_type) REFERENCES AppointmentType(id)
);

CREATE TABLE RegisteredForTime (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_email_sent DATETIME,
    time_slot_id INT,
    signup_id INT,
    FOREIGN KEY (time_slot_id) REFERENCES FreeTimeSlot(id),
    FOREIGN KEY (signup_id) REFERENCES User(id)
);
