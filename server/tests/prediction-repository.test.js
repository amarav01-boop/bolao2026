const test = require('node:test');
const assert = require('node:assert/strict');

const { pool } = require('../db/pool');
const predictionRepository = require('../repositories/prediction-repository');

test('listAllExtraPredictions qualifies joined-table columns', async () => {
  const originalQuery = pool.query;
  let sql = '';
  pool.query = async (statement) => {
    sql = statement;
    return [[]];
  };

  try {
    await predictionRepository.listAllExtraPredictions();
    assert.match(sql, /SELECT\s+extras\.id,/u);
    assert.match(sql, /extras\.created_at,/u);
    assert.match(sql, /extras\.updated_at/u);
    assert.match(sql, /ORDER BY extras\.participant_id ASC, extras\.phase_id ASC/u);
  } finally {
    pool.query = originalQuery;
  }
});
