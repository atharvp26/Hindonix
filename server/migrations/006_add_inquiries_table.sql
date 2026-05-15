-- Stores contact/inquiry form submissions
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  company VARCHAR(255),
  country VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  product VARCHAR(255),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  submission_id VARCHAR(100),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
