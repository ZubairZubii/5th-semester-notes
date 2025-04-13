const express = require('express');
const {
  createCustomList,
  addToWatchlist,
  addToWishlist,
  followList
} = require('../controllers/listController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/custom', authMiddleware, createCustomList);          // Create a custom list
router.post('/watchlist/:movieId', authMiddleware, addToWatchlist); // Add to watchlist
router.post('/wishlist/:movieId', authMiddleware, addToWishlist);   // Add to wishlist
router.post('/:listId/follow', authMiddleware, followList);


module.exports = router;
