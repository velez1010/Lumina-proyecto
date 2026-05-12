-- Lumina database schema for MySQL 8+
-- This file creates the full relational structure for users, profiles,
-- experiences, comments, votes, contact messages, and admin employees.

DROP DATABASE IF EXISTS lumina_db;
CREATE DATABASE lumina_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lumina_db;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE roles (
  role_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(40) NOT NULL,
  description VARCHAR(160) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id),
  UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
  user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  firebase_uid VARCHAR(128) NULL,
  role_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
  email VARCHAR(191) NOT NULL,
  username VARCHAR(80) NOT NULL,
  username_lower VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NULL,
  auth_provider ENUM('firebase', 'local') NOT NULL DEFAULT 'firebase',
  status ENUM('active', 'inactive', 'blocked', 'deleted') NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uk_users_firebase_uid (firebase_uid),
  UNIQUE KEY uk_users_email (email),
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_username_lower (username_lower),
  KEY idx_users_role_id (role_id),
  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_profiles (
  user_id BIGINT UNSIGNED NOT NULL,
  first_name VARCHAR(80) NULL,
  last_name VARCHAR(80) NULL,
  phone VARCHAR(35) NULL,
  bio TEXT NULL,
  photo_url MEDIUMTEXT NULL,
  photo_mime_type VARCHAR(80) NULL,
  photo_size_bytes INT UNSIGNED NULL,
  profile_completed_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_user_profiles_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE departments (
  department_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (department_id),
  UNIQUE KEY uk_departments_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE worker_roles (
  worker_role_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  description VARCHAR(160) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (worker_role_id),
  UNIQUE KEY uk_worker_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employees (
  employee_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(140) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(35) NULL,
  job_title VARCHAR(100) NULL,
  department_id SMALLINT UNSIGNED NULL,
  worker_role_id SMALLINT UNSIGNED NULL,
  monthly_salary DECIMAL(12,2) NULL,
  hire_date DATE NULL,
  employment_status ENUM('activo', 'inactivo', 'baja') NOT NULL DEFAULT 'activo',
  address VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (employee_id),
  UNIQUE KEY uk_employees_email (email),
  KEY idx_employees_department_id (department_id),
  KEY idx_employees_worker_role_id (worker_role_id),
  KEY idx_employees_status (employment_status),
  CONSTRAINT fk_employees_department
    FOREIGN KEY (department_id) REFERENCES departments (department_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_employees_worker_role
    FOREIGN KEY (worker_role_id) REFERENCES worker_roles (worker_role_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE experiences (
  experience_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  title VARCHAR(160) NOT NULL,
  body TEXT NOT NULL,
  author_name VARCHAR(120) NOT NULL DEFAULT 'Anonimo',
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (experience_id),
  KEY idx_experiences_user_id (user_id),
  KEY idx_experiences_status_created (status, created_at),
  FULLTEXT KEY ft_experiences_title_body (title, body),
  CONSTRAINT fk_experiences_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE experience_votes (
  vote_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  experience_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  voter_key VARCHAR(191) NOT NULL,
  vote_type ENUM('like', 'dislike') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (vote_id),
  UNIQUE KEY uk_experience_votes_once (experience_id, voter_key),
  KEY idx_experience_votes_user_id (user_id),
  KEY idx_experience_votes_type (vote_type),
  CONSTRAINT fk_experience_votes_experience
    FOREIGN KEY (experience_id) REFERENCES experiences (experience_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_experience_votes_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE experience_comments (
  comment_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  experience_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  author_name VARCHAR(120) NOT NULL DEFAULT 'Anonimo',
  body TEXT NOT NULL,
  status ENUM('visible', 'hidden', 'deleted') NOT NULL DEFAULT 'visible',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id),
  KEY idx_experience_comments_experience_id (experience_id),
  KEY idx_experience_comments_user_id (user_id),
  KEY idx_experience_comments_status (status),
  CONSTRAINT fk_experience_comments_experience
    FOREIGN KEY (experience_id) REFERENCES experiences (experience_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_experience_comments_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contact_messages (
  message_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL,
  subject VARCHAR(160) NULL,
  message TEXT NOT NULL,
  status ENUM('nuevo', 'en_revision', 'respondido', 'cerrado') NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id),
  KEY idx_contact_messages_user_id (user_id),
  KEY idx_contact_messages_email (email),
  KEY idx_contact_messages_status (status),
  CONSTRAINT fk_contact_messages_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contact_attachments (
  attachment_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  message_id BIGINT UNSIGNED NOT NULL,
  file_name VARCHAR(180) NOT NULL,
  mime_type VARCHAR(100) NULL,
  file_url MEDIUMTEXT NULL,
  file_size_bytes INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (attachment_id),
  KEY idx_contact_attachments_message_id (message_id),
  CONSTRAINT fk_contact_attachments_message
    FOREIGN KEY (message_id) REFERENCES contact_messages (message_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_logs (
  audit_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (audit_id),
  KEY idx_audit_logs_actor_user_id (actor_user_id),
  KEY idx_audit_logs_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_logs_actor_user
    FOREIGN KEY (actor_user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW vw_experience_stats AS
SELECT
  e.experience_id,
  e.title,
  e.status,
  e.created_at,
  COALESCE(vs.likes_count, 0) AS likes_count,
  COALESCE(vs.dislikes_count, 0) AS dislikes_count,
  COALESCE(cs.comments_count, 0) AS comments_count
FROM experiences e
LEFT JOIN (
  SELECT
    experience_id,
    SUM(vote_type = 'like') AS likes_count,
    SUM(vote_type = 'dislike') AS dislikes_count
  FROM experience_votes
  GROUP BY experience_id
) vs ON vs.experience_id = e.experience_id
LEFT JOIN (
  SELECT
    experience_id,
    COUNT(*) AS comments_count
  FROM experience_comments
  WHERE status = 'visible'
  GROUP BY experience_id
) cs ON cs.experience_id = e.experience_id;

INSERT INTO roles (role_id, name, description) VALUES
  (1, 'usuario', 'Usuario registrado de Lumina'),
  (2, 'admin', 'Administrador del sistema')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO departments (name) VALUES
  ('Administracion'),
  ('Operaciones'),
  ('Recursos Humanos'),
  ('Ventas'),
  ('Marketing'),
  ('Finanzas')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);

INSERT INTO worker_roles (name, description) VALUES
  ('Admin', 'Acceso administrativo completo'),
  ('Gestor', 'Gestion de informacion y procesos'),
  ('Operador', 'Operacion diaria del sistema'),
  ('Viewer', 'Consulta de informacion')
ON DUPLICATE KEY UPDATE
  description = VALUES(description);
