ALTER TABLE competition_phases
  ADD COLUMN match_count INT NULL AFTER deadline_at;

ALTER TABLE competition_extra_predictions
  ADD COLUMN semi_finalist_1_team_code VARCHAR(32) NULL AFTER top_scorer_goals,
  ADD COLUMN semi_finalist_1_team_name VARCHAR(120) NULL AFTER semi_finalist_1_team_code,
  ADD COLUMN semi_finalist_2_team_code VARCHAR(32) NULL AFTER semi_finalist_1_team_name,
  ADD COLUMN semi_finalist_2_team_name VARCHAR(120) NULL AFTER semi_finalist_2_team_code,
  ADD COLUMN semi_finalist_3_team_code VARCHAR(32) NULL AFTER semi_finalist_2_team_name,
  ADD COLUMN semi_finalist_3_team_name VARCHAR(120) NULL AFTER semi_finalist_3_team_code,
  ADD COLUMN semi_finalist_4_team_code VARCHAR(32) NULL AFTER semi_finalist_3_team_name,
  ADD COLUMN semi_finalist_4_team_name VARCHAR(120) NULL AFTER semi_finalist_4_team_code;
