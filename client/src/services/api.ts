import axios from 'axios';
import type { AuthResponse, TaskResponse, TasksResponse } from '../types/index';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (username: string, email: string, password: string, passwordConfirm: string): Promise<AuthResponse> =>
    api.post('/auth/register', { username, email, password, passwordConfirm }).then((res) => res.data),

  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/login', { email, password }).then((res) => res.data),
};

// Tasks API calls
export const tasksAPI = {
  getTasks: (): Promise<TasksResponse> =>
    api.get('/tasks').then((res) => res.data),

  createTask: (title: string, description: string): Promise<TaskResponse> =>
    api.post('/tasks', { title, description }).then((res) => res.data),

  deleteTask: (id: string): Promise<{ message: string }> =>
    api.delete(`/tasks/${id}`).then((res) => res.data),
};

export default api;
