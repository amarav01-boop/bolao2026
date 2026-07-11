ALTER TABLE semifinal_answer_key
  ADD COLUMN champion_team_code VARCHAR(32) NULL AFTER id,
  ADD COLUMN champion_team_name VARCHAR(120) NULL AFTER champion_team_code,
  ADD COLUMN top_scorer_name VARCHAR(120) NULL AFTER team_4_name,
  ADD COLUMN top_scorer_goals INT NULL AFTER top_scorer_name;
