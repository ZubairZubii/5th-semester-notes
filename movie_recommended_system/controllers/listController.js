const User = require('../models/User');
const Movie = require('../models/Movie');
const List = require('../models/List'); 

const mongoose = require('mongoose');

exports.createCustomList = async (req, res) => {
  try {
    const { name, isPublic, movies } = req.body;

    // Log incoming data
    console.log("Incoming data:", req.body);


    const movieObjectIds = movies.map(movieId => new mongoose.Types.ObjectId(movieId));

    console.log("Converted movie ObjectIds:", movieObjectIds);

    const newList = await List.create({
      user: req.user.id,
      name,
      isPublic,
      movies: movieObjectIds
    });

    res.status(201).json(newList);
  } catch (error) {
    // Log the error
    console.error("Error creating custom list:", error);
    res.status(500).json({ message: 'Error creating custom list', error: error.message });
  }
};



// Add to Watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.watchlist.includes(req.params.movieId)) {
      user.watchlist.push(req.params.movieId);
      await user.save();
      res.status(200).json({ message: 'Movie added to watchlist' });
    } else {
      res.status(400).json({ message: 'Movie already in watchlist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding to watchlist', error });
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.movieId;

    console.log("User ID:", userId);
    console.log("Movie ID:", movieId);

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure wishlist is an array
    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];  // If it's not an array, initialize it
    }

    // Check if the movie is already in the wishlist
    if (!user.wishlist.includes(movieId)) {
      user.wishlist.push(movieId);
      await user.save();

      res.status(200).json({ message: 'Movie added to wishlist' });
    } else {
      res.status(400).json({ message: 'Movie already in wishlist' });
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};


exports.followList = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    
    if (!list.followers.includes(req.user.id)) {
      list.followers.push(req.user.id);
      await list.save();
      res.status(200).json({ message: 'Following the list' });
    } else {
      res.status(400).json({ message: 'Already following this list' });
    }
  } catch (error) {
    console.error("Error following the list:", error); // Log the error
    res.status(500).json({ message: 'Error following the list', error: error.message });
  }
};
