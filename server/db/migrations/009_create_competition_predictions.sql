CREATE TABLE IF NOT EXISTS competition_predictions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  participant_id BIGINT UNSIGNED NOT NULL,
  match_id BIGINT UNSIGNED NOT NULL,
  phase_id BIGINT UNSIGNED NOT NULL,
  predicted_home_score INT NULL,
  predicted_away_score INT NULL,
  is_defaulted TINYINT(1) NOT NULL DEFAULT 0,
  points_awarded INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY competition_predictions_participant_match_unique (participant_id, match_id),
  KEY competition_predictions_participant_phase_idx (participant_id, phase_id),
  KEY competition_predictions_match_id_idx (match_id),
  KEY competition_predictions_phase_id_idx (phase_id),
  CONSTRAINT competition_predictions_participant_fk
    FOREIGN KEY (participant_id) REFERENCES participants (id)
    ON DELETE CASCADE,
  CONSTRAINT competition_predictions_match_fk
    FOREIGN KEY (match_id) REFERENCES competition_match_master (id)
    ON DELETE CASCADE,
  CONSTRAINT competition_predictions_phase_fk
    FOREIGN KEY (phase_id) REFERENCES competition_phases (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
