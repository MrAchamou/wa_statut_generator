
const fs = require('fs');
const path = require('path');

class EffectProcessor {
  constructor() {
    this.effectsCache = null;
  }

  // Load all effects from the effects directory
  async getAllEffects() {
    if (this.effectsCache) {
      return this.effectsCache;
    }

    const effects = {
      text: {},
      image: {}
    };

    try {
      // Load text effects
      const textEffectsDir = path.join(__dirname, '../effects/text');
      if (fs.existsSync(textEffectsDir)) {
        const textFiles = fs.readdirSync(textEffectsDir).filter(file => file.endsWith('.js'));
        for (const file of textFiles) {
          const effectName = file.replace('.js', '');
          const effectPath = path.join(textEffectsDir, file);
          try {
            delete require.cache[require.resolve(effectPath)];
            effects.text[effectName] = require(effectPath);
          } catch (error) {
            console.error(`Error loading text effect ${file}:`, error);
          }
        }
      }

      // Load image effects
      const imageEffectsDir = path.join(__dirname, '../effects/image');
      if (fs.existsSync(imageEffectsDir)) {
        const imageFiles = fs.readdirSync(imageEffectsDir).filter(file => file.endsWith('.js'));
        for (const file of imageFiles) {
          const effectName = file.replace('.js', '');
          const effectPath = path.join(imageEffectsDir, file);
          try {
            delete require.cache[require.resolve(effectPath)];
            effects.image[effectName] = require(effectPath);
          } catch (error) {
            console.error(`Error loading image effect ${file}:`, error);
          }
        }
      }

      this.effectsCache = effects;
      return effects;
    } catch (error) {
      console.error('Error loading effects:', error);
      return effects;
    }
  }

  // Get effects by type
  async getEffectsByType(type) {
    const allEffects = await this.getAllEffects();
    return allEffects[type] || {};
  }

  // Generate HTML with effects applied
  async generateWithEffects({ scenario, platform, content, effects, template }) {
    try {
      // Load the template
      const templatePath = path.join(__dirname, '../templates', `${template}.html`);
      let html = fs.readFileSync(templatePath, 'utf8');

      // Apply content to template
      html = this.applyContentToTemplate(html, content);

      // Apply effects
      if (effects && effects.length > 0) {
        html = await this.applyEffectsToHtml(html, effects);
      }

      return html;
    } catch (error) {
      console.error('Error generating content with effects:', error);
      throw error;
    }
  }

  // Generate preview without effects
  async generatePreview({ content, template }) {
    try {
      const templatePath = path.join(__dirname, '../templates', `${template}.html`);
      let html = fs.readFileSync(templatePath, 'utf8');
      
      // Apply content to template
      html = this.applyContentToTemplate(html, content);
      
      return html;
    } catch (error) {
      console.error('Error generating preview:', error);
      throw error;
    }
  }

  // Apply content to HTML template
  applyContentToTemplate(html, content) {
    // Replace placeholders with actual content
    if (content.title) {
      html = html.replace(/\{\{title\}\}/g, content.title);
      html = html.replace(/<title>.*<\/title>/g, `<title>${content.title}</title>`);
    }
    
    if (content.message) {
      html = html.replace(/\{\{message\}\}/g, content.message);
    }
    
    if (content.cta) {
      html = html.replace(/\{\{cta\}\}/g, content.cta);
    }
    
    if (content.logo || content.logoBase64) {
      const logoSrc = content.logoBase64 || content.logo || '';
      html = html.replace(/\{\{logo\}\}/g, logoSrc);
    }

    if (content.contact) {
      html = html.replace(/\{\{contact\}\}/g, content.contact);
    }

    if (content.shopName) {
      html = html.replace(/\{\{shopName\}\}/g, content.shopName);
    }

    return html;
  }

  // Apply effects to HTML
  async applyEffectsToHtml(html, effects) {
    let modifiedHtml = html;
    let allCss = '';

    for (const effect of effects) {
      try {
        const effectData = await this.getEffectData(effect.name, effect.type);
        if (effectData && effectData.css) {
          // Add effect class to the target element
          const targetSelector = effect.target || '.content-main';
          const effectClass = `effect-${effect.name}`;
          
          // Add the effect class to the HTML
          modifiedHtml = this.addEffectClassToElement(modifiedHtml, targetSelector, effectClass);
          
          // Collect CSS
          allCss += effectData.css + '\n';
        }
      } catch (error) {
        console.error(`Error applying effect ${effect.name}:`, error);
      }
    }

    // Inject CSS into the HTML
    if (allCss) {
      const styleTag = `<style>\n${allCss}\n</style>`;
      if (modifiedHtml.includes('{{EFFECT_STYLES}}')) {
        modifiedHtml = modifiedHtml.replace('{{EFFECT_STYLES}}', allCss);
      } else {
        modifiedHtml = modifiedHtml.replace('</head>', `${styleTag}\n</head>`);
      }
    } else {
      modifiedHtml = modifiedHtml.replace('{{EFFECT_STYLES}}', '');
    }

    return modifiedHtml;
  }

  // Get effect data by name and type
  async getEffectData(effectName, effectType) {
    const effects = await this.getAllEffects();
    return effects[effectType] && effects[effectType][effectName];
  }

  // Add effect class to HTML element
  addEffectClassToElement(html, selector, effectClass) {
    // Simple implementation - can be enhanced with proper HTML parsing
    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      const regex = new RegExp(`class="([^"]*${className}[^"]*)"`, 'g');
      return html.replace(regex, `class="$1 ${effectClass}"`);
    }
    
    return html;
  }

  // Clear effects cache
  clearCache() {
    this.effectsCache = null;
  }
}

module.exports = new EffectProcessor();
