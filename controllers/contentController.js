const fs = require('fs');
const path = require('path');

// Get all available effects
exports.getEffects = async (req, res) => {
  try {
    const effectsDir = path.join(__dirname, '../effects');
    const textEffectsDir = path.join(effectsDir, 'text');
    const imageEffectsDir = path.join(effectsDir, 'image');

    const effects = {
      text: {},
      image: {}
    };

    // Load text effects
    if (fs.existsSync(textEffectsDir)) {
      const textFiles = fs.readdirSync(textEffectsDir).filter(file => file.endsWith('.js'));
      for (const file of textFiles) {
        const effectName = file.replace('.js', '');
        const effectPath = path.join(textEffectsDir, file);
        try {
          const effectContent = fs.readFileSync(effectPath, 'utf8');
          effects.text[effectName] = {
            name: effectName,
            type: 'text',
            file: file,
            content: effectContent
          };
        } catch (error) {
          console.error(`Error loading text effect ${file}:`, error);
        }
      }
    }

    // Load image effects
    if (fs.existsSync(imageEffectsDir)) {
      const imageFiles = fs.readdirSync(imageEffectsDir).filter(file => file.endsWith('.js'));
      for (const file of imageFiles) {
        const effectName = file.replace('.js', '');
        const effectPath = path.join(imageEffectsDir, file);
        try {
          const effectContent = fs.readFileSync(effectPath, 'utf8');
          effects.image[effectName] = {
            name: effectName,
            type: 'image',
            file: file,
            content: effectContent
          };
        } catch (error) {
          console.error(`Error loading image effect ${file}:`, error);
        }
      }
    }

    res.json({
      success: true,
      data: effects,
      count: {
        text: Object.keys(effects.text).length,
        image: Object.keys(effects.image).length,
        total: Object.keys(effects.text).length + Object.keys(effects.image).length
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

    const effectsDir = path.join(__dirname, '../effects', type);
    const effects = {};

    if (fs.existsSync(effectsDir)) {
      const effectFiles = fs.readdirSync(effectsDir).filter(file => file.endsWith('.js'));
      for (const file of effectFiles) {
        const effectName = file.replace('.js', '');
        const effectPath = path.join(effectsDir, file);
        try {
          const effectContent = fs.readFileSync(effectPath, 'utf8');
          effects[effectName] = {
            name: effectName,
            type: type,
            file: file,
            content: effectContent
          };
        } catch (error) {
          console.error(`Error loading ${type} effect ${file}:`, error);
        }
      }
    }

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
    const scenariosDir = path.join(__dirname, '../scenarios');
    const scenarios = {};

    if (fs.existsSync(scenariosDir)) {
      const scenarioFiles = fs.readdirSync(scenariosDir).filter(file => file.endsWith('.js'));
      for (const file of scenarioFiles) {
        const platform = file.replace('.js', '');
        const scenarioPath = path.join(scenariosDir, file);
        try {
          delete require.cache[require.resolve(scenarioPath)];
          const scenarioData = require(scenarioPath);
          scenarios[platform] = scenarioData;
        } catch (error) {
          console.error(`Error loading scenario ${file}:`, error);
        }
      }
    }

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
    const scenarioPath = path.join(__dirname, '../scenarios', `${platform}.js`);

    if (!fs.existsSync(scenarioPath)) {
      return res.status(404).json({
        success: false,
        error: `Scenario for platform "${platform}" not found`
      });
    }

    delete require.cache[require.resolve(scenarioPath)];
    const scenarioData = require(scenarioPath);

    res.json({
      success: true,
      data: scenarioData,
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
  try {
    const { content, effects, scenario, template } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    // Load template
    const templateName = template || 'basic';
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);

    let htmlTemplate = '<html><body>{{content}}</body></html>';
    if (fs.existsSync(templatePath)) {
      htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    }

    // Process content with effects
    let processedContent = content;

    if (effects && effects.length > 0) {
      // Apply effects logic here
      processedContent = `<div class="effects-container">${content}</div>`;
    }

    // Replace template placeholders
    const finalHtml = htmlTemplate.replace('{{content}}', processedContent);

    res.json({
      success: true,
      data: {
        html: finalHtml,
        content: processedContent,
        effects: effects || [],
        scenario: scenario || null,
        template: templateName
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

    // Load template
    const templateName = template || 'basic';
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);

    let htmlTemplate = '<html><body>{{content}}</body></html>';
    if (fs.existsSync(templatePath)) {
      htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    }

    // Replace template placeholders
    const finalHtml = htmlTemplate.replace('{{content}}', content);

    res.json({
      success: true,
      data: {
        html: finalHtml,
        content: content,
        template: templateName
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