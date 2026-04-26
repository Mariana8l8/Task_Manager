import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeOptionalString,
  requireNonEmptyTitle,
  validateMoveDirection,
} from '../src/utils/taskValidation.js';

test('requireNonEmptyTitle trims and accepts non-empty title', () => {
  const result = requireNonEmptyTitle('  Buy milk  ');
  assert.equal(result, 'Buy milk');
});

test('requireNonEmptyTitle throws on empty title', () => {
  assert.throws(() => requireNonEmptyTitle('   '), /Title is required/);
});

test('normalizeOptionalString preserves undefined', () => {
  assert.equal(normalizeOptionalString(undefined), undefined);
});

test('normalizeOptionalString returns empty string for non-string values', () => {
  assert.equal(normalizeOptionalString(123), '');
});

test('validateMoveDirection accepts up and down', () => {
  assert.equal(validateMoveDirection('up'), 'up');
  assert.equal(validateMoveDirection('down'), 'down');
});

test('validateMoveDirection throws for invalid direction', () => {
  assert.throws(() => validateMoveDirection('left'), /direction must be \"up\" or \"down\"/);
});
