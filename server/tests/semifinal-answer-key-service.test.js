const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateExtraPredictionPoints,
  calculateSemifinalPoints,
  isScorerNameMatch,
  saveFinalAnswerKey,
  saveSemifinalAnswerKey
} = require('../services/semifinal-answer-key-service');
const { finalAnswerKeySchema, semifinalAnswerKeySchema } = require('../schemas/admin-schemas');
const answerKeyRepository = require('../repositories/semifinal-answer-key-repository');
const competitionRepository = require('../repositories/competition-repository');
const { pool } = require('../db/pool');
const { mapAnswerKeyRow } = answerKeyRepository;
const originalWithAnswerKeyLock = answerKeyRepository.withAnswerKeyLock;

test.before(() => {
  answerKeyRepository.withAnswerKeyLock = async (work) => work();
});

test.after(() => {
  answerKeyRepository.withAnswerKeyLock = originalWithAnswerKeyLock;
});

test('calculateSemifinalPoints compares team codes without considering order', () => {
  const answerKey = ['BRA', 'ARG', 'FRA', 'ESP'];

  assert.equal(calculateSemifinalPoints(['ESP', 'BRA', 'ARG', 'FRA'], answerKey), 20);
  assert.equal(calculateSemifinalPoints(['BRA', 'GER', 'ARG', 'URU'], answerKey), 10);
  assert.equal(calculateSemifinalPoints([null, '', 'ARG', 'URU'], answerKey), 5);
});

test('isScorerNameMatch accepts normalization, abbreviations, and minor typos conservatively', () => {
  assert.equal(isScorerNameMatch('VINÍCIUS JÚNIOR', 'vinicius junior'), true);
  assert.equal(isScorerNameMatch('Vini Jr', 'Vinicius Junior'), true);
  assert.equal(isScorerNameMatch('Vinicius', 'Vinicius Junior'), true);
  assert.equal(isScorerNameMatch('Vinicius Junor', 'Vinicius Junior'), true);
  assert.equal(isScorerNameMatch('V', 'Vinicius Junior'), false);
  assert.equal(isScorerNameMatch('Junior', 'Vinicius Junior'), false);
  assert.equal(isScorerNameMatch('Alex', 'Alexis Mac Allister'), false);
  assert.equal(isScorerNameMatch('Rodrygo', 'Vinicius Junior'), false);
});

test('calculateExtraPredictionPoints applies the published weights independently', () => {
  const answerKey = {
    championTeamCode: 'BRA',
    teamCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
    topScorerName: 'Vinicius Junior',
    topScorerGoals: 7
  };
  const fullHit = {
    championTeamCode: 'BRA',
    semiFinalistCodes: ['ESP', 'BRA', 'ARG', 'FRA'],
    topScorerName: 'Vini Jr',
    topScorerGoals: 7
  };

  assert.equal(calculateExtraPredictionPoints(fullHit, answerKey), 45);
  assert.equal(calculateExtraPredictionPoints({ ...fullHit, topScorerName: 'Rodrygo' }, answerKey), 35);
  assert.equal(calculateExtraPredictionPoints({ ...fullHit, topScorerGoals: 8 }, answerKey), 40);
  assert.equal(calculateExtraPredictionPoints({ ...fullHit, championTeamCode: 'ARG' }, answerKey), 35);
});

