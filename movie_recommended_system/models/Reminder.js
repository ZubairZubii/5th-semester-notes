const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  reminderTime: { type: Date, required: true }, // When to send the reminder
  isSent: { type: Boolean, default: false },     // Whether the reminder has been sent
});

module.exports = mongoose.model('Reminder', ReminderSchema);