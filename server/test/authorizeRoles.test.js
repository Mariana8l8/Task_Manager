import test from 'node:test';
import assert from 'node:assert/strict';
import authorizeRoles from '../src/middleware/authorizeRoles.js';

test('authorizeRoles allows user with matching role', () => {
  const middleware = authorizeRoles('admin');
  const req = { user: { role: 'admin' } };
  const res = {};

  let nextCalled = false;
  middleware(req, res, (err) => {
    assert.equal(err, undefined);
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});

test('authorizeRoles rejects unauthenticated request', () => {
  const middleware = authorizeRoles('admin');
  const req = {};
  const res = {};

  let errResult;
  middleware(req, res, (err) => {
    errResult = err;
  });

  assert.equal(errResult.statusCode, 401);
  assert.match(errResult.message, /Authentication required/);
});

test('authorizeRoles rejects non-allowed role', () => {
  const middleware = authorizeRoles('admin');
  const req = { user: { role: 'user' } };
  const res = {};

  let errResult;
  middleware(req, res, (err) => {
    errResult = err;
  });

  assert.equal(errResult.statusCode, 403);
  assert.match(errResult.message, /Access denied/);
});