test('split answer key schemas accept and normalize their own card payloads', () => {
  const result = semifinalAnswerKeySchema.safeParse({
    teamCodes: [' bra ', 'ARG', 'FRA', 'ESP']
  });
  const finalResult = finalAnswerKeySchema.safeParse({
    championTeamCode: ' bra ',
    topScorerName: ' Vinicius Junior ',
    topScorerGoals: 7
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.data.teamCodes, ['BRA', 'ARG', 'FRA', 'ESP']);
  assert.equal(finalResult.success, true);
  assert.equal(finalResult.data.championTeamCode, 'BRA');
  assert.equal(finalResult.data.topScorerName, 'Vinicius Junior');
});

test('semifinalAnswerKeySchema rejects missing and duplicate team codes', () => {
  const missing = semifinalAnswerKeySchema.safeParse({ teamCodes: ['BRA', 'ARG', 'FRA'] });
  const duplicate = semifinalAnswerKeySchema.safeParse({ teamCodes: ['BRA', 'ARG', 'FRA', 'bra'] });

  assert.equal(missing.success, false);
  assert.equal(duplicate.success, false);
});

test('finalAnswerKeySchema rejects missing result fields', () => {
  const base = {
    championTeamCode: 'BRA',
    topScorerName: 'Vinicius Junior'
  };

  assert.equal(finalAnswerKeySchema.safeParse({ ...base, topScorerGoals: '' }).success, false);
});

test('calculateExtraPredictionPoints ignores official categories that are not saved', () => {
  const prediction = {
    championTeamCode: '',
    semiFinalistCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
    topScorerName: '',
    topScorerGoals: null
  };

  assert.equal(calculateExtraPredictionPoints(prediction, {
    teamCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
    championTeamCode: null,
    topScorerName: null,
    topScorerGoals: null
  }), 20);
});

test('mapAnswerKeyRow restores the saved answer key for admin reload', () => {
  const answerKey = mapAnswerKeyRow({
    team_1_code: 'BRA', team_1_name: 'Brasil',
    team_2_code: 'ARG', team_2_name: 'Argentina',
    team_3_code: 'FRA', team_3_name: 'Franca',
    team_4_code: 'ESP', team_4_name: 'Espanha',
    champion_team_code: 'BRA', champion_team_name: 'Brasil',
    top_scorer_name: 'Vinicius Junior', top_scorer_goals: 7,
    updated_at: '2026-07-11 10:00:00'
  });

  assert.deepEqual(answerKey.teamCodes, ['BRA', 'ARG', 'FRA', 'ESP']);
  assert.deepEqual(answerKey.teams[0], { code: 'BRA', name: 'Brasil' });
  assert.equal(answerKey.championTeamCode, 'BRA');
  assert.equal(answerKey.topScorerName, 'Vinicius Junior');
  assert.equal(answerKey.topScorerGoals, 7);
});

test('saveSemifinalAnswerKey rejects a team that is not in match setup before writing', async () => {
  const originalListMatches = competitionRepository.listCompetitionMatches;
  const originalFind = answerKeyRepository.findSemifinalAnswerKey;
  const originalSave = answerKeyRepository.saveAnswerKeyAndScores;
  let writeAttempted = false;

  competitionRepository.listCompetitionMatches = async () => [
    { homeTeamCode: 'BRA', homeTeamName: 'Brasil', awayTeamCode: 'ARG', awayTeamName: 'Argentina' },
    { homeTeamCode: 'FRA', homeTeamName: 'Franca', awayTeamCode: 'ESP', awayTeamName: 'Espanha' }
  ];
  answerKeyRepository.findSemifinalAnswerKey = async () => null;
  answerKeyRepository.saveAnswerKeyAndScores = async () => {
    writeAttempted = true;
  };

  try {
    await assert.rejects(
      saveSemifinalAnswerKey({
        teamCodes: ['BRA', 'ARG', 'FRA', 'XXX']
      }),
      (error) => error.code === 'INVALID_SEMIFINAL_TEAM'
    );
    assert.equal(writeAttempted, false);
  } finally {
    competitionRepository.listCompetitionMatches = originalListMatches;
    answerKeyRepository.findSemifinalAnswerKey = originalFind;
    answerKeyRepository.saveAnswerKeyAndScores = originalSave;
  }
});

test('saveSemifinalAnswerKey preserves final fields and rejects removing the saved champion', async () => {
  const originalListMatches = competitionRepository.listCompetitionMatches;
  const originalFind = answerKeyRepository.findSemifinalAnswerKey;
  const originalSave = answerKeyRepository.saveAnswerKeyAndScores;
  let savedAnswerKey;
  competitionRepository.listCompetitionMatches = async () => [
    { homeTeamCode: 'BRA', homeTeamName: 'Brasil', awayTeamCode: 'ARG', awayTeamName: 'Argentina' },
    { homeTeamCode: 'FRA', homeTeamName: 'Franca', awayTeamCode: 'ESP', awayTeamName: 'Espanha' },
    { homeTeamCode: 'URU', homeTeamName: 'Uruguai', awayTeamCode: 'COL', awayTeamName: 'Colombia' }
  ];
  answerKeyRepository.findSemifinalAnswerKey = async () => ({
    championTeamCode: 'BRA', championTeamName: 'Brasil',
    teamCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
    topScorerName: 'Vinicius Junior', topScorerGoals: 7
  });
  answerKeyRepository.saveAnswerKeyAndScores = async (answerKey) => {
    savedAnswerKey = answerKey;
    return 4;
  };

  try {
    await saveSemifinalAnswerKey({ teamCodes: ['BRA', 'ARG', 'FRA', 'URU'] });
    assert.equal(savedAnswerKey.champion.code, 'BRA');
    assert.equal(savedAnswerKey.topScorerName, 'Vinicius Junior');
    await assert.rejects(
      saveSemifinalAnswerKey({ teamCodes: ['ARG', 'FRA', 'ESP', 'URU'] }),
      (error) => error.code === 'CHAMPION_NOT_SEMIFINALIST'
    );
  } finally {
    competitionRepository.listCompetitionMatches = originalListMatches;
    answerKeyRepository.findSemifinalAnswerKey = originalFind;
    answerKeyRepository.saveAnswerKeyAndScores = originalSave;
  }
});

test('saveFinalAnswerKey requires semifinalists and merges the final fields', async () => {
  const originalFind = answerKeyRepository.findSemifinalAnswerKey;
  const originalSave = answerKeyRepository.saveAnswerKeyAndScores;
  answerKeyRepository.findSemifinalAnswerKey = async () => null;

  try {
    await assert.rejects(
      saveFinalAnswerKey({ championTeamCode: 'BRA', topScorerName: 'Vini', topScorerGoals: 7 }),
      (error) => error.code === 'SEMIFINAL_ANSWER_KEY_REQUIRED'
    );

    let merged;
    answerKeyRepository.findSemifinalAnswerKey = async () => ({
      teamCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
      teams: ['BRA', 'ARG', 'FRA', 'ESP'].map((code) => ({ code, name: code }))
    });
    answerKeyRepository.saveAnswerKeyAndScores = async (answerKey) => {
      merged = answerKey;
      return 3;
    };
    await saveFinalAnswerKey({ championTeamCode: 'BRA', topScorerName: 'Vini', topScorerGoals: 7 });
    assert.equal(merged.champion.code, 'BRA');
    assert.deepEqual(merged.semifinalists.map((team) => team.code), ['BRA', 'ARG', 'FRA', 'ESP']);
  } finally {
    answerKeyRepository.findSemifinalAnswerKey = originalFind;
    answerKeyRepository.saveAnswerKeyAndScores = originalSave;
  }
});

test('saveAnswerKeyAndScores overwrites stale semifinal points on correction', async () => {
  const originalGetConnection = pool.getConnection;
  const awardedPoints = [];
  const rows = [{
    id: 9,
    semi_finalist_1_team_code: 'BRA',
    semi_finalist_2_team_code: 'ARG',
    semi_finalist_3_team_code: 'FRA',
    semi_finalist_4_team_code: 'ESP',
    champion_team_code: 'BRA',
    top_scorer_name: 'Vinicius Junior',
    top_scorer_goals: 7
  }];
  const connection = {
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {},
    query: async (sql, params) => {
      if (sql.includes('FROM competition_extra_predictions')) {
        return [rows];
      }
      if (sql.startsWith('UPDATE competition_extra_predictions')) {
        awardedPoints.push(params[0]);
      }
      return [{}];
    }
  };
  pool.getConnection = async () => connection;
  const answerKey = {
    champion: { code: 'BRA', name: 'BRA' },
    semifinalists: ['BRA', 'ARG', 'FRA', 'ESP'].map((code) => ({ code, name: code })),
    topScorerName: 'Vinicius Junior',
    topScorerGoals: 7
  };

  try {
    await answerKeyRepository.saveAnswerKeyAndScores(answerKey, () => 45);
    await answerKeyRepository.saveAnswerKeyAndScores(answerKey, () => 15);
    assert.deepEqual(awardedPoints, [45, 15]);
  } finally {
    pool.getConnection = originalGetConnection;
  }
});
