export type User = {
  id: string;
  username: string;
  email: string;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

export type TaskResponse = {
  message: string;
  task: Task;
};

export type TasksResponse = {
  message: string;
  tasks: Task[];
}
