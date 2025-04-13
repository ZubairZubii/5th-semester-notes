// controllers/moderationController.js
const ForumThread = require('../models/ForumThread');
const Comment = require('../models/Comment');

// Delete a thread
exports.deleteThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    await ForumThread.findByIdAndDelete(threadId);
    await Comment.deleteMany({ threadId }); 
    res.status(200).json({ message: 'Thread and its comments deleted successfully' });
  } catch (error) {
    console.error('Error deleting thread:', error);
    res.status(500).json({ message: 'Error deleting thread' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};


// controllers/moderationController.js (continued)
exports.closeThread = async (req, res) => {
    try {
      const { threadId } = req.params;
      await ForumThread.findByIdAndUpdate(threadId, { isClosed: true });
      res.status(200).json({ message: 'Thread closed successfully' });
    } catch (error) {
      console.error('Error closing thread:', error);
      res.status(500).json({ message: 'Error closing thread' });
    }
  };
  
