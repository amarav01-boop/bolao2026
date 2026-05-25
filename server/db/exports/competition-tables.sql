-- Auto-generated export of competition_phases and competition_match_master
-- Source: local MariaDB database
-- To import on a fresh database:
--   mysql -u root -p bolao2026 < server/db/exports/competition-tables.sql

SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

DELETE FROM competition_match_master;
DELETE FROM competition_phases;

INSERT INTO competition_phases (id, code, name, stage_type, group_code, round_label, sort_order, window_state, deadline_at, reveal_enabled, created_at, updated_at)
VALUES
  (1, 'group-stage', 'Fase de Grupos', 'group', NULL, NULL, 0, 'open', '2026-06-10 14:59:00', 1, '2026-05-23 21:59:43', '2026-05-24 15:05:40'),
  (5, 'second-round', 'Fase Segunda Rodada', 'knockout', NULL, 'Segunda Rodada', 0, 'closed', NULL, 0, '2026-05-24 13:24:27', '2026-05-24 13:24:27')
;

INSERT INTO competition_match_master (id, phase_id, match_code, group_code, match_order, home_team_name, away_team_name, home_team_code, away_team_code, kickoff_at, venue, is_played, status, result_home_score, result_away_score, created_at, updated_at)
VALUES
  (1, 1, 'group-a-1', 'A', 1, 'MÉXICO', 'ÁFRICA DO S.', 'mexico', 'africa-do-s', '2026-06-11 16:00:00', 'CID. MÉXICO', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (2, 1, 'group-a-2', 'A', 2, 'COREIA DO S.', 'REP. CHECA', 'coreia-do-s', 'rep-checa', '2026-06-11 23:00:00', 'GUADALAJARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (3, 1, 'group-a-3', 'A', 3, 'REP. CHECA', 'ÁFRICA DO S.', 'rep-checa', 'africa-do-s', '2026-06-18 13:00:00', 'ATLANTA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (4, 1, 'group-a-4', 'A', 4, 'MÉXICO', 'COREIA DO S.', 'mexico', 'coreia-do-s', '2026-06-18 22:00:00', 'GUADALAJARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (5, 1, 'group-a-5', 'A', 5, 'REP. CHECA', 'MÉXICO', 'rep-checa', 'mexico', '2026-06-24 22:00:00', 'CID. MÉXICO', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (6, 1, 'group-a-6', 'A', 6, 'ÁFRICA DO S.', 'COREIA DO S.', 'africa-do-s', 'coreia-do-s', '2026-06-24 22:00:00', 'MONTERREY', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (7, 1, 'group-b-1', 'B', 1, 'CANADÁ', 'BÓSNIA', 'canada', 'bosnia', '2026-06-12 16:00:00', 'TORONTO', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (8, 1, 'group-b-2', 'B', 2, 'CATAR', 'SUÍÇA', 'catar', 'suica', '2026-06-13 16:00:00', 'SANTA CLARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (9, 1, 'group-b-3', 'B', 3, 'SUÍÇA', 'BÓSNIA', 'suica', 'bosnia', '2026-06-18 16:00:00', 'INGLEWOOD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (10, 1, 'group-b-4', 'B', 4, 'CANADÁ', 'CATAR', 'canada', 'catar', '2026-06-18 19:00:00', 'VANCOUVER', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (11, 1, 'group-b-5', 'B', 5, 'SUÍÇA', 'CANADÁ', 'suica', 'canada', '2026-06-24 16:00:00', 'VANCOUVER', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (12, 1, 'group-b-6', 'B', 6, 'BÓSNIA', 'CATAR', 'bosnia', 'catar', '2026-06-24 16:00:00', 'SEATTLE', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (13, 1, 'group-c-1', 'C', 1, 'BRASIL', 'MARROCOS', 'brasil', 'marrocos', '2026-06-13 19:00:00', 'EAST RUTHERFORD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (14, 1, 'group-c-2', 'C', 2, 'HAITI', 'ESCÓCIA', 'haiti', 'escocia', '2026-06-13 22:00:00', 'FOXBOROUGH', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (15, 1, 'group-c-3', 'C', 3, 'ESCÓCIA', 'MARROCOS', 'escocia', 'marrocos', '2026-06-19 19:00:00', 'FOXBOROUGH', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (16, 1, 'group-c-4', 'C', 4, 'BRASIL', 'HAITI', 'brasil', 'haiti', '2026-06-19 21:30:00', 'FILADÉLFIA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (17, 1, 'group-c-5', 'C', 5, 'ESCÓCIA', 'BRASIL', 'escocia', 'brasil', '2026-06-24 19:00:00', 'MIAMI', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (18, 1, 'group-c-6', 'C', 6, 'MARROCOS', 'HAITI', 'marrocos', 'haiti', '2026-06-24 19:00:00', 'ATLANTA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (19, 1, 'group-d-1', 'D', 1, 'EUA', 'PARAGUAI', 'eua', 'paraguai', '2026-06-12 22:00:00', 'INGLEWOOD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (20, 1, 'group-d-2', 'D', 2, 'AUSTRÁLIA', 'TURQUIA', 'australia', 'turquia', '2026-06-14 01:00:00', 'VANCOUVER', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (21, 1, 'group-d-3', 'D', 3, 'EUA', 'AUSTRÁLIA', 'eua', 'australia', '2026-06-19 16:00:00', 'SEATTLE', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (22, 1, 'group-d-4', 'D', 4, 'TURQUIA', 'PARAGUAI', 'turquia', 'paraguai', '2026-06-20 00:00:00', 'SANTA CLARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (23, 1, 'group-d-5', 'D', 5, 'TURQUIA', 'EUA', 'turquia', 'eua', '2026-06-25 23:00:00', 'INGLEWOOD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (24, 1, 'group-d-6', 'D', 6, 'PARAGUAI', 'AUSTRÁLIA', 'paraguai', 'australia', '2026-06-25 23:00:00', 'SANTA CLARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (25, 1, 'group-e-1', 'E', 1, 'ALEMANHA', 'CURAÇAU', 'alemanha', 'curacau', '2026-06-14 14:00:00', 'HOUSTON', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (26, 1, 'group-e-2', 'E', 2, 'C. DO MARFIM', 'EQUADOR', 'c-do-marfim', 'equador', '2026-06-14 20:00:00', 'FILADÉLFIA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (27, 1, 'group-e-3', 'E', 3, 'ALEMANHA', 'C. DO MARFIM', 'alemanha', 'c-do-marfim', '2026-06-20 17:00:00', 'TORONTO', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (28, 1, 'group-e-4', 'E', 4, 'EQUADOR', 'CURAÇAU', 'equador', 'curacau', '2026-06-20 21:00:00', 'KANSAS CITY', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (29, 1, 'group-e-5', 'E', 5, 'EQUADOR', 'ALEMANHA', 'equador', 'alemanha', '2026-06-25 17:00:00', 'EAST RUTHERFORD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (30, 1, 'group-e-6', 'E', 6, 'CURAÇAU', 'C. DO MARFIM', 'curacau', 'c-do-marfim', '2026-06-25 17:00:00', 'FILADÉLFIA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (31, 1, 'group-f-1', 'F', 1, 'HOLANDA', 'JAPÃO', 'holanda', 'japao', '2026-06-14 17:00:00', 'DALLAS', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (32, 1, 'group-f-2', 'F', 2, 'SUÉCIA', 'TUNÍSIA', 'suecia', 'tunisia', '2026-06-14 23:00:00', 'MONTERREY', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (33, 1, 'group-f-3', 'F', 3, 'HOLANDA', 'SUÉCIA', 'holanda', 'suecia', '2026-06-20 14:00:00', 'HOUSTON', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (34, 1, 'group-f-4', 'F', 4, 'TUNÍSIA', 'JAPÃO', 'tunisia', 'japao', '2026-06-21 01:00:00', 'MONTERREY', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (35, 1, 'group-f-5', 'F', 5, 'TUNÍSIA', 'HOLANDA', 'tunisia', 'holanda', '2026-06-25 20:00:00', 'KANSAS CITY', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (36, 1, 'group-f-6', 'F', 6, 'JAPÃO', 'SUÉCIA', 'japao', 'suecia', '2026-06-25 20:00:00', 'DALLAS', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (37, 1, 'group-g-1', 'G', 1, 'BÉLGICA', 'EGITO', 'belgica', 'egito', '2026-06-15 16:00:00', 'SEATTLE', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (38, 1, 'group-g-2', 'G', 2, 'IRÃ', 'N. ZELÂNDIA', 'ira', 'n-zelandia', '2026-06-15 22:00:00', 'INGLEWOOD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (39, 1, 'group-g-3', 'G', 3, 'BÉLGICA', 'IRÃ', 'belgica', 'ira', '2026-06-21 16:00:00', 'INGLEWOOD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (40, 1, 'group-g-4', 'G', 4, 'N. ZELÂNDIA', 'EGITO', 'n-zelandia', 'egito', '2026-06-21 22:00:00', 'VANCOUVER', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (41, 1, 'group-g-5', 'G', 5, 'N. ZELÂNDIA', 'BÉLGICA', 'n-zelandia', 'belgica', '2026-06-27 00:00:00', 'VANCOUVER', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (42, 1, 'group-g-6', 'G', 6, 'EGITO', 'IRÃ', 'egito', 'ira', '2026-06-27 00:00:00', 'SEATTLE', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (43, 1, 'group-h-1', 'H', 1, 'ESPANHA', 'CABO VERDE', 'espanha', 'cabo-verde', '2026-06-15 13:00:00', 'ATLANTA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (44, 1, 'group-h-2', 'H', 2, 'ARÁBIA SAUDITA', 'URUGUAI', 'arabia-saudita', 'uruguai', '2026-06-15 19:00:00', 'MIAMI', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (45, 1, 'group-h-3', 'H', 3, 'ESPANHA', 'ARÁBIA SAUDITA', 'espanha', 'arabia-saudita', '2026-06-21 13:00:00', 'ATLANTA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (46, 1, 'group-h-4', 'H', 4, 'URUGUAI', 'CABO VERDE', 'uruguai', 'cabo-verde', '2026-06-21 19:00:00', 'MIAMI', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (47, 1, 'group-h-5', 'H', 5, 'URUGUAI', 'ESPANHA', 'uruguai', 'espanha', '2026-06-26 21:00:00', 'GUADALAJARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (48, 1, 'group-h-6', 'H', 6, 'CABO VERDE', 'ARÁBIA SAUDITA', 'cabo-verde', 'arabia-saudita', '2026-06-26 21:00:00', 'HOUSTON', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (49, 1, 'group-i-1', 'I', 1, 'FRANÇA', 'SENEGAL', 'franca', 'senegal', '2026-06-16 16:00:00', 'EAST RUTHERFORD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (50, 1, 'group-i-2', 'I', 2, 'IRAQUE', 'NORUEGA', 'iraque', 'noruega', '2026-06-16 19:00:00', 'FOXBOROUGH', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (51, 1, 'group-i-3', 'I', 3, 'FRANÇA', 'IRAQUE', 'franca', 'iraque', '2026-06-22 18:00:00', 'FILADÉLFIA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 22:23:17'),
  (52, 1, 'group-i-4', 'I', 4, 'NORUEGA', 'SENEGAL', 'noruega', 'senegal', '2026-06-22 21:00:00', 'EAST RUTHERFORD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:43', '2026-05-23 21:59:43'),
  (53, 1, 'group-i-5', 'I', 5, 'NORUEGA', 'FRANÇA', 'noruega', 'franca', '2026-06-26 16:00:00', 'FOXBOROUGH', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (54, 1, 'group-i-6', 'I', 6, 'SENEGAL', 'IRAQUE', 'senegal', 'iraque', '2026-06-26 16:00:00', 'TORONTO', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 21:59:44'),
  (55, 1, 'group-j-1', 'J', 1, 'ARGENTINA', 'ARGÉLIA', 'argentina', 'argelia', '2026-06-16 22:00:00', 'KANSAS CITY', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (56, 1, 'group-j-2', 'J', 2, 'ÁUSTRIA', 'JORDÂNIA', 'austria', 'jordania', '2026-06-17 01:00:00', 'SANTA CLARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (57, 1, 'group-j-3', 'J', 3, 'ARGENTINA', 'ÁUSTRIA', 'argentina', 'austria', '2026-06-22 14:00:00', 'DALLAS', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (58, 1, 'group-j-4', 'J', 4, 'JORDÂNIA', 'ARGÉLIA', 'jordania', 'argelia', '2026-06-23 00:00:00', 'SANTA CLARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (59, 1, 'group-j-5', 'J', 5, 'JORDÂNIA', 'ARGENTINA', 'jordania', 'argentina', '2026-06-27 23:00:00', 'DALLAS', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (60, 1, 'group-j-6', 'J', 6, 'ARGÉLIA', 'ÁUSTRIA', 'argelia', 'austria', '2026-06-27 23:00:00', 'KANSAS CITY', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (61, 1, 'group-k-1', 'K', 1, 'PORTUGAL', 'RD CONGO', 'portugal', 'rd-congo', '2026-06-17 14:00:00', 'HOUSTON', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 21:59:44'),
  (62, 1, 'group-k-2', 'K', 2, 'UZBEQUISTÃO', 'COLÔMBIA', 'uzbequistao', 'colombia', '2026-06-17 23:00:00', 'CID. MÉXICO', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (63, 1, 'group-k-3', 'K', 3, 'PORTUGAL', 'UZBEQUISTÃO', 'portugal', 'uzbequistao', '2026-06-23 14:00:00', 'HOUSTON', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (64, 1, 'group-k-4', 'K', 4, 'COLÔMBIA', 'RD CONGO', 'colombia', 'rd-congo', '2026-06-23 23:00:00', 'GUADALAJARA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (65, 1, 'group-k-5', 'K', 5, 'COLÔMBIA', 'PORTUGAL', 'colombia', 'portugal', '2026-06-27 20:30:00', 'MIAMI', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (66, 1, 'group-k-6', 'K', 6, 'RD CONGO', 'UZBEQUISTÃO', 'rd-congo', 'uzbequistao', '2026-06-27 20:30:00', 'ATLANTA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (67, 1, 'group-l-1', 'L', 1, 'INGLATERRA', 'CROÁCIA', 'inglaterra', 'croacia', '2026-06-17 17:00:00', 'DALLAS', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (68, 1, 'group-l-2', 'L', 2, 'GANA', 'PANAMÁ', 'gana', 'panama', '2026-06-17 20:00:00', 'TORONTO', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (69, 1, 'group-l-3', 'L', 3, 'INGLATERRA', 'GANA', 'inglaterra', 'gana', '2026-06-23 17:00:00', 'FOXBOROUGH', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 21:59:44'),
  (70, 1, 'group-l-4', 'L', 4, 'PANAMÁ', 'CROÁCIA', 'panama', 'croacia', '2026-06-23 20:00:00', 'TORONTO', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (71, 1, 'group-l-5', 'L', 5, 'PANAMÁ', 'INGLATERRA', 'panama', 'inglaterra', '2026-06-27 18:00:00', 'EAST RUTHERFORD', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (72, 1, 'group-l-6', 'L', 6, 'CROÁCIA', 'GANA', 'croacia', 'gana', '2026-06-27 18:00:00', 'FILADÉLFIA', 0, 'scheduled', NULL, NULL, '2026-05-23 21:59:44', '2026-05-23 22:23:17'),
  (200, 5, 'round-32', 'G32', 0, 'ARGENTINA', 'BÉLGICA', 'argentina', 'belgica', '2026-07-09 18:00:00', NULL, 0, 'scheduled', NULL, NULL, '2026-05-24 15:41:17', '2026-05-24 15:41:17')
;

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
