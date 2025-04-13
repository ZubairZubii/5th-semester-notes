// controllers/analyticsController.js
const Movie = require('../models/Movie');

exports.getPopularMovies = async (req, res) => {
  try {
    const popularMovies = await Movie.find().sort({ viewCount: -1 }).limit(10);
    res.status(200).json({ popularMovies });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ message: 'Error fetching popular movies' });
  }
};


// controllers/analyticsController.js
exports.getTrendingGenres = async (req, res) => {
    try {
      const genres = await Movie.aggregate([
        { $group: { _id: '$genre', totalViews: { $sum: '$viewCount' } } },
        { $sort: { totalViews: -1 } },
        { $limit: 5 },
      ]);
      res.status(200).json({ trendingGenres: genres });
    } catch (error) {
      console.error('Error fetching trending genres:', error);
      res.status(500).json({ message: 'Error fetching trending genres' });
    }
  };
  

  const UserActivity = require('../models/UserActivity');

  exports.getUserEngagement = async (req, res) => {
    try {
      const engagement = await UserActivity.aggregate([
        { $match: { action: { $in: ['view', 'comment', 'like'] } } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
      ]);
      res.status(200).json({ userEngagement: engagement });
    } catch (error) {
      console.error('Error fetching user engagement:', error);
      res.status(500).json({ message: 'Error fetching user engagement' });
    }
  };