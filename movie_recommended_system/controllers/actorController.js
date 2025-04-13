const Actor = require('../models/Actor');

exports.getActorDetails = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id).populate('filmography', 'title releaseDate');
    res.status(200).json(actor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
