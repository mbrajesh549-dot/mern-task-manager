const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Sabhi routes ko protected banane ke liye middleware lagana
router.use(authMiddleware);

// Endpoints mapping
router.post('/', createTask);       // Create task
router.get('/', getTasks);          // Get all tasks
router.put('/:id', updateTask);     // Update task by ID
router.delete('/:id', deleteTask);  // Delete task by ID

module.exports = router;