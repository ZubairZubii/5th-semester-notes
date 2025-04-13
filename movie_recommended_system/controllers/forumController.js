// controllers/forumController.js
const ForumThread = require('../models/ForumThread');

const createThread = async (req, res) => {
  try {
    console.log('Decoded User:', req.user); 
    const { title, category, content } = req.body;
    const newThread = new ForumThread({
      title,
      category,
      content,
      createdBy: req.user.id,
    });
    await newThread.save();
    res.status(201).json({ message: 'Thread created successfully', newThread });
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ message: 'Error creating thread' });
  }
};


module.exports = {
  createThread
};
