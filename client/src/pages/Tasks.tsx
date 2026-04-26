import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authAPI, tasksAPI } from '../services/api';
import type { Task } from '../types/index';
import { clearAuthStorage, getStoredUser, setStoredUser } from '../utils/auth';
import '../styles/Tasks.css';

type TaskFilter = 'all' | 'active' | 'completed';
type TaskSort = 'position' | 'newest' | 'oldest' | 'title';

const sortTasksByPosition = (tasks: Task[]) =>
  [...tasks].sort((a, b) => a.position - b.position);

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message || fallback;
  }
  return fallback;
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<TaskSort>('position');
  const [error, setError] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();

  useEffect(() => {
    const initializePage = async () => {
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }

      try {
        const meResponse = await authAPI.me();
        setStoredUser(meResponse.user);
        setCurrentUserRole(meResponse.user.role);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to validate session'));
        return;
      }

      fetchTasks();
    };

    initializePage();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setIsLoadingTasks(true);
      const response = await tasksAPI.getTasks();
      setTasks(sortTasksByPosition(response.tasks));
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const visibleTasks = useMemo(() => {
    let result = [...tasks];

    if (filter === 'active') {
      result = result.filter((task) => !task.isCompleted);
    } else if (filter === 'completed') {
      result = result.filter((task) => task.isCompleted);
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (normalizedQuery) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(normalizedQuery)
        || task.description.toLowerCase().includes(normalizedQuery)
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result = sortTasksByPosition(result);
    }

    return result;
  }, [tasks, filter, searchQuery, sortBy]);

  const canReorderInView = filter === 'all' && !searchQuery.trim() && sortBy === 'position';

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await tasksAPI.createTask(title, description);
      setTasks((prevTasks) => sortTasksByPosition([...prevTasks, response.task]));
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create task'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setError('');
    setActiveTaskId(task._id);

    try {
      const response = await tasksAPI.updateTask(task._id, {
        isCompleted: !task.isCompleted,
      });
      setTasks((prevTasks) =>
        sortTasksByPosition(
          prevTasks.map((item) => (item._id === task._id ? response.task : item))
        )
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update task status'));
    } finally {
      setActiveTaskId(null);
    }
  };

  const handleMoveTask = async (id: string, direction: 'up' | 'down') => {
    if (!canReorderInView) {
      setError('Reorder works only in default view: All + no search + Position sort');
      return;
    }

    setError('');
    setActiveTaskId(id);

    try {
      const response = await tasksAPI.moveTask(id, direction);
      setTasks((prevTasks) =>
        sortTasksByPosition(
          prevTasks.map((task) => {
            if (task._id === response.task._id) return response.task;
            if (response.swappedTask && task._id === response.swappedTask._id) return response.swappedTask;
            return task;
          })
        )
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to reorder task'));
    } finally {
      setActiveTaskId(null);
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }

    setError('');
    setActiveTaskId(id);

    try {
      const response = await tasksAPI.updateTask(id, {
        title: editTitle.trim(),
        description: editDescription,
      });

      setTasks((prevTasks) =>
        sortTasksByPosition(
          prevTasks.map((task) => (task._id === id ? response.task : task))
        )
      );
      handleCancelEdit();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to edit task'));
    } finally {
      setActiveTaskId(null);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setActiveTaskId(id);
      try {
        await tasksAPI.deleteTask(id);
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to delete task'));
      } finally {
        setActiveTaskId(null);
      }
    }
  };

  const isTaskBusy = (taskId: string) => activeTaskId === taskId;

  const renderTaskContent = (task: Task) => {
    if (editingTaskId === task._id) {
      return (
        <div className="task-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="task-input"
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="task-textarea"
            rows={3}
            placeholder="Task description"
          />
          <div className="task-edit-actions">
            <button
              onClick={() => handleSaveEdit(task._id)}
              className="secondary-button"
              disabled={isTaskBusy(task._id)}
            >
              Save
            </button>
            <button onClick={handleCancelEdit} className="ghost-button" disabled={isTaskBusy(task._id)}>
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <h3 className={`task-title ${task.isCompleted ? 'task-title-completed' : ''}`}>{task.title}</h3>
        {task.description && (
          <p className={`task-description ${task.isCompleted ? 'task-description-completed' : ''}`}>
            {task.description}
          </p>
        )}
        <small className="task-date">{new Date(task.createdAt).toLocaleDateString()}</small>
      </>
    );
  };

  const handleLogout = () => {
    clearAuthStorage();
    navigate('/login');
  };

  const currentUser = getStoredUser();

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p className="tasks-subtitle">Welcome, {currentUser?.username || 'user'}</p>
        </div>
        <div className="tasks-header-actions">
          {currentUserRole === 'admin' && (
            <button onClick={() => navigate('/admin')} className="secondary-button">
              Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAddTask} className="add-task-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="task-input"
          />
        </div>

        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            className="task-textarea"
            rows={3}
          />
        </div>

        <button type="submit" disabled={isLoading} className="add-button">
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <div className="tasks-controls">
        <div className="tasks-filter-group" role="group" aria-label="Task filter">
          <button
            className={`ghost-button ${filter === 'all' ? 'is-selected' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`ghost-button ${filter === 'active' ? 'is-selected' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`ghost-button ${filter === 'completed' ? 'is-selected' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <input
          className="tasks-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
        />

        <select
          className="tasks-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as TaskSort)}
        >
          <option value="position">Position</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      {!canReorderInView && (
        <div className="tasks-hint">Reorder is available in default view: All + no search + Position sort.</div>
      )}

      {isLoadingTasks ? (
        <div className="loading">Loading tasks...</div>
      ) : visibleTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found for current filters.</p>
        </div>
      ) : (
        <div className="tasks-list">
          {visibleTasks.map((task, index) => {
            const isFirst = index === 0;
            const isLast = index === visibleTasks.length - 1;

            return (
              <div key={task._id} className={`task-card ${task.isCompleted ? 'task-card-completed' : ''}`}>
                <div className="task-main">
                  <label className="task-check">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      disabled={isTaskBusy(task._id)}
                      onChange={() => handleToggleComplete(task)}
                    />
                  </label>
                  <div className="task-content">{renderTaskContent(task)}</div>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleMoveTask(task._id, 'up')}
                    className="ghost-button"
                    disabled={isTaskBusy(task._id) || isFirst || !canReorderInView}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveTask(task._id, 'down')}
                    className="ghost-button"
                    disabled={isTaskBusy(task._id) || isLast || !canReorderInView}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleStartEdit(task)}
                    className="secondary-button"
                    disabled={isTaskBusy(task._id) || editingTaskId === task._id}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="delete-button"
                    disabled={isTaskBusy(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tasks;
