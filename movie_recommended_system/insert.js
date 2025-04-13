// insertActors.js
require('dotenv').config(); // To load environment variables
const mongoose = require('mongoose');
const Actor = require('./models/Actor'); // Import Actor model

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};


// Execute the functions
connectDB()

