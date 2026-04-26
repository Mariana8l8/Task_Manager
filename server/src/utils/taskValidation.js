import AppError from './AppError.js';

const normalizeOptionalString = (value) => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return '';
  return value;
};

const requireNonEmptyTitle = (title) => {
  const normalizedTitle = typeof title === 'string' ? title.trim() : '';
  if (!normalizedTitle) {
    throw new AppError('Title is required', 400);
  }
  return normalizedTitle;
};

const validateMoveDirection = (direction) => {
  if (direction !== 'up' && direction !== 'down') {
    throw new AppError('direction must be "up" or "down"', 400);
  }
  return direction;
};

export {
  normalizeOptionalString,
  requireNonEmptyTitle,
  validateMoveDirection,
};
