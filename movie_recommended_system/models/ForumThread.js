// models/ForumThread.js
const mongoose = require('mongoose');

const forumThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Genre', 'Actor', 'Movie'
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User reference
  createdAt: { type: Date, default: Date.now },
  isClosed: { type: Boolean, default: false },
});

module.exports = mongoose.model('ForumThread', forumThreadSchema);
