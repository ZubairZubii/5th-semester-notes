const Movie = require('../models/Movie');
const User = require('../models/User');
const Review = require('../models/Review');




exports.getSimilarMovies = async (req, res) => {
    try {
      const movieId = req.params.id;
  
      // Find the movie details to use genre and director for similarity
      const movie = await Movie.findById(movieId);
  
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      // Find similar movies based on genre or director
      const similarMovies = await Movie.find({
        _id: { $ne: movieId }, 
        $or: [
          { genre: { $in: movie.genre } },
          { director: movie.director }, 
        ],
      })
        .limit(5)
        .sort({ popularity: -1 });
  
      res.status(200).json(similarMovies);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  

  exports.getTrendingMovies = async (req, res) => {
    try {
      const trendingMovies = await Movie.find().sort({ popularity: -1 }).limit(10); // Top 10 trending movies
      res.status(200).json(trendingMovies);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  
  exports.getTopRatedMovies = async (req, res) => {
    try {
      const topRatedMovies = await Review.aggregate([
        {
          $group: {
            _id: '$movie',
            avgRating: { $avg: '$rating' },
          },
        },
        {
          $sort: { avgRating: -1 },
        },
        { $limit: 10 },
      ]);
  
      // Populate movie details
      const movies = await Movie.find({ _id: { $in: topRatedMovies.map((m) => m._id) } });
  
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  exports.getRecommendationsForUser = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Fetch user details (favorite genres, past ratings, etc.)
      const user = await User.findById(userId).populate('preferences.genres');


      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Fetch movies based on favorite genres
      const genreRecommendations = await Movie.find({
        genre: { $in: user.preferences.genres }, 
      }).sort({ popularity: -1 });
  

      const similarUsers = await User.find({
        _id: { $ne: userId },
        'preferences.genres': { $in: user.preferences.genres }, 
      });
  
      const similarUserRatings = await Review.find({
        user: { $in: similarUsers.map((u) => u._id) },
      })
        .sort({ rating: -1 })
        .populate('movie');
  
      const similarUserMovies = similarUserRatings.map((r) => r.movie);
  
      // Combine and remove duplicates
      const recommendations = [...genreRecommendations, ...similarUserMovies].reduce(
        (acc, movie) => {
          if (!acc.find((m) => m._id.equals(movie._id))) acc.push(movie);
          return acc;
        },
        []
      );
  
      res.status(200).json(recommendations);
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  