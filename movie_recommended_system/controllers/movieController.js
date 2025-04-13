const Movie = require('../models/Movie');

// Add a new movie
exports.addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error adding movie', error });
  }
};

// Update an existing movie
exports.updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error });
  }
};


// Get all movies (Accessible by all authenticated users)
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error });
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    const movieId = req.params.id;
    console.log(`Fetching movie details for ID: ${movieId}`);
    
    const movie = await Movie.findById(movieId)
      .populate('cast', 'name biography')
      .populate('director', 'name biography');

    console.log('Fetched movie:', movie);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.searchMovies = async (req, res) => {
  try {
    // Step 1: Get the query parameter
    const { query } = req.query;
    console.log("Received search query:", query); // Debugging: Log the received query

    // Step 2: Ensure the query is not empty
    if (!query) {
      console.log("Error: Query parameter is missing"); // Debugging: Log if query is empty
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Step 3: Perform the text search using $text operator
    console.log("Performing text search for query:", query); // Debugging: Log search action
    const movies = await Movie.find({ 
      $text: { 
        $search: query 
      }
    });

    // Step 4: Check if any movies were found
    if (movies.length === 0) {
      console.log("No movies found for the query:", query); // Debugging: Log when no movies are found
      return res.status(404).json({ message: "No movies found" });
    }

    // Step 5: Log the result before sending the response
    console.log("Movies found:", movies); // Debugging: Log the found movies

    // Step 6: Send the response
    res.status(200).json(movies);

  } catch (error) {
    // Step 7: Log the error if something goes wrong
    console.error("Error searching movies:", error); // Debugging: Log any error encountered
    res.status(500).json({ message: 'Error searching movies', error: error.message });
  }
};



// Filter movies by rating, popularity, releaseDate, language, decade, country, and keywords
exports.filterMovies = async (req, res) => {
  try {
    const { rating, popularity, releaseYear, language, decade, country, keyword } = req.query;
    
    const filters = {};
    if (rating) filters.rating = { $gte: parseFloat(rating) };
    if (popularity) filters.popularity = { $gte: parseInt(popularity) };
    if (releaseYear) filters.releaseDate = { $regex: new RegExp(`^${releaseYear}`) };
    if (language) filters.language = language;
    if (decade) filters.releaseDate = { $gte: new Date(`${decade}-01-01`), $lt: new Date(`${+decade + 10}-01-01`) };
    if (country) filters.country = country;
    if (keyword) filters.keywords = { $in: [keyword] };

    const movies = await Movie.find(filters);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering movies', error });
  }
};


exports.topMoviesOfTheMonth = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(1);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    const movies = await Movie.find({ releaseDate: { $gte: startDate, $lt: endDate } })
      .sort({ rating: -1 })
      .limit(10);

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving top movies of the month', error });
  }
};


exports.top10ByGenre = async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) {
      return res.status(400).json({ message: 'Genre query parameter is required.' });
    }

    const movies = await Movie.find({ genre: { $in: [genre] } })
      .sort({ rating: -1 })
      .limit(10);

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving top movies by genre', error });
  }
};


