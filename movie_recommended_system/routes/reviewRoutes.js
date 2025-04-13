const express = require('express');
const { addReview, getMovieReviews, updateReview, deleteReview, getTopRatedReviews , getMostDiscussedReviews, getReviewHighlights} = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure user is authenticated
const router = express.Router();

// Add a new review
router.post('/add', authMiddleware, addReview);

// Get all reviews for a movie
router.get('/:movieId', getMovieReviews);

// Update a review
router.put('/:id', authMiddleware, updateReview);

// Delete a review
router.delete('/:id', authMiddleware, deleteReview);


router.get('/top-rated/:id', authMiddleware, getTopRatedReviews);

router.get('/most-discussed/:id', authMiddleware, getMostDiscussedReviews);
router.get('/review-highlights/:id', authMiddleware, getReviewHighlights);

module.exports = router;
