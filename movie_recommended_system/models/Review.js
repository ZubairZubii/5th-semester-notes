const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true }, // Reference to Movie model
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
  reviewText: { type: String, required: true }, // Review content
  createdAt: { type: Date, default: Date.now }, // Date of review
  comments: [{ type: String }], // Array of comments
  commentCount: { type: Number, default: 0 }, // Count of comments
});

module.exports = mongoose.model('Review', reviewSchema);
 
