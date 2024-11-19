const express = require('express');
const { protect } = require('../controllers/userController.js')
const { createTask, getTasks, deleteTask, editTask } = require('../controllers/taskController.js')
const router = express.Router();

router.post('/createTask', protect, createTask);
router.get('/getTasks', getTasks);
router.delete('/deleteTask/:id', protect, deleteTask);
router.put('/editTask/:id', protect, editTask);

module.exports = router;