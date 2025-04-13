const express = require('express');
const { setReminder, getUpcomingReminders } = require('../controllers/reminderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();



 
// Route to set a reminder for a movie
router.post('/set',authMiddleware, setReminder);

// Route to get upcoming reminders for the logged-in user
router.get('/upcoming', authMiddleware,getUpcomingReminders);

module.exports = router;
