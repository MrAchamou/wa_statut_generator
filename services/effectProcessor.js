
const fs = require('fs');
const path = require('path');

class EffectProcessor {
  constructor() {
    this.effectsCache = null;
  }

  // Load all effects from local files
  async loadAllEffects() {
    if (this.effectsCache) {
      return this.effectsCache;
    }

    const textEffects = await this.loadEffectsByCategory('text');
    const imageEffects = await this.loadEffectsByCategory('image');

    this.effectsCache = {
      text: textEffects,
      image: imageEffects
    };

    return this.effectsCache;
  }

  // Load effects by category (text or image)
  async loadEffectsByCategory(category) {
    const effectsDir = path.join(__dirname, '../effects', category);
    const effects = [];

    try {
      const files = fs.readdirSync(effectsDir);
      
      for (const file of files) {
        if (file.endsWith('.js')) {
          try {
            const effectPath = path.join(effectsDir, file);
            const effect = require(effectPath);
            effects.push(effect);
          } catch (error) {
            console.error(`Error loading effect ${file}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading effects directory ${category}:`, error);
    }

    return effects;
  }

  // Generate CSS styles for applied effects
  async generateEffectStyles(appliedEffects, content) {
    if (!appliedEffects || Object.keys(appliedEffects).length === 0) {
      return { css: '', keyframes: '' };
    }

    const effects = await this.loadAllEffects();
    const allEffects = [...effects.text, ...effects.image];
    
    let css = '';
    let keyframes = new Set();

    for (const [elementType, effectId] of Object.entries(appliedEffects)) {
      if (!effectId) continue;

      const effect = allEffects.find(e => e.id === effectId);
      if (!effect) continue;

      const elementId = `content-${elementType}`;
      const params = effect.parameters ? this.getDefaultParams(effect.parameters) : {};
      
      if (effect.getEffectCode) {
        const effectCode = effect.getEffectCode(elementId, params);
        css += effectCode.elementCss + '\n';
        if (effectCode.keyframesCss) {
          keyframes.add(effectCode.keyframesCss);
        }
      }
    }

    // Combine all keyframes
    const keyframesCSS = Array.from(keyframes).join('\n');

    return {
      css: keyframesCSS + '\n' + css
    };
  }

  // Get default parameters for an effect
  getDefaultParams(parameters) {
    const params = {};
    for (const [key, config] of Object.entries(parameters)) {
      params[key] = config.default;
    }
    return params;
  }

  // Get specific effect by ID
  async getEffect(effectId) {
    const effects = await this.loadAllEffects();
    const allEffects = [...effects.text, ...effects.image];
    return allEffects.find(e => e.id === effectId);
  }
}

module.exports = new EffectProcessor();
