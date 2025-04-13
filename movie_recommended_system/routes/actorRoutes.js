// routes/actorRoutes.js
const express = require('express');
const { getActorDetails } = require('../controllers/actorController');
const router = express.Router();

router.get('/:id', getActorDetails);
module.exports = router;
