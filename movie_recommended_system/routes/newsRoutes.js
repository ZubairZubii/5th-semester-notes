const express = require('express');
const { fetchNews } = require('../controllers/newsController');
const router = express.Router();

// Route to fetch movie-related news
router.get('/', fetchNews);

module.exports = router;
