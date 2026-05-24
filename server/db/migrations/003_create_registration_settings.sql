CREATE TABLE IF NOT EXISTS registration_settings (
  id TINYINT UNSIGNED NOT NULL,
  is_registration_open TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO registration_settings (id, is_registration_open)
VALUES (1, 1)
ON DUPLICATE KEY UPDATE is_registration_open = VALUES(is_registration_open);
