import axios from 'axios';
import type {
  AdminStatsResponse,
  AdminUserDetailsResponse,
  AdminUsersResponse,
  AuthResponse,
  CurrentUserResponse,
  MoveTaskResponse,
  TaskResponse,
  TasksResponse,
  UserRole,
} from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (username: string, email: string, password: string, passwordConfirm: string): Promise<AuthResponse> =>
    api.post('/auth/register', { username, email, password, passwordConfirm }).then((res) => res.data),

  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/login', { email, password }).then((res) => res.data),

  me: (): Promise<CurrentUserResponse> =>
    api.get('/auth/me').then((res) => res.data),
};

export const tasksAPI = {
  getTasks: (): Promise<TasksResponse> =>
    api.get('/tasks').then((res) => res.data),

  createTask: (title: string, description: string): Promise<TaskResponse> =>
    api.post('/tasks', { title, description }).then((res) => res.data),

  updateTask: (
    id: string,
    payload: { title?: string; description?: string; isCompleted?: boolean }
  ): Promise<TaskResponse> =>
    api.patch(`/tasks/${id}`, payload).then((res) => res.data),

  moveTask: (id: string, direction: 'up' | 'down'): Promise<MoveTaskResponse> =>
    api.patch(`/tasks/${id}/move`, { direction }).then((res) => res.data),

  deleteTask: (id: string): Promise<{ message: string }> =>
    api.delete(`/tasks/${id}`).then((res) => res.data),
};

export const adminAPI = {
  getUsers: (params: { page?: number; limit?: number; search?: string } = {}): Promise<AdminUsersResponse> =>
    api.get('/admin/users', { params }).then((res) => res.data),

  getUserById: (id: string): Promise<AdminUserDetailsResponse> =>
    api.get(`/admin/users/${id}`).then((res) => res.data),

  updateUserRole: (id: string, role: UserRole): Promise<{ message: string }> =>
    api.patch(`/admin/users/${id}/role`, { role }).then((res) => res.data),

  updateUserStatus: (id: string, isActive: boolean): Promise<{ message: string }> =>
    api.patch(`/admin/users/${id}/status`, { isActive }).then((res) => res.data),

  deleteUser: (id: string): Promise<{ message: string }> =>
    api.delete(`/admin/users/${id}`).then((res) => res.data),

  getStats: (): Promise<AdminStatsResponse> =>
    api.get('/admin/stats').then((res) => res.data),
};

export default api;
