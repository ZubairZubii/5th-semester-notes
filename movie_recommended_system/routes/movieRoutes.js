const express = require('express');
const router = express.Router();
const {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovies,
  getMovieDetails,
  searchMovies,
  filterMovies,
  topMoviesOfTheMonth,
  top10ByGenre
} = require('../controllers/movieController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


// Admin routes
router.post('/add', authMiddleware, adminMiddleware, addMovie);
router.put('/:id', authMiddleware, adminMiddleware, updateMovie);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMovie);

// Public routes
router.get('/', authMiddleware, getMovies);
router.get('/:id', authMiddleware, adminMiddleware, getMovieDetails);

// Updated search and filter routes
router.get('/movies/search', authMiddleware, searchMovies);   
router.get('/movies/filter', authMiddleware, filterMovies);          
router.get('/movies/top-month', authMiddleware, topMoviesOfTheMonth);
router.get('/movies/top-genre', authMiddleware, top10ByGenre);

const { fetchBoxOfficeData } = require('../controllers/box_OfficeController');
const { fetchAwardsData } = require('../controllers/awardsController');

// Box office and awards data
router.get('/boxoffice/:movieId', fetchBoxOfficeData);
router.get('/awards/:movieTitle', fetchAwardsData);
module.exports = router;
