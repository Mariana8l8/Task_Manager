import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../src/models/User.js';
import Task from '../src/models/Task.js';
import { getAdminStats, listUsers } from '../src/controllers/adminController.js';

const createMockRes = () => {
  const state = { statusCode: 200, payload: null };
  const res = {
    status(code) {
      state.statusCode = code;
      return this;
    },
    json(payload) {
      state.payload = payload;
      return this;
    },
  };

  return { res, state };
};

const flushAsync = () => new Promise((resolve) => setImmediate(resolve));

test('getAdminStats returns aggregated counters', async () => {
  const originalUserCount = User.countDocuments;
  const originalTaskCount = Task.countDocuments;

  User.countDocuments = async (query) => (query?.isActive === true ? 4 : 6);
  Task.countDocuments = async (query) => (query?.isCompleted === true ? 7 : 15);

  try {
    const req = { user: { id: 'admin-id', role: 'admin' } };
    const { res, state } = createMockRes();

    getAdminStats(req, res, (err) => {
      throw err;
    });
    await flushAsync();

    assert.equal(state.statusCode, 200);
    assert.equal(state.payload.stats.usersCount, 6);
    assert.equal(state.payload.stats.activeUsersCount, 4);
    assert.equal(state.payload.stats.tasksCount, 15);
    assert.equal(state.payload.stats.completedTasksCount, 7);
  } finally {
    User.countDocuments = originalUserCount;
    Task.countDocuments = originalTaskCount;
  }
});

test('listUsers returns paginated users payload', async () => {
  const originalFind = User.find;
  const originalCount = User.countDocuments;

  const fakeUsers = [
    {
      _id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  User.find = () => ({
    select() { return this; },
    sort() { return this; },
    skip() { return this; },
    limit() { return Promise.resolve(fakeUsers); },
  });
  User.countDocuments = async () => 1;

  try {
    const req = {
      query: { page: '1', limit: '10', search: '' },
      user: { id: 'admin-id', role: 'admin' },
    };
    const { res, state } = createMockRes();

    listUsers(req, res, (err) => {
      throw err;
    });
    await flushAsync();

    assert.equal(state.statusCode, 200);
    assert.equal(state.payload.users.length, 1);
    assert.equal(state.payload.pagination.total, 1);
  } finally {
    User.find = originalFind;
    User.countDocuments = originalCount;
  }
});
