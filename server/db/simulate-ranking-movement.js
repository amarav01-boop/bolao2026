const { pool } = require('./pool');
const predictionService = require('../services/prediction-service');
const rankingService = require('../services/ranking-service');

const RESULT_PATTERNS = [
  [2, 0],
  [1, 1],
  [0, 1],
  [3, 1],
  [1, 2],
  [2, 1],
  [0, 0],
  [1, 3],
  [2, 2],
  [0, 2]
];

function buildPrediction(result, participantIndex, matchIndex) {
  const exactEvery = Math.min(8, participantIndex + 2);

  if (matchIndex % exactEvery === 0) {
    return result;
  }

  const outcome = Math.sign(result.home - result.away);

  if ((matchIndex + participantIndex) % 3 === 0) {
    if (outcome === 0) {
      return { home: result.home + 1, away: result.away + 1 };
    }

    return outcome > 0 ? { home: 1, away: 0 } : { home: 0, away: 1 };
  }

  if ((matchIndex + participantIndex) % 2 === 0) {
    return outcome === 0 ? { home: 1, away: 0 } : { home: 1, away: 1 };
  }

  return outcome >= 0 ? { home: 0, away: 1 } : { home: 2, away: 0 };
}

async function upsertPrediction(connection, input) {
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
    [
      input.participantId,
      input.matchId,
      input.phaseId,
      input.home,
      input.away
    ]
  );
}

async function simulateRankingMovement(matchCount = 20) {
  const connection = await pool.getConnection();
  let simulatedMatches;

  try {
    await connection.beginTransaction();

    const [participants] = await connection.query(
      `
        SELECT id, nickname, current_position
        FROM participants
        WHERE is_admin = 0
        ORDER BY current_position DESC, id ASC
      `
    );
    const [matches] = await connection.query(
      `
        SELECT id, phase_id, home_team_name, away_team_name
        FROM competition_match_master
        WHERE is_played = 0
        ORDER BY kickoff_at ASC, id ASC
        LIMIT ?
      `,
      [matchCount]
    );

    if (matches.length < matchCount) {
      throw new Error(`Somente ${matches.length} jogos pendentes estão disponíveis.`);
    }

    for (const [matchIndex, match] of matches.entries()) {
      const [home, away] = RESULT_PATTERNS[matchIndex % RESULT_PATTERNS.length];
      const result = { home, away };
      const day = 8 + Math.floor(matchIndex / 4);
      const hour = 12 + (matchIndex % 4) * 3;
      const kickoffAt = `2026-06-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00:00`;

      await connection.query(
        `
          UPDATE competition_match_master
          SET kickoff_at = ?,
              is_played = 1,
              status = 'completed',
              result_home_score = ?,
              result_away_score = ?
          WHERE id = ?
        `,
        [kickoffAt, home, away, match.id]
      );

      for (const [participantIndex, participant] of participants.entries()) {
        const prediction = buildPrediction(result, participantIndex, matchIndex);
        await upsertPrediction(connection, {
          participantId: participant.id,
          matchId: match.id,
          phaseId: match.phase_id,
          home: prediction.home,
          away: prediction.away
        });
      }
    }

    await connection.commit();
    simulatedMatches = matches.map((match, index) => ({
      id: Number(match.id),
      fixture: `${match.home_team_name} x ${match.away_team_name}`,
      result: `${RESULT_PATTERNS[index % RESULT_PATTERNS.length][0]} x ${RESULT_PATTERNS[index % RESULT_PATTERNS.length][1]}`
    }));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  await predictionService.recalculateRankingPoints();
  await rankingService.recalculateRankingPositions({ forceSnapshot: true });
  const ranking = await rankingService.getRanking();

  return {
    simulatedMatches,
    ranking: ranking.ranking.map((participant) => ({
      nickname: participant.nickname,
      rank: participant.rank,
      points: participant.points,
      lastPosition: participant.lastPosition,
      currentPosition: participant.currentPosition,
      movement: participant.movement,
      rankDelta: participant.rankDelta,
      statusChip: participant.statusChip
    }))
  };
}

if (require.main === module) {
  simulateRankingMovement()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .then(() => pool.end())
    .catch(async (error) => {
      console.error(error);
      await pool.end();
      process.exitCode = 1;
    });
}

module.exports = {
  buildPrediction,
  simulateRankingMovement
};
