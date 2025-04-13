const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],
  cast: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
  director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
  viewCount: { type: Number, default: 0 },
  releaseDate: { type: Date },
  runtime: { type: Number },
  synopsis: { type: String },
  language: { type: String },
  country: { type: String },
  keywords: [String],
  popularity: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 10 },
  additionalInfo: {
    trivia: [String],
    goofs: [String],
    soundtrack: [String],
  },
  ageRatings: { type: String },
});

// Add text index for search functionality
MovieSchema.index({ title: 'text', genre: 'text', language: 'text', keywords: 'text' });

module.exports = mongoose.model('Movie', MovieSchema);
