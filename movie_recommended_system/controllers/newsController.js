const axios = require('axios');
const { newsApiKey, newsApiUrl } = require('../config/apiConfig');

const fetchNews = async (req, res) => {
  try {


   let newsApiKey= "7ef6d75a61684f11b4099a581b88038e";
    let newsApiUrl= 'https://newsapi.org/v2/everything'; 

    const { query = 'movie' } = req.query;  
    const url = `${newsApiUrl}?q=${encodeURIComponent(query)}&apiKey=${newsApiKey}&sortBy=publishedAt&pageSize=5`;

    const response = await axios.get(url); 
    const articles = response.data.articles;

    if (!articles || !articles.length) {
      return res.status(404).json({ message: 'No news articles found.' });
    }

    res.status(200).json({ articles });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ message: 'Failed to fetch news articles.', error: err.message });
  }
};

module.exports = { fetchNews };
