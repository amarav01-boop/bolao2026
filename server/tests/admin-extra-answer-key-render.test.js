const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('admin dashboard renders independent responsive extra answer key cards', async () => {
  const { renderAdminDashboardPage } = await import('../../client/src/pages/admin-page.js');
  const html = renderAdminDashboardPage({
    adminOverview: { summary: {}, phases: [], matches: [], participants: [] },
    adminSession: { username: 'admin' },
    adminSavedAnswerKey: {
      championTeamCode: 'BRA',
      championTeamName: 'Brasil',
      teamCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
      teams: [
        { code: 'BRA', name: 'Brasil' },
        { code: 'ARG', name: 'Argentina' },
        { code: 'FRA', name: 'Franca' },
        { code: 'ESP', name: 'Espanha' }
      ],
      topScorerName: 'Vinicius Junior',
      topScorerGoals: '0'
    },
    registrationOpen: false,
    adminForms: {
      registrationState: false,
      phase: {},
      match: {},
      semifinalAnswerKey: {
        championTeamCode: 'BRA',
        championTeamName: 'Brasil',
        teamCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
        teams: [
          { code: 'BRA', name: 'Brasil' },
          { code: 'ARG', name: 'Argentina' },
          { code: 'FRA', name: 'Franca' },
          { code: 'ESP', name: 'Espanha' }
        ],
        topScorerName: 'Vinicius Junior',
        topScorerGoals: '0'
      }
    },
    adminMatchFilters: { phaseId: 'all', groupCode: 'all' }
  });

  assert.equal((html.match(/data-admin-semifinal-answer-key-form/gu) || []).length, 1);
  assert.equal((html.match(/data-admin-final-answer-key-form/gu) || []).length, 1);
  assert.match(html, /name="championTeamCode"/u);
  assert.equal((html.match(/data-semifinal-index=/gu) || []).length, 4);
  assert.match(html, /name="topScorerName"/u);
  assert.match(html, /name="topScorerGoals"/u);
  assert.match(html, /<option value="BRA" selected>/u);
  assert.match(html, /<option value="ARG" selected>/u);
  assert.match(html, /value="Vinicius Junior"/u);
  assert.match(html, /value="0"/u);
  assert.match(html, /Salvar semifinalistas/u);
  assert.match(html, /Salvar resultado final/u);

  const css = fs.readFileSync(path.resolve(__dirname, '../../client/src/styles/admin.css'), 'utf8');
  const mobileRules = css.slice(css.indexOf('@media (max-width: 900px)'));
  assert.match(mobileRules, /\.extra-answer-key-cards/u);
  assert.match(mobileRules, /\.semifinal-answer-key-grid/u);
  assert.match(mobileRules, /grid-template-columns: minmax\(0, 1fr\)/u);
});
