ALTER TABLE participants
  ADD COLUMN current_position INT UNSIGNED NULL AFTER avatar_key,
  ADD COLUMN last_position INT UNSIGNED NULL AFTER current_position;
