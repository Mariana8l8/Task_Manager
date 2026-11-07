import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { adminAPI, authAPI } from '../services/api';
import type { User, UserRole } from '../types/index';
import { clearAuthStorage, getStoredUser, setStoredUser } from '../utils/auth';
import Brand from '../components/Brand';
import '../styles/Admin.css';

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message || fallback;
  }
  return fallback;
};

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState({
    usersCount: 0,
    activeUsersCount: 0,
    tasksCount: 0,
    completedTasksCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [error, setError] = useState('');
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentUser = getStoredUser();

  const loadData = useCallback(async (searchText = '') => {
    setIsLoading(true);
    setError('');

    try {
      const [usersResponse, statsResponse] = await Promise.all([
        adminAPI.getUsers({ page: 1, limit: 50, search: searchText }),
        adminAPI.getStats(),
      ]);
      setUsers(usersResponse.users);
      setStats(statsResponse.stats);
      setIsForbidden(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setIsForbidden(true);
      } else {
        setError(getErrorMessage(err, 'Failed to load admin data'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }

      try {
        const meResponse = await authAPI.me();
        setStoredUser(meResponse.user);

        if (meResponse.user.role !== 'admin') {
          setIsForbidden(true);
          return;
        }

        await loadData('');
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to validate session'));
      }
    };

    init();
  }, [navigate, loadData]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search.trim());
    await loadData(search.trim());
  };

  const handleChangeRole = async (userId: string, role: UserRole) => {
    setActiveUserId(userId);
    setError('');

    try {
      await adminAPI.updateUserRole(userId, role);
      await loadData(query);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update user role'));
    } finally {
      setActiveUserId(null);
    }
  };

  const handleToggleStatus = async (userId: string, nextStatus: boolean) => {
    setActiveUserId(userId);
    setError('');

    try {
      await adminAPI.updateUserStatus(userId, nextStatus);
      await loadData(query);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update user status'));
    } finally {
      setActiveUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Delete this user and all their tasks?')) {
      return;
    }

    setActiveUserId(userId);
    setError('');

    try {
      await adminAPI.deleteUser(userId);
      await loadData(query);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete user'));
    } finally {
      setActiveUserId(null);
    }
  };

  const handleLogout = () => {
    clearAuthStorage();
    navigate('/login');
  };

  if (isForbidden) {
    return (
      <div className="admin-container">
        <div className="admin-forbidden">Access denied. Admin role is required.</div>
      </div>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <div className="topbar-actions">
            <span className="topbar-user">{currentUser?.username}</span>
            <button className="ghost-button" onClick={() => navigate('/tasks')}>Tasks</button>
            <button className="ghost-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="admin-container">
      <div className="admin-header">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Manage users and monitor platform statistics</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Users</h3>
          <strong>{stats.usersCount}</strong>
        </div>
        <div className="admin-stat-card">
          <h3>Active Users</h3>
          <strong>{stats.activeUsersCount}</strong>
        </div>
        <div className="admin-stat-card">
          <h3>Tasks</h3>
          <strong>{stats.tasksCount}</strong>
        </div>
        <div className="admin-stat-card">
          <h3>Completed Tasks</h3>
          <strong>{stats.completedTasksCount}</strong>
        </div>
      </div>

      <form className="admin-search" onSubmit={handleSearchSubmit}>
        <input
          className="field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email"
          aria-label="Search users"
        />
        <button type="submit" className="primary-button">Search</button>
      </form>

      {isLoading ? (
        <div className="loading">Loading admin data...</div>
      ) : (
        <div className="admin-users-card">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = currentUser?.id === user.id;
                const isBusy = activeUserId === user.id;

                return (
                  <tr key={user.id}>
                    <td className="admin-user-name">{user.username}</td>
                    <td className="admin-user-email">{user.email}</td>
                    <td>
                      <select
                        className="field"
                        aria-label={`Role for ${user.username}`}
                        value={user.role}
                        disabled={isBusy || isSelf}
                        onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={user.isActive ? 'status-active' : 'status-blocked'}>
                        {user.isActive ? 'active' : 'blocked'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="ghost-button"
                          disabled={isBusy || isSelf}
                          onClick={() => handleToggleStatus(user.id, !user.isActive)}
                        >
                          {user.isActive ? 'Block' : 'Unblock'}
                        </button>
                        <button
                          className="delete-button"
                          disabled={isBusy || isSelf}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </main>
    </>
  );
};

export default Admin;
