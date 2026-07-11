const { pool } = require('../db/pool');

const ANSWER_KEY_LOCK_NAME = 'bolao2026:semifinal-answer-key';

function mapAnswerKeyRow(row) {
  if (!row) {
    return null;
  }

  return {
    championTeamCode: row.champion_team_code,
    championTeamName: row.champion_team_name,
    teamCodes: [row.team_1_code, row.team_2_code, row.team_3_code, row.team_4_code],
    teams: [
      { code: row.team_1_code, name: row.team_1_name },
      { code: row.team_2_code, name: row.team_2_name },
      { code: row.team_3_code, name: row.team_3_name },
      { code: row.team_4_code, name: row.team_4_name }
    ],
    topScorerName: row.top_scorer_name,
    topScorerGoals: row.top_scorer_goals === null || row.top_scorer_goals === undefined ? null : Number(row.top_scorer_goals),
    updatedAt: row.updated_at
  };
}

async function findSemifinalAnswerKey() {
  const [rows] = await pool.query(
    `SELECT champion_team_code, champion_team_name,
            team_1_code, team_1_name, team_2_code, team_2_name,
            team_3_code, team_3_name, team_4_code, team_4_name,
            top_scorer_name, top_scorer_goals, updated_at
     FROM semifinal_answer_key WHERE id = 1 LIMIT 1`
  );

  return mapAnswerKeyRow(rows[0]);
}

async function withAnswerKeyLock(work) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query('SELECT GET_LOCK(?, 10) AS acquired', [ANSWER_KEY_LOCK_NAME]);
    if (Number(rows[0]?.acquired) !== 1) {
      const error = new Error('Nao foi possivel bloquear o gabarito para atualizacao.');
      error.status = 409;
      error.code = 'ANSWER_KEY_BUSY';
      throw error;
    }
    return await work();
  } finally {
    await connection.query('SELECT RELEASE_LOCK(?)', [ANSWER_KEY_LOCK_NAME]);
    connection.release();
  }
}

async function saveAnswerKeyAndScores(answerKey, calculatePoints) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO semifinal_answer_key (
         id, champion_team_code, champion_team_name,
         team_1_code, team_1_name, team_2_code, team_2_name,
         team_3_code, team_3_name, team_4_code, team_4_name,
         top_scorer_name, top_scorer_goals
       ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         champion_team_code = VALUES(champion_team_code), champion_team_name = VALUES(champion_team_name),
         team_1_code = VALUES(team_1_code), team_1_name = VALUES(team_1_name),
         team_2_code = VALUES(team_2_code), team_2_name = VALUES(team_2_name),
         team_3_code = VALUES(team_3_code), team_3_name = VALUES(team_3_name),
         team_4_code = VALUES(team_4_code), team_4_name = VALUES(team_4_name),
         top_scorer_name = VALUES(top_scorer_name), top_scorer_goals = VALUES(top_scorer_goals)`,
      [
        answerKey.champion?.code || null,
        answerKey.champion?.name || null,
        ...answerKey.semifinalists.flatMap((team) => [team.code, team.name]),
        answerKey.topScorerName,
        answerKey.topScorerGoals
      ]
    );

    const [rows] = await connection.query(
      `SELECT id, champion_team_code, top_scorer_name, top_scorer_goals,
              semi_finalist_1_team_code, semi_finalist_2_team_code,
              semi_finalist_3_team_code, semi_finalist_4_team_code
       FROM competition_extra_predictions extras
       INNER JOIN competition_phases phases ON phases.id = extras.phase_id
       WHERE phases.code = 'group-stage'
       FOR UPDATE`
    );

    for (const row of rows) {
      const prediction = {
        championTeamCode: row.champion_team_code,
        semiFinalistCodes: [
          row.semi_finalist_1_team_code,
          row.semi_finalist_2_team_code,
          row.semi_finalist_3_team_code,
          row.semi_finalist_4_team_code
        ],
        topScorerName: row.top_scorer_name,
        topScorerGoals: row.top_scorer_goals
      };
      await connection.query(
        'UPDATE competition_extra_predictions SET points_awarded = ? WHERE id = ?',
        [calculatePoints(prediction), row.id]
      );
    }

    await connection.commit();
    return rows.length;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  findSemifinalAnswerKey,
  mapAnswerKeyRow,
  saveAnswerKeyAndScores,
  withAnswerKeyLock
};
