
const fs = require('fs');
const path = require('path');
const effectProcessor = require('../services/effectProcessor');
const scenarioEngine = require('../services/scenarioEngine');

// Get all available effects
exports.getEffects = async (req, res) => {
  try {
    const effects = await effectProcessor.getAllEffects();
    res.json({
      success: true,
      data: effects,
      count: Object.keys(effects.text || {}).length + Object.keys(effects.image || {}).length
    });
  } catch (error) {
    console.error('Error getting effects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load effects',
      message: error.message
    });
  }
};

// Get effects by type (text or image)
exports.getEffectsByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['text', 'image'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid effect type. Use "text" or "image"'
      });
    }

    const effects = await effectProcessor.getEffectsByType(type);
    res.json({
      success: true,
      type: type,
      data: effects,
      count: Object.keys(effects).length
    });
  } catch (error) {
    console.error('Error getting effects by type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load effects by type',
      message: error.message
    });
  }
};

// Get all available scenarios
exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await scenarioEngine.getAllScenarios();
    res.json({
      success: true,
      data: scenarios,
      platforms: Object.keys(scenarios)
    });
  } catch (error) {
    console.error('Error getting scenarios:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load scenarios',
      message: error.message
    });
  }
};

// Get specific scenario by platform
exports.getScenario = async (req, res) => {
  try {
    const { platform } = req.params;
    const scenario = await scenarioEngine.getScenarioByPlatform(platform);
    
    if (!scenario) {
      return res.status(404).json({
        success: false,
        error: `Scenario for platform "${platform}" not found`
      });
    }

    res.json({
      success: true,
      platform: platform,
      data: scenario
    });
  } catch (error) {
    console.error('Error getting scenario:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load scenario',
      message: error.message
    });
  }
};

// Generate content with effects
exports.generateContent = async (req, res) => {
  try {
    const { 
      scenario, 
      platform, 
      content, 
      effects = [], 
      template = 'basic' 
    } = req.body;

    // Validate required fields
    if (!content || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: content and platform'
      });
    }

    // Generate the HTML content
    const generatedHtml = await effectProcessor.generateWithEffects({
      scenario,
      platform,
      content,
      effects,
      template
    });

    res.json({
      success: true,
      data: {
        html: generatedHtml,
        platform: platform,
        effects: effects,
        template: template
      }
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content',
      message: error.message
    });
  }
};

// Preview content without effects
exports.previewContent = async (req, res) => {
  try {
    const { content, template = 'basic' } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: content'
      });
    }

    const previewHtml = await effectProcessor.generatePreview({
      content,
      template
    });

    res.json({
      success: true,
      data: {
        html: previewHtml,
        template: template
      }
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate preview',
      message: error.message
    });
  }
};

// Get available templates
exports.getTemplates = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../templates');
    const templateFiles = fs.readdirSync(templatesDir)
      .filter(file => file.endsWith('.html'))
      .map(file => file.replace('.html', ''));

    const templates = {};
    for (const templateName of templateFiles) {
      const templatePath = path.join(templatesDir, `${templateName}.html`);
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      templates[templateName] = {
        name: templateName,
        content: templateContent
      };
    }

    res.json({
      success: true,
      data: templates,
      available: templateFiles
    });
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load templates',
      message: error.message
    });
  }
};
