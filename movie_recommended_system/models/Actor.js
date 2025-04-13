const mongoose = require('mongoose');

const ActorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  biography: { type: String },
  filmography: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  awards: [{ title: String, year: Number }],
});

module.exports = mongoose.model('Actor', ActorSchema);
