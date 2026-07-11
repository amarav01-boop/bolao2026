const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('admin dashboard renders the complete responsive extra answer key card', async () => {
  const { renderAdminDashboardPage } = await import('../../client/src/pages/admin-page.js');
  const html = renderAdminDashboardPage({
    adminOverview: { summary: {}, phases: [], matches: [], participants: [] },
    adminSession: { username: 'admin' },
    registrationOpen: false,
    adminForms: {
      registrationState: false,
      phase: {},
      match: {},
      semifinalAnswerKey: {
        championTeamCode: 'BRA',
        teamCodes: ['BRA', 'ARG', 'FRA', 'ESP'],
        topScorerName: 'Vinicius Junior',
        topScorerGoals: '0'
      }
    },
    adminMatchFilters: { phaseId: 'all', groupCode: 'all' }
  });

  assert.match(html, /name="championTeamCode"/u);
  assert.equal((html.match(/data-semifinal-index=/gu) || []).length, 4);
  assert.match(html, /name="topScorerName"/u);
  assert.match(html, /name="topScorerGoals"/u);
  assert.match(html, /value="0"/u);

  const css = fs.readFileSync(path.resolve(__dirname, '../../client/src/styles/admin.css'), 'utf8');
  const mobileRules = css.slice(css.indexOf('@media (max-width: 900px)'));
  assert.match(mobileRules, /\.semifinal-answer-key-grid/u);
  assert.match(mobileRules, /grid-template-columns: minmax\(0, 1fr\)/u);
});
