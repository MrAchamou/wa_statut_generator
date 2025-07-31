
const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Effects endpoint
router.get('/effects', contentController.getEffects);

// Scenarios endpoint
router.get('/scenarios', contentController.getScenarios);

// Generation endpoint
router.post('/generate', contentController.generateContent);

module.exports = router;
