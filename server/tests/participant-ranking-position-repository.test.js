const test = require('node:test');
const assert = require('node:assert/strict');

const { pool } = require('../db/pool');
const participantRepository = require('../repositories/participant-repository');

test('updateRankingPositions initializes and advances positions in one transaction', async (t) => {
  const calls = [];
  const connection = {
    beginTransaction: async () => calls.push(['begin']),
    query: async (sql, params) => calls.push(['query', sql, params]),
    commit: async () => calls.push(['commit']),
    rollback: async () => calls.push(['rollback']),
    release: () => calls.push(['release'])
  };
  const originalGetConnection = pool.getConnection;
  pool.getConnection = async () => connection;
  t.after(() => {
    pool.getConnection = originalGetConnection;
  });

  const updatedCount = await participantRepository.updateRankingPositions([
    { id: 1, rank: 1 },
    { id: 2, rank: 2 }
  ]);

  assert.equal(updatedCount, 2);
  assert.equal(calls[0][0], 'begin');
  assert.deepEqual(
    calls.filter(([type]) => type === 'query').map(([, sql, params]) => ({
      sql: sql.replace(/\s+/g, ' ').trim(),
      params
    })),
    [
      {
        sql: 'UPDATE participants SET last_position = CASE WHEN current_position IS NULL THEN ? ELSE current_position END, current_position = ? WHERE id = ? AND is_admin = 0',
        params: [1, 1, 1]
      },
      {
        sql: 'UPDATE participants SET last_position = CASE WHEN current_position IS NULL THEN ? ELSE current_position END, current_position = ? WHERE id = ? AND is_admin = 0',
        params: [2, 2, 2]
      }
    ]
  );
  assert.equal(calls.at(-2)[0], 'commit');
  assert.equal(calls.at(-1)[0], 'release');
  assert.equal(calls.some(([type]) => type === 'rollback'), false);
});

test('updateRankingPositions rolls back every position when one update fails', async (t) => {
  const calls = [];
  let queryCount = 0;
  const connection = {
    beginTransaction: async () => calls.push('begin'),
    query: async () => {
      queryCount += 1;
      calls.push(`query-${queryCount}`);
      if (queryCount === 2) {
        throw new Error('database update failed');
      }
    },
    commit: async () => calls.push('commit'),
    rollback: async () => calls.push('rollback'),
    release: () => calls.push('release')
  };
  const originalGetConnection = pool.getConnection;
  pool.getConnection = async () => connection;
  t.after(() => {
    pool.getConnection = originalGetConnection;
  });

  await assert.rejects(
    participantRepository.updateRankingPositions([
      { id: 1, rank: 1 },
      { id: 2, rank: 2 }
    ]),
    /database update failed/
  );

  assert.deepEqual(calls, ['begin', 'query-1', 'query-2', 'rollback', 'release']);
});
