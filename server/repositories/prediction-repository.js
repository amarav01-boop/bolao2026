const { pool } = require('../db/pool');

function mapPredictionRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    participantId: Number(row.participant_id),
    matchId: Number(row.match_id),
    phaseId: Number(row.phase_id),
    predictedHomeScore: row.predicted_home_score === null ? null : Number(row.predicted_home_score),
    predictedAwayScore: row.predicted_away_score === null ? null : Number(row.predicted_away_score),
    isDefaulted: Boolean(row.is_defaulted),
    pointsAwarded: row.points_awarded === null ? null : Number(row.points_awarded),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapExtraPredictionRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    participantId: Number(row.participant_id),
    phaseId: Number(row.phase_id),
    championTeamCode: row.champion_team_code,
    championTeamName: row.champion_team_name,
    topScorerName: row.top_scorer_name,
    topScorerGoals: row.top_scorer_goals === null ? null : Number(row.top_scorer_goals),
    semiFinalist1Code: row.semi_finalist_1_team_code,
    semiFinalist1Name: row.semi_finalist_1_team_name,
    semiFinalist2Code: row.semi_finalist_2_team_code,
    semiFinalist2Name: row.semi_finalist_2_team_name,
    semiFinalist3Code: row.semi_finalist_3_team_code,
    semiFinalist3Name: row.semi_finalist_3_team_name,
    semiFinalist4Code: row.semi_finalist_4_team_code,
    semiFinalist4Name: row.semi_finalist_4_team_name,
    pointsAwarded: row.points_awarded === null ? null : Number(row.points_awarded),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function findActiveCompetitionPhase() {
  const [rows] = await pool.query(
    `
      SELECT id, code, name, stage_type, group_code, round_label, sort_order, window_state, deadline_at, match_count, reveal_enabled, created_at, updated_at
      FROM competition_phases
      WHERE window_state = 'open'
      ORDER BY sort_order ASC, id ASC
      LIMIT 1
    `
  );

  return rows[0] || null;
}

async function listMatchesForPhase(phaseId) {
  const [rows] = await pool.query(
    `
      SELECT
        m.id,
        m.phase_id,
        p.code AS phase_code,
        p.name AS phase_name,
        p.stage_type,
        m.group_code,
        m.match_code,
        m.match_order,
        m.home_team_name,
        m.away_team_name,
        m.home_team_code,
        m.away_team_code,
        m.kickoff_at,
        m.venue,
        m.is_played,
        m.status,
        m.result_home_score,
        m.result_away_score,
        m.created_at,
        m.updated_at
      FROM competition_match_master m
      INNER JOIN competition_phases p ON p.id = m.phase_id
      WHERE m.phase_id = ?
      ORDER BY m.group_code IS NULL, m.group_code ASC, m.match_order ASC, m.kickoff_at ASC, m.id ASC
    `,
    [phaseId]
  );

  return rows;
}

async function listParticipantPredictionsForPhase(participantId, phaseId) {
  const [rows] = await pool.query(
    `
      SELECT id, participant_id, match_id, phase_id, predicted_home_score, predicted_away_score, is_defaulted, points_awarded, created_at, updated_at
      FROM competition_predictions
      WHERE participant_id = ? AND phase_id = ?
      ORDER BY match_id ASC
    `,
    [participantId, phaseId]
  );

  return rows.map(mapPredictionRow);
}

async function listPredictionsForMatch(matchId) {
  const [rows] = await pool.query(
    `
      SELECT id, participant_id, match_id, phase_id, predicted_home_score, predicted_away_score, is_defaulted, points_awarded, created_at, updated_at
      FROM competition_predictions
      WHERE match_id = ?
      ORDER BY participant_id ASC
    `,
    [matchId]
  );

  return rows.map(mapPredictionRow);
}

async function listPredictionsForPhase(phaseId) {
  const [rows] = await pool.query(
    `
      SELECT id, participant_id, match_id, phase_id, predicted_home_score, predicted_away_score, is_defaulted, points_awarded, created_at, updated_at
      FROM competition_predictions
      WHERE phase_id = ?
      ORDER BY participant_id ASC, match_id ASC
    `,
    [phaseId]
  );

  return rows.map(mapPredictionRow);
}

async function listAllPredictions() {
  const [rows] = await pool.query(
    `
      SELECT id, participant_id, match_id, phase_id, predicted_home_score, predicted_away_score, is_defaulted, points_awarded, created_at, updated_at
      FROM competition_predictions
      ORDER BY participant_id ASC, phase_id ASC, match_id ASC
    `
  );

  return rows.map(mapPredictionRow);
}

