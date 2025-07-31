
const effectProcessor = require('../services/effectProcessor');
const scenarioEngine = require('../services/scenarioEngine');
const fs = require('fs');
const path = require('path');

class ContentController {
  // Get all effects organized by category
  async getEffects(req, res) {
    try {
      const effects = await effectProcessor.loadAllEffects();
      res.json(effects);
    } catch (error) {
      console.error('Error loading effects:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load effects',
        message: error.message
      });
    }
  }

  // Get all scenarios organized by platform
  async getScenarios(req, res) {
    try {
      const scenarios = await scenarioEngine.loadAllScenarios();
      res.json(scenarios);
    } catch (error) {
      console.error('Error loading scenarios:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load scenarios',
        message: error.message
      });
    }
  }

  // Generate content with effects
  async generateContent(req, res) {
    try {
      const {
        platform,
        scenario,
        device,
        format,
        mood,
        content,
        effects,
        export: exportConfig
      } = req.body;

      // Validation
      if (!platform || !scenario || !content) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: platform, scenario, content'
        });
      }

      // Load scenario template
      const scenarioData = await scenarioEngine.getScenario(platform, scenario);
      if (!scenarioData) {
        return res.status(404).json({
          success: false,
          error: `Scenario ${scenario} not found for platform ${platform}`
        });
      }

      // Load template HTML
      const templatePath = path.join(__dirname, '../templates', `${scenario}.html`);
      let htmlTemplate;
      
      try {
        htmlTemplate = fs.readFileSync(templatePath, 'utf8');
      } catch (err) {
        // Fallback to basic template
        htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/basic.html'), 'utf8');
      }

      // Process content with scenario
      const processedContent = scenarioEngine.processContent(scenarioData, content);

      // Generate effect styles
      const effectStyles = await effectProcessor.generateEffectStyles(effects, content);

      // Replace placeholders in HTML
      let finalHtml = htmlTemplate
        .replace(/\{\{title\}\}/g, processedContent.title || 'Titre')
        .replace(/\{\{message\}\}/g, processedContent.message || 'Message')
        .replace(/\{\{cta\}\}/g, processedContent.cta || 'Action')
        .replace(/\{\{footer\}\}/g, processedContent.footer || content.shopName || 'Boutique')
        .replace(/\{\{logo\}\}/g, content.logoBase64 ? 
          `<img src="${content.logoBase64}" alt="Logo" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">` : 
          '<div style="width:80px;height:80px;border-radius:50%;background:#667eea;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;">🚀</div>')
        .replace(/\{\{EFFECT_STYLES\}\}/g, effectStyles.css);

      // Add device and format classes
      finalHtml = finalHtml.replace(
        'class="device-frame"',
        `class="device-frame ${device} format-${format}"`
      );

      // Add mood-based styling
      const moodStyles = this.getMoodStyles(mood);
      finalHtml = finalHtml.replace('</head>', `${moodStyles}</head>`);

      res.json({
        success: true,
        htmlContent: finalHtml,
        message: 'Contenu généré avec succès',
        metadata: {
          platform,
          scenario,
          device,
          format,
          mood,
          effectsApplied: Object.keys(effects).length,
          processingTime: Date.now()
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
  }

  // Get mood-specific styles
  getMoodStyles(mood) {
    const moodMap = {
      sobre: `
        <style>
          .content-layout { filter: brightness(0.9) contrast(1.1); }
          .device-screen { background: linear-gradient(135deg, #2c3e50, #34495e); }
        </style>
      `,
      dynamique: `
        <style>
          .content-layout { filter: brightness(1.2) saturate(1.3); }
          .device-screen { background: linear-gradient(135deg, #e74c3c, #f39c12); }
        </style>
      `,
      flashy: `
        <style>
          .content-layout { filter: brightness(1.3) saturate(1.5) hue-rotate(30deg); }
          .device-screen { background: linear-gradient(135deg, #9b59b6, #e91e63, #ff5722); }
        </style>
      `,
      premium: `
        <style>
          .content-layout { filter: brightness(1.1) contrast(1.2); }
          .device-screen { background: linear-gradient(135deg, #2c3e50, #3498db, #9b59b6); }
        </style>
      `,
      fun: `
        <style>
          .content-layout { filter: brightness(1.2) saturate(1.4) hue-rotate(60deg); }
          .device-screen { background: linear-gradient(135deg, #f39c12, #e74c3c, #9b59b6); }
        </style>
      `
    };

    return moodMap[mood] || moodMap.sobre;
  }
}

module.exports = new ContentController();
