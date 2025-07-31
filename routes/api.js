
const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Get all available effects
router.get('/effects', contentController.getEffects);

// Get effects by type (text or image)
router.get('/effects/:type', contentController.getEffectsByType);

// Get all available scenarios
router.get('/scenarios', contentController.getScenarios);

// Get specific scenario
router.get('/scenarios/:platform', contentController.getScenario);

// Generate content
router.post('/generate', contentController.generateContent);

// Preview content (without effects)
router.post('/preview', contentController.previewContent);

// Get available templates
router.get('/templates', contentController.getTemplates);

module.exports = router;
