CREATE TABLE semifinal_answer_key (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  team_1_code VARCHAR(32) NOT NULL,
  team_1_name VARCHAR(120) NOT NULL,
  team_2_code VARCHAR(32) NOT NULL,
  team_2_name VARCHAR(120) NOT NULL,
  team_3_code VARCHAR(32) NOT NULL,
  team_3_name VARCHAR(120) NOT NULL,
  team_4_code VARCHAR(32) NOT NULL,
  team_4_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_semifinal_answer_key_singleton CHECK (id = 1),
  CONSTRAINT chk_semifinal_answer_key_unique CHECK (
    team_1_code <> team_2_code AND team_1_code <> team_3_code AND team_1_code <> team_4_code AND
    team_2_code <> team_3_code AND team_2_code <> team_4_code AND team_3_code <> team_4_code
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
