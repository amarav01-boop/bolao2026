CREATE TABLE IF NOT EXISTS competition_phases (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(80) NOT NULL,
  name VARCHAR(120) NOT NULL,
  stage_type ENUM('group', 'knockout') NOT NULL,
  group_code VARCHAR(16) NULL,
  round_label VARCHAR(80) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  window_state ENUM('closed', 'open', 'locked') NOT NULL DEFAULT 'closed',
  deadline_at DATETIME NULL,
  reveal_enabled TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY competition_phases_code_unique (code),
  KEY competition_phases_stage_type_idx (stage_type),
  KEY competition_phases_sort_order_idx (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
