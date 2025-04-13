const axios = require('axios');
const { tmdbApiKey, tmdbBaseUrl } = require('../config/apiConfig');

// Function to fetch Box Office data for a specific movie
const fetchBoxOfficeData = async (req, res) => {
  try {
    const { movieId } = req.params; // Movie ID from TMDb

  
    const response = await axios.get(`${tmdbBaseUrl}/movie/${movieId}`, {
      params: {
        api_key: tmdbApiKey,
        append_to_response: 'releases', 
      },
    });

    const movieData = response.data;

  
    const boxOfficeData = {
      title: movieData.title,
      budget: movieData.budget,
      revenue: movieData.revenue,
      openingWeekendEarnings: null, 
      internationalRevenue: null, 
    };

    // Extract opening weekend earnings if available (example for US region)
    const usRelease = movieData.releases.countries.find(
      (country) => country.iso_3166_1 === 'US'
    );
    if (usRelease && usRelease.certification) {
      // Example logic for extracting opening weekend earnings (requires an external source)
      boxOfficeData.openingWeekendEarnings = `Example value: $50,000,000`;
    }

    // Calculate international revenue if total revenue and US revenue are known
    if (movieData.revenue && boxOfficeData.openingWeekendEarnings) {
      boxOfficeData.internationalRevenue = movieData.revenue - 50000000; 
    }

    res.status(200).json({ boxOfficeData });
  } catch (error) {
    console.error('Error fetching box office data:', error);
    res.status(500).json({ message: 'Failed to fetch box office data.', error: error.message });
  }
};

module.exports = { fetchBoxOfficeData };
