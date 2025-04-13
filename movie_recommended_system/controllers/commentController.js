// controllers/commentController.js
const Comment = require('../models/Comment');

const addComment = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;
    const newComment = new Comment({
      threadId,
      content,
      createdBy: req.user.id, 
    });
    await newComment.save();
    res.status(201).json({ message: 'Comment added successfully', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

module.exports = {
  addComment,
};

