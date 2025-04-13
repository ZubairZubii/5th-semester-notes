const express = require('express');
const { deleteThread, deleteComment, closeThread } = require('../controllers/moderationController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to delete a thread
router.delete('/thread/:threadId',authMiddleware, deleteThread);

// Route to delete a comment
router.delete('/comment/:commentId', authMiddleware,deleteComment);

// Route to close a thread
router.patch('/thread/:threadId/close',authMiddleware, closeThread);

module.exports = router;
