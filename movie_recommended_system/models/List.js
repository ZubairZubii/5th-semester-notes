const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Ensure 'followers' is an array

});

module.exports = mongoose.model('List', listSchema);
