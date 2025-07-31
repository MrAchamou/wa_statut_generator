
const fs = require('fs');
const path = require('path');

class ScenarioEngine {
  constructor() {
    this.scenariosCache = null;
  }

  // Load all scenarios from local files
  async loadAllScenarios() {
    if (this.scenariosCache) {
      return this.scenariosCache;
    }

    const scenariosDir = path.join(__dirname, '../scenarios');
    const scenarios = {};

    try {
      const files = fs.readdirSync(scenariosDir);
      
      for (const file of files) {
        if (file.endsWith('.js')) {
          try {
            const platform = file.replace('.js', '');
            const scenarioPath = path.join(scenariosDir, file);
            scenarios[platform] = require(scenarioPath);
          } catch (error) {
            console.error(`Error loading scenario ${file}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error reading scenarios directory:', error);
    }

    this.scenariosCache = scenarios;
    return scenarios;
  }

  // Get specific scenario
  async getScenario(platform, scenario) {
    const scenarios = await this.loadAllScenarios();
    return scenarios[platform]?.[scenario];
  }

  // Process content with scenario template
  processContent(scenarioData, content) {
    if (!scenarioData || !content) {
      return content;
    }

    let processedTemplate = scenarioData.template || '';
    
    // Replace placeholders in template
    const replacements = {
      '{shop}': content.shopName || 'Votre Boutique',
      '{sector}': content.sector || 'votre secteur',
      '{product}': content.title || 'nos produits',
      '{price}': '29€',
      '{contact}': content.contact || '+33123456789'
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), value);
    }

    return {
      title: content.title || scenarioData.defaultContent?.title || 'Titre',
      message: content.message || processedTemplate,
      cta: content.cta || scenarioData.defaultContent?.cta || 'Action',
      footer: content.shopName || 'Boutique'
    };
  }
}

module.exports = new ScenarioEngine();
