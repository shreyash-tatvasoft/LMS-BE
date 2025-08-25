CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  dob DATE,
  role ENUM('ADMIN','STUDENT') DEFAULT 'STUDENT'
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  quantity INT DEFAULT 0,
  author VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS assignedbooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT,
  bookId INT,
  issueDate DATE,
  returnDate DATE,
  returnedAt DATE,
  status ENUM('ISSUED', 'RETURNED') DEFAULT 'ISSUED',
  FOREIGN KEY (studentId) REFERENCES users(id),
  FOREIGN KEY (bookId) REFERENCES books(id)
);
