const fs = require('fs');
const path = require('path');
const effectProcessor = require('../services/effectProcessor');
const scenarioEngine = require('../services/scenarioEngine');

// Get all available effects
exports.getEffects = async (req, res) => {
  console.log('🎨 Getting all effects...');
  try {
    const effects = await effectProcessor.getAllEffects();

    res.json({
      success: true,
      data: effects,
      count: {
        text: Object.keys(effects.text || {}).length,
        image: Object.keys(effects.image || {}).length,
        total: Object.keys(effects.text || {}).length + Object.keys(effects.image || {}).length
      }
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

// Get effects by type
exports.getEffectsByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['text', 'image'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid effect type. Must be "text" or "image"'
      });
    }

    const effects = await effectProcessor.getEffectsByType(type);

    res.json({
      success: true,
      data: effects,
      type: type,
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

// Get all scenarios
exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await scenarioEngine.getAllScenarios();

    res.json({
      success: true,
      data: scenarios,
      platforms: Object.keys(scenarios),
      count: Object.keys(scenarios).length
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

// Get specific scenario
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
      data: scenario,
      platform: platform
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

// Generate content
exports.generateContent = async (req, res) => {
  console.log('⚡ Generating content...', req.body);
  try {
    const { platform, scenario, device, format, mood, content, effects, export: exportOptions } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    // Process scenario
    const processedScenario = await scenarioEngine.processScenario(
      platform || 'whatsapp',
      scenario || 'basic',
      content
    );

    // Convert effects object to array format expected by processor
    const effectsArray = [];
    if (effects) {
      Object.keys(effects).forEach(target => {
        if (effects[target] && effects[target] !== 'none') {
          effectsArray.push({
            name: effects[target],
            type: target === 'logo' ? 'image' : 'text',
            target: `.content-${target}`
          });
        }
      });
    }

    // Generate HTML with effects
    const html = await effectProcessor.generateWithEffects({
      scenario: processedScenario,
      platform: platform || 'whatsapp',
      content: content,
      effects: effectsArray,
      template: 'standard'
    });

    res.json({
      success: true,
      data: {
        html: html,
        content: content,
        effects: effectsArray,
        scenario: processedScenario,
        platform: platform || 'whatsapp'
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

// Preview content
exports.previewContent = async (req, res) => {
  try {
    const { content, template } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const html = await effectProcessor.generatePreview({
      content: content,
      template: template || 'standard'
    });

    res.json({
      success: true,
      data: {
        html: html,
        content: content,
        template: template || 'standard'
      }
    });
  } catch (error) {
    console.error('Error previewing content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to preview content',
      message: error.message
    });
  }
};

// Get templates
exports.getTemplates = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../templates');
    const templates = {};

    if (fs.existsSync(templatesDir)) {
      const templateFiles = fs.readdirSync(templatesDir).filter(file => file.endsWith('.html'));
      for (const file of templateFiles) {
        const templateName = file.replace('.html', '');
        const templatePath = path.join(templatesDir, file);
        try {
          const templateContent = fs.readFileSync(templatePath, 'utf8');
          templates[templateName] = {
            name: templateName,
            file: file,
            content: templateContent
          };
        } catch (error) {
          console.error(`Error loading template ${file}:`, error);
        }
      }
    }

    res.json({
      success: true,
      data: templates,
      count: Object.keys(templates).length
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