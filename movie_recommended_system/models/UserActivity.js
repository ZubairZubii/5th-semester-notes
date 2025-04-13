// models/UserActivity.js
const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'view', 'comment', 'like'
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the movie, genre, or other target
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserActivity', userActivitySchema);
