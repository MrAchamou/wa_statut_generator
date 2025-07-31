
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
      total: Object.keys(effects.text).length + Object.keys(effects.image).length
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
      const files = fs.readdirSync(effectsDir).filter(file => file.endsWith('.js'));
      for (const file of files) {
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
      total: Object.keys(effects).length
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
    const scenariosDir = path.join(__dirname, '../scenarios');
    const scenarios = {};

    if (fs.existsSync(scenariosDir)) {
      const files = fs.readdirSync(scenariosDir).filter(file => file.endsWith('.js'));
      for (const file of files) {
        const platform = file.replace('.js', '');
        const scenarioPath = path.join(scenariosDir, file);
        try {
          delete require.cache[require.resolve(scenarioPath)];
          const scenarioModule = require(scenarioPath);
          scenarios[platform] = scenarioModule;
        } catch (error) {
          console.error(`Error loading scenario ${file}:`, error);
        }
      }
    }

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
    const scenario = require(scenarioPath);

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
  try {
    const { platform, scenario, content, effects, device, format, mood } = req.body;

    if (!platform || !scenario || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: platform, scenario, content'
      });
    }

    // Load the appropriate template
    const templatePath = path.join(__dirname, '../templates', `${scenario}.html`);
    let template = '';

    if (fs.existsSync(templatePath)) {
      template = fs.readFileSync(templatePath, 'utf8');
    } else {
      // Fallback to basic template
      const basicTemplatePath = path.join(__dirname, '../templates', 'basic.html');
      if (fs.existsSync(basicTemplatePath)) {
        template = fs.readFileSync(basicTemplatePath, 'utf8');
      } else {
        return res.status(500).json({
          success: false,
          error: 'No template found'
        });
      }
    }

    // Replace placeholders in template
    let html = template;
    Object.keys(content).forEach(key => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), content[key] || '');
    });

    // Add effects if specified
    let effectsCSS = '';
    if (effects) {
      Object.keys(effects).forEach(elementType => {
        const effectName = effects[elementType];
        if (effectName) {
          // Add effect class to the element
          const elementClass = `.content-${elementType}`;
          html = html.replace(
            new RegExp(`class="([^"]*content-${elementType}[^"]*)"`, 'g'),
            `class="$1 effect-${effectName}"`
          );
          
          // Load effect CSS
          const textEffectPath = path.join(__dirname, '../effects/text', `${effectName}.js`);
          const imageEffectPath = path.join(__dirname, '../effects/image', `${effectName}.js`);
          
          if (fs.existsSync(textEffectPath)) {
            const effectContent = fs.readFileSync(textEffectPath, 'utf8');
            effectsCSS += `\n/* ${effectName} text effect */\n${effectContent}\n`;
          } else if (fs.existsSync(imageEffectPath)) {
            const effectContent = fs.readFileSync(imageEffectPath, 'utf8');
            effectsCSS += `\n/* ${effectName} image effect */\n${effectContent}\n`;
          }
        }
      });
    }

    // Inject effects CSS into the HTML
    if (effectsCSS) {
      html = html.replace('</head>', `<style>${effectsCSS}</style>\n</head>`);
    }

    res.json({
      success: true,
      data: {
        html: html,
        platform: platform,
        scenario: scenario,
        effects: effects,
        device: device,
        format: format,
        mood: mood
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

// Preview content (without effects)
exports.previewContent = async (req, res) => {
  try {
    const { platform, scenario, content } = req.body;

    if (!platform || !scenario || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: platform, scenario, content'
      });
    }

    // Load template
    const templatePath = path.join(__dirname, '../templates', `${scenario}.html`);
    let template = '';

    if (fs.existsSync(templatePath)) {
      template = fs.readFileSync(templatePath, 'utf8');
    } else {
      const basicTemplatePath = path.join(__dirname, '../templates', 'basic.html');
      if (fs.existsSync(basicTemplatePath)) {
        template = fs.readFileSync(basicTemplatePath, 'utf8');
      } else {
        return res.status(500).json({
          success: false,
          error: 'No template found'
        });
      }
    }

    // Replace placeholders
    let html = template;
    Object.keys(content).forEach(key => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), content[key] || '');
    });

    res.json({
      success: true,
      data: {
        html: html,
        platform: platform,
        scenario: scenario
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
