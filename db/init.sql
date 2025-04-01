CREATE DATABASE IF NOT EXISTS mystate_db;

USE mystate_db;

CREATE TABLE IF NOT EXISTS districts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  population INT,
  area FLOAT,
  headquarters VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  district_id INT NOT NULL,
  population INT,
  headquarters VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_block_per_district (name, district_id)
);

-- Insert sample data for Chhattisgarh districts
INSERT INTO districts (name, population, area, headquarters) VALUES
('Balrampur', 730491, 3806.0, 'Balrampur'),
('Bastar', 1411644, 10755.0, 'Jagdalpur'),
('Bijapur', 255230, 6562.0, 'Bijapur'),
('Bilaspur', 2663629, 8270.0, 'Bilaspur'),
('Dantewada', 283479, 3410.5, 'Dantewada'),
('Dhamtari', 799781, 2029.0, 'Dhamtari'),
('Durg', 3343079, 8549.0, 'Durg'),
('Gariaband', 597653, 3902.0, 'Gariaband'),
('Janjgir-Champa', 1619707, 3852.0, 'Janjgir'),
('Jashpur', 851669, 6457.0, 'Jashpur'),
('Kabirdham', 822526, 4447.5, 'Kawardha'),
('Kanker', 748593, 5285.0, 'Kanker'),
('Kondagaon', 578826, 4445.7, 'Kondagaon'),
('Korba', 1206640, 7145.0, 'Korba'),
('Koriya', 658917, 5978.0, 'Baikunthpur'),
('Mahasamund', 1032754, 4789.0, 'Mahasamund'),
('Mungeli', 701707, 2760.0, 'Mungeli'),
('Narayanpur', 139820, 4653.9, 'Narayanpur'),
('Raigarh', 1493984, 7086.0, 'Raigarh'),
('Raipur', 4063872, 12383.0, 'Raipur'),
('Rajnandgaon', 1537133, 8070.0, 'Rajnandgaon'),
('Sukma', 249000, 5665.0, 'Sukma'),
('Surajpur', 660280, 2357.0, 'Surajpur'),
('Surguja', 2359886, 15731.0, 'Ambikapur'),
('Baloda Bazar', 1305343, 4455.0, 'Baloda Bazar'),
('Balod', 826165, 3527.0, 'Balod'),
('Bemetara', 795759, 2855.0, 'Bemetara'),
('Gaurela-Pendra-Marwahi', 243842, 1486.0, 'Gaurela');

-- Insert sample data for blocks (for first few districts)
INSERT INTO blocks (name, district_id, population, headquarters) VALUES
-- Balrampur blocks
('Balrampur', 1, 120000, 'Balrampur'),
('Ramanujganj', 1, 110000, 'Ramanujganj'),
('Kusmi', 1, 95000, 'Kusmi'),
('Shankargarh', 1, 105000, 'Shankargarh'),
('Wadrafnagar', 1, 100000, 'Wadrafnagar'),

-- Bastar blocks
('Bastanar', 2, 113000, 'Bastanar'),
('Bakawand', 2, 102000, 'Bakawand'),
('Bastar', 2, 129000, 'Jagdalpur'),
('Darbha', 2, 95000, 'Darbha'),
('Lohandiguda', 2, 110000, 'Lohandiguda'),
('Tokapal', 2, 108000, 'Tokapal'),
('Jagdalpur', 2, 145000, 'Jagdalpur'),

-- Bijapur blocks
('Bijapur', 3, 85000, 'Bijapur'),
('Bhairamgarh', 3, 62000, 'Bhairamgarh'),
('Usoor', 3, 57000, 'Usoor'),
('Bhopalpatnam', 3, 51000, 'Bhopalpatnam');
