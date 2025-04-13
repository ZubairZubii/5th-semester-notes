const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    genres: [String],
    favoriteActors: [String],
  },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', default: [] }],
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
UserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
