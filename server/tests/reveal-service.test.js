const test = require('node:test');
const assert = require('node:assert/strict');

const { buildRevealExtras, getRevealState, mergePredictions } = require('../services/reveal-service');
const competitionRepository = require('../repositories/competition-repository');
const participantService = require('../services/participant-service');
const semifinalAnswerKeyService = require('../services/semifinal-answer-key-service');

test('buildRevealExtras exposes all participant extra predictions as read-only data', () => {
  const extras = buildRevealExtras({
    championTeamCode: 'BRA',
    championTeamName: 'Brasil',
    topScorerName: 'Vinicius Junior',
    topScorerGoals: 7,
    semiFinalist1Code: 'BRA',
    semiFinalist1Name: 'Brasil',
    semiFinalist2Code: 'FRA',
    semiFinalist2Name: 'França',
    semiFinalist3Code: 'ARG',
    semiFinalist3Name: 'Argentina',
    semiFinalist4Code: 'ESP',
    semiFinalist4Name: 'Espanha',
    pointsAwarded: 45
  }, {
    championTeamCode: 'BRA',
    championTeamName: 'Brasil',
    teams: [
      { code: 'BRA', name: 'Brasil' },
      { code: 'FRA', name: 'Franca' },
      { code: 'ARG', name: 'Argentina' },
      { code: 'ESP', name: 'Espanha' }
    ],
    teamCodes: ['BRA', 'FRA', 'ARG', 'ESP'],
    topScorerName: 'Vinicius Junior',
    topScorerGoals: 7
  });

  assert.equal(extras.champion.name, 'Brasil');
  assert.deepEqual(
    extras.semiFinalists.map((team) => team.name),
    ['Brasil', 'França', 'Argentina', 'Espanha']
  );
  assert.equal(extras.topScorer.name, 'Vinicius Junior');
  assert.equal(extras.topScorer.goals, 7);
  assert.equal(extras.pointsAwarded, 45);
  assert.equal(extras.scoring.totalPoints, 45);
  assert.equal(extras.scoring.categories.champion.answer.name, 'Brasil');
});

test('buildRevealExtras marks only semifinalists as calculated when final key is absent', () => {
  const extras = buildRevealExtras({
    championTeamCode: 'BRA',
    championTeamName: 'Brasil',
    topScorerName: 'Vinicius Junior',
    topScorerGoals: 7,
    semiFinalist1Code: 'BRA',
    semiFinalist1Name: 'Brasil',
    semiFinalist2Code: 'FRA',
    semiFinalist2Name: 'Franca',
    semiFinalist3Code: 'ARG',
    semiFinalist3Name: 'Argentina',
    semiFinalist4Code: 'ESP',
    semiFinalist4Name: 'Espanha',
    pointsAwarded: 20
  }, {
    championTeamCode: null,
    championTeamName: null,
    teams: [
      { code: 'BRA', name: 'Brasil' },
      { code: 'FRA', name: 'Franca' },
      { code: 'ARG', name: 'Argentina' },
      { code: 'ESP', name: 'Espanha' }
    ],
    teamCodes: ['BRA', 'FRA', 'ARG', 'ESP'],
    topScorerName: null,
    topScorerGoals: null
  });

  assert.deepEqual(extras.scoring.calculatedCategories, ['semifinalists']);
  assert.equal(extras.scoring.categories.semifinalists.points, 20);
  assert.equal(extras.scoring.categories.champion.calculated, false);
  assert.equal(extras.scoring.categories.topScorer.calculated, false);
  assert.equal(extras.scoring.categories.topScorerGoals.calculated, false);
  assert.equal(extras.scoring.categories.champion.answer, null);
});

test('buildRevealExtras renders official semifinal answer from team codes when teams are absent', () => {
  const extras = buildRevealExtras({
    semiFinalist1Code: 'BRA',
    semiFinalist2Code: 'ARG',
    semiFinalist3Code: 'FRA',
    semiFinalist4Code: 'ESP',
    pointsAwarded: 20
  }, {
    teamCodes: ['BRA', 'ARG', 'FRA', 'ESP']
  });

  assert.equal(extras.scoring.categories.semifinalists.calculated, true);
  assert.deepEqual(
    extras.scoring.categories.semifinalists.answer.map((team) => team.name),
    ['BRA', 'ARG', 'FRA', 'ESP']
  );
});

test('buildRevealExtras returns null when the participant has no extra prediction row', () => {
  assert.equal(buildRevealExtras(null), null);
});

test('getRevealState does not load official extra key before reveal is enabled', async () => {
  const originalGetSessionParticipant = participantService.getSessionParticipant;
  const originalListPublicParticipants = participantService.listPublicParticipants;
  const originalListCompetitionPhases = competitionRepository.listCompetitionPhases;
  const originalGetSemifinalAnswerKey = semifinalAnswerKeyService.getSemifinalAnswerKey;
  let answerKeyLoaded = false;

  participantService.getSessionParticipant = () => ({ id: 1 });
  participantService.listPublicParticipants = async () => [{ id: 1, nickname: 'Vitor' }];
  competitionRepository.listCompetitionPhases = async () => [{ id: 1, revealEnabled: false }];
  semifinalAnswerKeyService.getSemifinalAnswerKey = async () => {
    answerKeyLoaded = true;
    return null;
  };

  try {
    const state = await getRevealState({}, '');
    assert.equal(state.state, 'unrevealed');
    assert.equal(answerKeyLoaded, false);
  } finally {
    participantService.getSessionParticipant = originalGetSessionParticipant;
    participantService.listPublicParticipants = originalListPublicParticipants;
    competitionRepository.listCompetitionPhases = originalListCompetitionPhases;
    semifinalAnswerKeyService.getSemifinalAnswerKey = originalGetSemifinalAnswerKey;
  }
});

test('mergePredictions keeps explicit predictions distinct from defaulted missing rows', () => {
  const rows = mergePredictions(
    [
      { id: 10, phaseId: 1, groupCode: 'A', matchCode: 'a1', matchOrder: 1, homeTeamName: 'Brasil', awayTeamName: 'Japão' },
      { id: 11, phaseId: 1, groupCode: 'A', matchCode: 'a2', matchOrder: 2, homeTeamName: 'França', awayTeamName: 'EUA' }
    ],
    [
      { matchId: 10, predictedHomeScore: 2, predictedAwayScore: 1, isDefaulted: false, pointsAwarded: null }
    ]
  );

  assert.equal(rows[0].predictionHomeScore, 2);
  assert.equal(rows[0].predictionAwayScore, 1);
  assert.equal(rows[0].predictionIsDefaulted, false);
  assert.equal(rows[1].predictionHomeScore, 0);
  assert.equal(rows[1].predictionAwayScore, 0);
  assert.equal(rows[1].predictionIsDefaulted, true);
});
