const Reminder = require('../models/Reminder');
const Movie = require('../models/Movie');
const User = require('../models/User');
const { sendReminderEmail } = require('../utils/emailService');

// Set a reminder for a movie
exports.setReminder = async (req, res) => {
  try {
    const { movieId, reminderTime } = req.body;
    const userId = req.user.id;

  
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

 
    const reminder = new Reminder({
      user: userId,
      movie: movieId,
      reminderTime,
    });

  
    await reminder.save();
    res.status(201).json({ message: 'Reminder set successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error setting reminder', error });
  }
};

// Get upcoming reminders for the logged-in user
exports.getUpcomingReminders = async (req, res) => {
  try {
    const userId = req.user.id; 


    const reminders = await Reminder.find({
      user: userId,
      reminderTime: { $gte: new Date() }, 
      isSent: false, 
    })
      .populate('movie')
      .sort({ reminderTime: 1 }); 

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming reminders', error });
  }
};
