CREATE TABLE IF NOT EXISTS competition_match_master (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  phase_id BIGINT UNSIGNED NOT NULL,
  match_code VARCHAR(80) NOT NULL,
  group_code VARCHAR(16) NULL,
  match_order INT NOT NULL DEFAULT 0,
  home_team_name VARCHAR(120) NOT NULL,
  away_team_name VARCHAR(120) NOT NULL,
  home_team_code VARCHAR(32) NULL,
  away_team_code VARCHAR(32) NULL,
  kickoff_at DATETIME NOT NULL,
  venue VARCHAR(120) NULL,
  is_played TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('scheduled', 'locked', 'completed') NOT NULL DEFAULT 'scheduled',
  result_home_score INT NULL,
  result_away_score INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY competition_match_master_code_unique (match_code),
  KEY competition_match_master_phase_id_idx (phase_id),
  KEY competition_match_master_group_code_idx (group_code),
  KEY competition_match_master_kickoff_idx (kickoff_at),
  CONSTRAINT competition_match_master_phase_fk
    FOREIGN KEY (phase_id) REFERENCES competition_phases (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO competition_match_master (
  phase_id,
  match_code,
  group_code,
  match_order,
  home_team_name,
  away_team_name,
  home_team_code,
  away_team_code,
  kickoff_at,
  venue,
  is_played,
  status,
  result_home_score,
  result_away_score,
  created_at,
  updated_at
)
SELECT
  phase_id,
  match_code,
  group_code,
  match_order,
  home_team_name,
  away_team_name,
  home_team_code,
  away_team_code,
  kickoff_at,
  venue,
  0,
  status,
  result_home_score,
  result_away_score,
  created_at,
  updated_at
FROM competition_matches;
