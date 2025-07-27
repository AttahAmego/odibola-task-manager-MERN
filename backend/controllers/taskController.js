const Task = require('../models/Task');

// @desc Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, deadline } = req.body;

    const task = await Task.create({
      title,
      deadline,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Get All Tasks with Filter, Sort & Search
exports.getTasks = async (req, res) => {
  try {
    const { status, sortBy, search } = req.query;
    const query = { user: req.user.id }; // Always filter by the logged-in user

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let tasksQuery = Task.find(query);

    if (sortBy === 'deadline') {
      tasksQuery = tasksQuery.sort({ deadline: 1 }); // ascending
    } else if (sortBy === 'priority') {
      tasksQuery = tasksQuery.sort({ priority: -1 }); // descending
    } else {
      tasksQuery = tasksQuery.sort({ createdAt: -1 }); // default: most recent first
    }

    const tasks = await tasksQuery;
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the task belongs to the user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// @desc Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the task belongs to the user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