async function findExtraPredictionForPhase(participantId, phaseId) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        participant_id,
        phase_id,
        champion_team_code,
        champion_team_name,
        top_scorer_name,
        top_scorer_goals,
        semi_finalist_1_team_code,
        semi_finalist_1_team_name,
        semi_finalist_2_team_code,
        semi_finalist_2_team_name,
        semi_finalist_3_team_code,
        semi_finalist_3_team_name,
        semi_finalist_4_team_code,
        semi_finalist_4_team_name,
        points_awarded,
        created_at,
        updated_at
      FROM competition_extra_predictions
      WHERE participant_id = ? AND phase_id = ?
      LIMIT 1
    `,
    [participantId, phaseId]
  );

  return mapExtraPredictionRow(rows[0]);
}

async function listAllExtraPredictions() {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        participant_id,
        phase_id,
        champion_team_code,
        champion_team_name,
        top_scorer_name,
        top_scorer_goals,
        semi_finalist_1_team_code,
        semi_finalist_1_team_name,
        semi_finalist_2_team_code,
        semi_finalist_2_team_name,
        semi_finalist_3_team_code,
        semi_finalist_3_team_name,
        semi_finalist_4_team_code,
        semi_finalist_4_team_name,
        points_awarded,
        created_at,
        updated_at
      FROM competition_extra_predictions
      ORDER BY participant_id ASC, phase_id ASC
    `
  );

  return rows.map(mapExtraPredictionRow);
}

async function upsertExtraPrediction({
  participantId,
  phaseId,
  championTeamCode,
  championTeamName,
  topScorerName,
  topScorerGoals,
  semiFinalist1Code,
  semiFinalist1Name,
  semiFinalist2Code,
  semiFinalist2Name,
  semiFinalist3Code,
  semiFinalist3Name,
  semiFinalist4Code,
  semiFinalist4Name,
  pointsAwarded = null
}) {
  await pool.query(
    `
      INSERT INTO competition_extra_predictions (
        participant_id,
        phase_id,
        champion_team_code,
        champion_team_name,
        top_scorer_name,
        top_scorer_goals,
        semi_finalist_1_team_code,
        semi_finalist_1_team_name,
        semi_finalist_2_team_code,
        semi_finalist_2_team_name,
        semi_finalist_3_team_code,
        semi_finalist_3_team_name,
        semi_finalist_4_team_code,
        semi_finalist_4_team_name,
        points_awarded
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        champion_team_code = VALUES(champion_team_code),
        champion_team_name = VALUES(champion_team_name),
        top_scorer_name = VALUES(top_scorer_name),
        top_scorer_goals = VALUES(top_scorer_goals),
        semi_finalist_1_team_code = VALUES(semi_finalist_1_team_code),
        semi_finalist_1_team_name = VALUES(semi_finalist_1_team_name),
        semi_finalist_2_team_code = VALUES(semi_finalist_2_team_code),
        semi_finalist_2_team_name = VALUES(semi_finalist_2_team_name),
        semi_finalist_3_team_code = VALUES(semi_finalist_3_team_code),
        semi_finalist_3_team_name = VALUES(semi_finalist_3_team_name),
        semi_finalist_4_team_code = VALUES(semi_finalist_4_team_code),
        semi_finalist_4_team_name = VALUES(semi_finalist_4_team_name),
        points_awarded = VALUES(points_awarded)
    `,
    [
      participantId,
      phaseId,
      championTeamCode || null,
      championTeamName || null,
      topScorerName || null,
      topScorerGoals === undefined || topScorerGoals === '' ? null : topScorerGoals,
      semiFinalist1Code || null,
      semiFinalist1Name || null,
      semiFinalist2Code || null,
      semiFinalist2Name || null,
      semiFinalist3Code || null,
      semiFinalist3Name || null,
      semiFinalist4Code || null,
      semiFinalist4Name || null,
      pointsAwarded
    ]
  );

  return findExtraPredictionForPhase(participantId, phaseId);
}

async function upsertParticipantPrediction({
  participantId,
  matchId,
  phaseId,
  predictedHomeScore,
  predictedAwayScore,
  isDefaulted = false,
  pointsAwarded = null
}) {
  await pool.query(
    `
      INSERT INTO competition_predictions (
        participant_id,
        match_id,
        phase_id,
        predicted_home_score,
        predicted_away_score,
        is_defaulted,
        points_awarded
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        phase_id = VALUES(phase_id),
        predicted_home_score = VALUES(predicted_home_score),
        predicted_away_score = VALUES(predicted_away_score),
        is_defaulted = VALUES(is_defaulted),
        points_awarded = VALUES(points_awarded)
    `,
    [
      participantId,
      matchId,
      phaseId,
      predictedHomeScore,
      predictedAwayScore,
      isDefaulted ? 1 : 0,
      pointsAwarded
    ]
  );

  const [rows] = await pool.query(
    `
      SELECT id, participant_id, match_id, phase_id, predicted_home_score, predicted_away_score, is_defaulted, points_awarded, created_at, updated_at
      FROM competition_predictions
      WHERE participant_id = ? AND match_id = ?
      LIMIT 1
    `,
    [participantId, matchId]
  );

  return mapPredictionRow(rows[0]);
}

async function updatePredictionPoints(predictionId, pointsAwarded) {
  await pool.query(
    `
      UPDATE competition_predictions
      SET points_awarded = ?
      WHERE id = ?
    `,
    [pointsAwarded, predictionId]
  );
}

module.exports = {
  findActiveCompetitionPhase,
  findExtraPredictionForPhase,
  listAllPredictions,
  listAllExtraPredictions,
  listMatchesForPhase,
  listParticipantPredictionsForPhase,
  listPredictionsForPhase,
  listPredictionsForMatch,
  mapExtraPredictionRow,
  mapPredictionRow,
  updatePredictionPoints,
  upsertExtraPrediction,
  upsertParticipantPrediction
};
