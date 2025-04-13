const express = require('express');
const { updateProfile, addToWatchlist, removeFromWatchlist,getWatchlist, addUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add', addUser);

router.put('/profile', authMiddleware, updateProfile);

/**
 * @swagger
 * /api/user/watchlist/{movieId}:
 *   post:
 *     summary: Add movie to user's watchlist
 *     description: Adds a movie to a specific user's watchlist.
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         description: Movie ID to add to the watchlist.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token to authenticate the user.
 *         schema:
 *           type: string
 *           example: Bearer your-token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *             example:
 *               movieId: "123456"
 *               title: "Movie Title"
 *               genre: "Action"
 *               releaseDate: "2024-12-01"
 *     responses:
 *       200:
 *         description: Movie added to watchlist successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Movie added to watchlist successfully."
 *               data:
 *                 movieId: "123456"
 *                 title: "Movie Title"
 *       401:
 *         description: Unauthorized access (invalid token)
 *       400:
 *         description: Bad request (missing fields)
 */
router.post('/watchlist/:movieId', authMiddleware, addToWatchlist);

/**
 * @swagger
 * /api/user/watchlist/{movieId}:
 *   delete:
 *     summary: Remove movie from user's watchlist
 *     description: Removes a movie from a specific user's watchlist.
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         description: Movie ID to remove from the watchlist.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token to authenticate the user.
 *         schema:
 *           type: string
 *           example: Bearer your-token
 *     responses:
 *       200:
 *         description: Movie removed from watchlist successfully
 *       401:
 *         description: Unauthorized access (invalid token)
 *       400:
 *         description: Bad request (movie not found)
 */
router.delete('/watchlist/:movieId', authMiddleware, removeFromWatchlist);




// Fetch user watchlist
router.get('/watchlist', authMiddleware, getWatchlist);

module.exports = router;
