CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  participant_id BIGINT UNSIGNED NOT NULL,
  mentioned_participant_id BIGINT UNSIGNED NULL,
  content VARCHAR(240) NOT NULL,
  image_url VARCHAR(1024) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY chat_messages_mentioned_idx (mentioned_participant_id, id),
  CONSTRAINT chat_messages_participant_fk
    FOREIGN KEY (participant_id) REFERENCES participants(id),
  CONSTRAINT chat_messages_mentioned_participant_fk
    FOREIGN KEY (mentioned_participant_id) REFERENCES participants(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
