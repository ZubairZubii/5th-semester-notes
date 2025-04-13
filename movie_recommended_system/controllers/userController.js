const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
      const { genres, favoriteActors } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { preferences: { genres, favoriteActors } } },
        { new: true }
      );
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

  exports.addToWatchlist = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { watchlist: req.params.movieId } },
        { new: true }
      ).populate('watchlist');
      res.status(200).json(user.watchlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
  exports.removeFromWatchlist = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { watchlist: req.params.movieId } },
        { new: true }
      ).populate('watchlist');
      res.status(200).json(user.watchlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  


// Get user watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlist');
    res.status(200).json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};




// Function to add user
exports.addUser = async (req, res) => {
  try {
    const { username, email, password, genres, favoriteActors } = req.body;

    // Create new user
    const user = new User({
      username,
      email,
      password,
      preferences: {
        genres,  // Example: ['Action', 'Comedy']
        favoriteActors,
      }
    });

    // Save user
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user', error });
  }
};
