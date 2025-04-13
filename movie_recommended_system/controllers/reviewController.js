const Review = require('../models/Review');
const Movie = require('../models/Movie');
const User = require('../models/User'); 
const mongoose = require('mongoose');  


exports.addReview = async (req, res) => {
  try {
    const { rating, reviewText, movieId } = req.body;


    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }


    if (!movie.reviews) {
      movie.reviews = [];
    }

   
    const newReview = new Review({
      user: req.user.id,
      movie: movieId,
      rating,
      reviewText,
    });

 
    await newReview.save();


    movie.reviews.push(newReview._id);

 
    await movie.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getMovieReviews = async (req, res) => {
  try {
    const movieId = req.params.movieId;

  
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const reviews = await Review.find({ movie: movieId }).populate('user', 'username');

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this movie' });
    }

    const avgRating = await Review.aggregate([
      { $match: { movie: new mongoose.Types.ObjectId(movieId) } },  
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);


    const rating = avgRating[0]?.avgRating || 0;

    res.status(200).json({ reviews, avgRating: rating });
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

  

  exports.updateReview = async (req, res) => {
    try {
      const reviewId = req.params.id;
      const { rating, reviewText } = req.body;
  
   
      const review = await Review.findById(reviewId);
  
     
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      if (review.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit your own reviews' });
      }
  
 
      review.rating = rating || review.rating;
      review.reviewText = reviewText || review.reviewText;
  
      await review.save();
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  
  exports.deleteReview = async (req, res) => {
    try {
      const reviewId = req.params.id;
  
   
      console.log('Review ID:', reviewId);
      console.log('User ID:', req.user.id);
  
     
      const review = await Review.findById(reviewId);

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
    
      if (review.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only delete your own reviews' });
      }
  

      await Review.findByIdAndDelete(reviewId); 
  
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error); 
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

  exports.getTopRatedReviews = async (req, res) => {
    try {
      const movieId = req.params.id;
  
 
      console.log('Movie ID:', movieId);
  
   
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ message: 'Invalid movie ID' });
      }
  

      const reviews = await Review.aggregate([
        { $match: { movie: new mongoose.Types.ObjectId(movieId) } }, 
        { $sort: { rating: -1 } },  
        { $limit: 5 }  
      ]);
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching top rated reviews:', error); 
      res.status(500).json({ message: 'Server error', error });
    }
  };
  



  exports.getMostDiscussedReviews = async (req, res) => {
    try {
      const movieId = req.params.id;
  
    
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ message: 'Invalid movie ID' });
      }
  
      const reviews = await Review.aggregate([
        { $match: { movie: new mongoose.Types.ObjectId(movieId) } },
        { $sort: { commentCount: -1 } },
        { $limit: 5 }, 
      ]);
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching most discussed reviews:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };



  exports.getReviewHighlights = async (req, res) => {
    try {
      const movieId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ message: 'Invalid movie ID' });
      }
  
      // Top-rated reviews
      const topRatedReviews = await Review.aggregate([
        { $match: { movie: new mongoose.Types.ObjectId(movieId) } },
        { $sort: { rating: -1 } },
        { $limit: 3 },
      ]);
  
      // Most-discussed reviews
      const mostDiscussedReviews = await Review.aggregate([
        { $match: { movie: new mongoose.Types.ObjectId(movieId) } },
        { $sort: { commentCount: -1 } },
        { $limit: 3 },
      ]);
  
      res.status(200).json({
        topRatedReviews,
        mostDiscussedReviews,
      });
    } catch (error) {
      console.error('Error fetching review highlights:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  