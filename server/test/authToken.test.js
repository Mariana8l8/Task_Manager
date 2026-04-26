import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { createAuthToken } from '../src/utils/authToken.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_for_jwt';

test('createAuthToken includes userId and role claims', () => {
  const token = createAuthToken({ userId: '123456789012345678901234', role: 'admin' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  assert.equal(decoded.userId, '123456789012345678901234');
  assert.equal(decoded.role, 'admin');
});
