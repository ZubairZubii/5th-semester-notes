const Director = require('../models/Director');

exports.getDirectorDetails = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id)
      .populate('filmography', 'title releaseDate'); 
    
    if (!director) {
      return res.status(404).json({ message: 'Director not found' });
    }
    
    res.status(200).json(director);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
