const express = require('express');
const router = express.Router();

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getStats
} = require('../controllers/taskController');


router.get('/stats', getStats);
router.route('/').get(getAllTasks).post(createTask);


router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);
module.exports=router;