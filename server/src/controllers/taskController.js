import Task from '../models/Task.js';

const getTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    // Validation
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = new Task({
      title,
      description: description || '',
      userId,
    });

    await newTask.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task belongs to user
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getTasks, createTask, deleteTask };
