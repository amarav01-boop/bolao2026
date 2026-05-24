CREATE TABLE IF NOT EXISTS competition_extra_predictions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  participant_id BIGINT UNSIGNED NOT NULL,
  phase_id BIGINT UNSIGNED NOT NULL,
  champion_team_code VARCHAR(32) NULL,
  champion_team_name VARCHAR(120) NULL,
  top_scorer_name VARCHAR(120) NULL,
  top_scorer_goals INT NULL,
  points_awarded INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY competition_extra_predictions_participant_phase_unique (participant_id, phase_id),
  KEY competition_extra_predictions_participant_idx (participant_id),
  KEY competition_extra_predictions_phase_idx (phase_id),
  CONSTRAINT competition_extra_predictions_participant_fk
    FOREIGN KEY (participant_id) REFERENCES participants (id)
    ON DELETE CASCADE,
  CONSTRAINT competition_extra_predictions_phase_fk
    FOREIGN KEY (phase_id) REFERENCES competition_phases (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
