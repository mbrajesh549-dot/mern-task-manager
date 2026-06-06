const Task = require('../models/Task');

// 1. Create a New Task
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required.' });
        }

        const newTask = new Task({
            title,
            description,
            userId: req.userId // Middleware se prapt userId
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating task.', error: error.message });
    }
};

// 2. Get All Tasks for Logged-in User
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching tasks.', error: error.message });
    }
};

// 3. Update Task (Title, Description, Status)
exports.updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Check ownership
        if (task.userId.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized to update this task.' });
        }

        // Update fields if provided
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (status) task.status = status;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating task.', error: error.message });
    }
};

// 4. Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Check ownership
        if (task.userId.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized to delete this task.' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting task.', error: error.message });
    }
};