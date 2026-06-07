const { pool } = require('./pool');
const predictionService = require('../services/prediction-service');

const COMPLETED_RESULTS = [
  { home: 2, away: 0, kickoffAt: '2026-06-05 15:00:00' },
  { home: 1, away: 1, kickoffAt: '2026-06-05 19:00:00' },
  { home: 0, away: 1, kickoffAt: '2026-06-06 14:00:00' },
  { home: 3, away: 1, kickoffAt: '2026-06-06 18:00:00' },
  { home: 1, away: 2, kickoffAt: '2026-06-06 22:00:00' }
];

const TODAY_KICKOFFS = [
  '2026-06-07 15:00:00',
  '2026-06-07 19:00:00',
  '2026-06-07 23:00:00'
];

function buildCompletedPrediction(result, participantIndex, matchIndex) {
  const pattern = (participantIndex + matchIndex) % 5;

  if (pattern === 0 || (participantIndex === 3 && matchIndex < 3)) {
    return { home: result.home, away: result.away };
  }

  if (pattern === 1) {
    if (result.home === result.away) {
      return { home: result.home + 1, away: result.away + 1 };
    }

    return result.home > result.away
      ? { home: result.home + 1, away: result.away }
      : { home: result.home, away: result.away + 1 };
  }

  if (pattern === 2) {
    return { home: 1, away: 1 };
  }

  if (pattern === 3) {
    return { home: 0, away: 1 };
  }

  return { home: 2, away: 0 };
}

function buildTodayPrediction(participantIndex, matchIndex) {
  const pattern = (participantIndex + matchIndex) % 3;

  if (pattern === 0) {
    return { home: 2, away: 0 };
  }

  if (pattern === 1) {
    return { home: 1, away: 1 };
  }

  return { home: 0, away: 1 };
}

async function loadSimulationTargets(connection) {
  const [phases] = await connection.query(
    `
      SELECT id
      FROM competition_phases
      WHERE code = 'group-stage'
      LIMIT 1
    `
  );

  if (!phases.length) {
    throw new Error('A fase de grupos não foi encontrada.');
  }

  const phaseId = Number(phases[0].id);
  const [participants] = await connection.query(
    `
      SELECT id, nickname
      FROM participants
      WHERE is_admin = 0
      ORDER BY id ASC
    `
  );
  const [matches] = await connection.query(
    `
      SELECT id, phase_id, home_team_name, away_team_name
      FROM competition_match_master
      WHERE phase_id = ?
      ORDER BY kickoff_at ASC, id ASC
      LIMIT 8
    `,
    [phaseId]
  );

  if (!participants.length) {
    throw new Error('Nenhum participante cadastrado foi encontrado.');
  }

  if (matches.length < 8) {
    throw new Error('São necessários pelo menos oito jogos na fase de grupos.');
  }

  return { phaseId, participants, matches };
}

async function upsertPrediction(connection, { participantId, matchId, phaseId, home, away }) {
  await connection.query(
    `
      INSERT INTO competition_predictions (
        participant_id,
        match_id,
        phase_id,
        predicted_home_score,
        predicted_away_score,
        is_defaulted,
        points_awarded
      ) VALUES (?, ?, ?, ?, ?, 0, NULL)
      ON DUPLICATE KEY UPDATE
        phase_id = VALUES(phase_id),
        predicted_home_score = VALUES(predicted_home_score),
        predicted_away_score = VALUES(predicted_away_score),
        is_defaulted = 0,
        points_awarded = NULL
    `,
    [participantId, matchId, phaseId, home, away]
  );
}

async function applySimulation() {
  const connection = await pool.getConnection();
  let summary;

  try {
    await connection.beginTransaction();

    const { phaseId, participants, matches } = await loadSimulationTargets(connection);
    const completedMatches = matches.slice(0, COMPLETED_RESULTS.length);
    const todayMatches = matches.slice(COMPLETED_RESULTS.length);

    await connection.query(
      `
        UPDATE competition_phases
        SET window_state = 'locked',
            deadline_at = '2026-06-04 23:59:00',
            reveal_enabled = 1
        WHERE id = ?
      `,
      [phaseId]
    );

    for (const [matchIndex, match] of completedMatches.entries()) {
      const result = COMPLETED_RESULTS[matchIndex];

      await connection.query(
        `
          UPDATE competition_match_master
          SET kickoff_at = ?,
              is_played = 1,
              status = 'played',
              result_home_score = ?,
              result_away_score = ?
          WHERE id = ?
        `,
        [result.kickoffAt, result.home, result.away, match.id]
      );

      for (const [participantIndex, participant] of participants.entries()) {
        const prediction = buildCompletedPrediction(result, participantIndex, matchIndex);
        await upsertPrediction(connection, {
          participantId: participant.id,
          matchId: match.id,
          phaseId,
          home: prediction.home,
          away: prediction.away
        });
      }
    }

    for (const [matchIndex, match] of todayMatches.entries()) {
      await connection.query(
        `
          UPDATE competition_match_master
          SET kickoff_at = ?,
              is_played = 0,
              status = 'scheduled',
              result_home_score = NULL,
              result_away_score = NULL
          WHERE id = ?
        `,
        [TODAY_KICKOFFS[matchIndex], match.id]
      );

      for (const [participantIndex, participant] of participants.entries()) {
        const prediction = buildTodayPrediction(participantIndex, matchIndex);
        await upsertPrediction(connection, {
          participantId: participant.id,
          matchId: match.id,
          phaseId,
          home: prediction.home,
          away: prediction.away
        });
      }
    }

    await connection.commit();
    summary = {
      participantCount: participants.length,
      completedMatches: completedMatches.map((match, index) => ({
        id: Number(match.id),
        fixture: `${match.home_team_name} x ${match.away_team_name}`,
        result: `${COMPLETED_RESULTS[index].home} x ${COMPLETED_RESULTS[index].away}`
      })),
      todayMatches: todayMatches.map((match, index) => ({
        id: Number(match.id),
        fixture: `${match.home_team_name} x ${match.away_team_name}`,
        kickoffAt: TODAY_KICKOFFS[index]
      }))
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const recalculation = await predictionService.recalculateRankingPoints();

  return {
    ...summary,
    recalculatedMatches: recalculation.recalculatedMatches
  };
}

if (require.main === module) {
  applySimulation()
    .then((summary) => {
      console.log('Simulação aplicada com sucesso.');
      console.log(JSON.stringify(summary, null, 2));
    })
    .then(() => pool.end())
    .catch(async (error) => {
      console.error('Falha ao aplicar simulação:', error);
      await pool.end();
      process.exitCode = 1;
    });
}

module.exports = {
  applySimulation,
  buildCompletedPrediction,
  buildTodayPrediction
};
