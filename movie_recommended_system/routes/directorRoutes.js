const express = require('express');
const { getDirectorDetails } = require('../controllers/directorController');
const router = express.Router();

// Define route to get director details by ID
router.get('/:id', getDirectorDetails);

module.exports = router; // Ensure you're exporting the router here
