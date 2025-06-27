
-- VulnApp Database Schema
-- Base de données volontairement vulnérable pour l'entraînement au pentest
-- ATTENTION : Ne jamais utiliser en production !

CREATE DATABASE IF NOT EXISTS vulnapp;
USE vulnapp;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Vulnérabilité : Mots de passe en clair ou faiblement hashés
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    session_id VARCHAR(100) DEFAULT NULL -- Vulnérabilité : Session ID prévisible
);

-- Table des fichiers uploadés
CREATE TABLE IF NOT EXISTS uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL, -- Vulnérabilité : Validation côté client uniquement
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) DEFAULT NULL -- Vulnérabilité : Stockage d'IP sans consentement
);

-- Table des logs (vulnérable aux injections)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL, -- Vulnérabilité : Stockage d'informations sensibles
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des commentaires (vulnérable XSS)
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL, -- Vulnérabilité : Pas de sanitisation XSS
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des sessions (vulnérable)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(100) NOT NULL, -- Vulnérabilité : Token faible
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion de données de test (avec vulnérabilités intentionnelles)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@vulnapp.local', 'admin123', 'admin'), -- Vulnérabilité : Mot de passe faible en clair
('user', 'user@vulnapp.local', 'password', 'user'),   -- Vulnérabilité : Mot de passe faible en clair
('test', 'test@vulnapp.local', 'test123', 'user'),
('guest', 'guest@vulnapp.local', 'guest', 'user');

-- Insertion de quelques messages de test
INSERT INTO contact_messages (name, email, subject, message) VALUES 
('John Doe', 'john@example.com', 'Question sur le service', 'Bonjour, j\'ai une question concernant votre service.'),
('Jane Smith', 'jane@example.com', 'Problème technique', 'Je rencontre un problème avec l\'application.');

-- Insertion de logs de test
INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES 
(1, 'LOGIN', 'Connexion administrateur', '192.168.1.100'),
(2, 'PROFILE_UPDATE', 'Mise à jour du profil utilisateur', '192.168.1.101'),
(1, 'FILE_UPLOAD', 'Upload d\'un fichier avatar.jpg', '192.168.1.100');

-- Création d'un utilisateur MariaDB vulnérable (UNIQUEMENT POUR LES TESTS)
-- ATTENTION : Ces permissions sont volontairement trop larges !
CREATE USER IF NOT EXISTS 'vulnapp_user'@'localhost' IDENTIFIED BY 'vulnapp_pass123';
GRANT ALL PRIVILEGES ON vulnapp.* TO 'vulnapp_user'@'localhost';
GRANT FILE ON *.* TO 'vulnapp_user'@'localhost'; -- Vulnérabilité : Permission FILE dangereuse
FLUSH PRIVILEGES;

-- Vues vulnérables pour les tests d'injection
CREATE VIEW user_info AS 
SELECT id, username, email, role, created_at 
FROM users; -- Vulnérabilité : Vue sans restriction d'accès

-- Procédure stockée vulnérable
DELIMITER //
CREATE PROCEDURE GetUserByName(IN user_name VARCHAR(50))
BEGIN
    -- Vulnérabilité : Injection SQL dans une procédure stockée
    SET @sql = CONCAT('SELECT * FROM users WHERE username = "', user_name, '"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- Trigger vulnérable (pour tests avancés)
DELIMITER //
CREATE TRIGGER log_user_changes 
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    -- Vulnérabilité : Log sans validation
    INSERT INTO activity_logs (user_id, action, details) 
    VALUES (NEW.id, 'USER_UPDATED', CONCAT('User updated: ', NEW.username));
END //
DELIMITER ;

-- Configuration vulnérable pour les tests
-- Ces paramètres sont volontairement non sécurisés !
SET GLOBAL log_bin_trust_function_creators = 1; -- Vulnérabilité : Permet l'exécution de fonctions non sécurisées
