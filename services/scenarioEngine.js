
const fs = require('fs');
const path = require('path');

class ScenarioEngine {
  constructor() {
    this.scenariosCache = null;
  }

  // Load all scenarios from the scenarios directory
  async getAllScenarios() {
    if (this.scenariosCache) {
      return this.scenariosCache;
    }

    const scenarios = {};

    try {
      const scenariosDir = path.join(__dirname, '../scenarios');
      if (fs.existsSync(scenariosDir)) {
        const scenarioFiles = fs.readdirSync(scenariosDir).filter(file => file.endsWith('.js'));
        
        for (const file of scenarioFiles) {
          const platform = file.replace('.js', '');
          const scenarioPath = path.join(scenariosDir, file);
          delete require.cache[require.resolve(scenarioPath)];
          scenarios[platform] = require(scenarioPath);
        }
      }

      this.scenariosCache = scenarios;
      return scenarios;
    } catch (error) {
      console.error('Error loading scenarios:', error);
      return scenarios;
    }
  }

  // Get scenario by platform
  async getScenarioByPlatform(platform) {
    const allScenarios = await this.getAllScenarios();
    return allScenarios[platform] || null;
  }

  // Get scenario template by platform and type
  async getScenarioTemplate(platform, scenarioType = 'basic') {
    const platformScenarios = await this.getScenarioByPlatform(platform);
    if (!platformScenarios) {
      return null;
    }
    
    return platformScenarios[scenarioType] || null;
  }

  // Process scenario with user content
  async processScenario(platform, scenarioType, userContent) {
    try {
      const scenario = await this.getScenarioTemplate(platform, scenarioType);
      if (!scenario) {
        throw new Error(`Scenario not found: ${platform}/${scenarioType}`);
      }

      // Replace template variables with user content
      let processedContent = { ...scenario.defaultContent };
      
      // Override with user-provided content
      Object.keys(userContent).forEach(key => {
        if (userContent[key]) {
          processedContent[key] = userContent[key];
        }
      });

      // Process template string with content
      let processedTemplate = scenario.template;
      Object.keys(processedContent).forEach(key => {
        const placeholder = `{${key}}`;
        processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), processedContent[key]);
      });

      return {
        platform,
        scenarioType,
        template: processedTemplate,
        content: processedContent,
        elements: scenario.elements
      };
    } catch (error) {
      console.error('Error processing scenario:', error);
      throw error;
    }
  }

  // Get available scenario types for a platform
  async getScenarioTypes(platform) {
    const platformScenarios = await this.getScenarioByPlatform(platform);
    if (!platformScenarios) {
      return [];
    }
    
    return Object.keys(platformScenarios);
  }

  // Clear scenarios cache
  clearCache() {
    this.scenariosCache = null;
  }
}

module.exports = new ScenarioEngine();
