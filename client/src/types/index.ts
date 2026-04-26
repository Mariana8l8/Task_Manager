export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  position: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

export type CurrentUserResponse = {
  message: string;
  user: User;
};

export type TaskResponse = {
  message: string;
  task: Task;
};

export type MoveTaskResponse = {
  message: string;
  task: Task;
  swappedTask?: Task;
};

export type TasksResponse = {
  message: string;
  tasks: Task[];
};

export type AdminUsersResponse = {
  message: string;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminUserDetailsResponse = {
  message: string;
  user: User & {
    tasksCount: number;
  };
};

export type AdminStatsResponse = {
  message: string;
  stats: {
    usersCount: number;
    activeUsersCount: number;
    tasksCount: number;
    completedTasksCount: number;
  };
};
