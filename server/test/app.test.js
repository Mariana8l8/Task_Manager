import test from 'node:test';
import assert from 'node:assert/strict';

const request = async (path) => {
  const { default: app } = await import('../src/app.js');
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`);
    return { status: response.status, body: await response.json() };
  } finally {
    server.close();
  }
};

test('health check responds without a database', async () => {
  const { status, body } = await request('/api/health');
  assert.equal(status, 200);
  assert.equal(body.message, 'Server is running');
});

test('API returns 503 instead of crashing when the database is not configured', async () => {
  const saved = { MONGO_URI: process.env.MONGO_URI, MONGODB_URI: process.env.MONGODB_URI };
  delete process.env.MONGO_URI;
  delete process.env.MONGODB_URI;

  try {
    const { status, body } = await request('/api/tasks');
    assert.equal(status, 503);
    assert.equal(body.message, 'Database is unavailable');
  } finally {
    Object.entries(saved).forEach(([key, value]) => {
      if (value !== undefined) process.env[key] = value;
    });
  }
});
