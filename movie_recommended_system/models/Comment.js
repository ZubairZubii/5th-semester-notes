// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumThread', required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  isFlagged: { type: Boolean, default: false },
});

module.exports = mongoose.model('Comment', commentSchema);
