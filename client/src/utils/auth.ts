import type { User } from '../types/index';

const USER_KEY = 'user';

const getStoredUser = (): User | null => {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const setStoredUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem(USER_KEY);
};

export { getStoredUser, setStoredUser, clearAuthStorage };
