const axios = require('axios');

const fetchAwardsData = async (req, res) => {
  try {
    const { movieTitle } = req.params; 
    const apiKey = 'adecac69'; // Your OMDb API key
    const omdbBaseUrl = 'http://www.omdbapi.com/';

    // Fetch movie details from OMDb
    const response = await axios.get(omdbBaseUrl, {
      params: {
        t: movieTitle,
        apikey: apiKey,
      },
    });

    if (response.data.Response === 'False') {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    const { Title, Year, Awards, Actors } = response.data;

    // Format the response
    const awardsData = {
      title: Title,
      year: Year,
      awards: Awards,
      actors: Actors,
    };

    res.status(200).json(awardsData);
  } catch (error) {
    console.error('Error fetching awards data:', error);
    res.status(500).json({ message: 'Failed to fetch awards data.', error: error.message });
  }
};

module.exports = { fetchAwardsData };
