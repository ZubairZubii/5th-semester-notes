const express = require('express');

const { addComment } = require('../controllers/commentController');
const { createThread } = require('../controllers/forumController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to create a new thread
router.post('/thread', authMiddleware, createThread); // authMiddleware is used here

// Route to fetch all threads (GET request)
router.get('/thread', async (req, res) => {
    try {
      const threads = await ForumThread.find(); // Fetch all threads
      res.status(200).json(threads);
    } catch (error) {
      console.error('Error fetching threads:', error);
      res.status(500).json({ message: 'Error fetching threads' });
    }
  });

// Route to add a comment to a thread
router.post('/thread/:threadId/comment', authMiddleware,addComment);

module.exports = router;
