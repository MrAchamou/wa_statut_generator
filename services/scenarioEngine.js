
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
          try {
            delete require.cache[require.resolve(scenarioPath)];
            scenarios[platform] = require(scenarioPath);
          } catch (error) {
            console.error(`Error loading scenario ${file}:`, error);
          }
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
        // Return default scenario if not found
        return {
          platform,
          scenarioType,
          template: 'default',
          content: userContent || {},
          elements: ['title', 'message', 'cta', 'contact']
        };
      }

      // Replace template variables with user content
      let processedContent = { ...scenario.defaultContent };
      
      // Override with user-provided content
      Object.keys(userContent || {}).forEach(key => {
        if (userContent[key]) {
          processedContent[key] = userContent[key];
        }
      });

      // Process template string with content
      let processedTemplate = scenario.template || 'default';
      Object.keys(processedContent).forEach(key => {
        const placeholder = `{${key}}`;
        processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), processedContent[key]);
      });

      return {
        platform,
        scenarioType,
        template: processedTemplate,
        content: processedContent,
        elements: scenario.elements || ['title', 'message', 'cta', 'contact']
      };
    } catch (error) {
      console.error('Error processing scenario:', error);
      // Return fallback scenario
      return {
        platform,
        scenarioType,
        template: 'default',
        content: userContent || {},
        elements: ['title', 'message', 'cta', 'contact']
      };
    }
  }

  // Get available scenario types for a platform
  async getScenarioTypes(platform) {
    const platformScenarios = await this.getScenarioByPlatform(platform);
    if (!platformScenarios) {
      return ['basic'];
    }
    
    return Object.keys(platformScenarios);
  }

  // Clear scenarios cache
  clearCache() {
    this.scenariosCache = null;
  }
}

module.exports = new ScenarioEngine();
