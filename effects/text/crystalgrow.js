
module.exports = {
  id: "crystalgrow",
  name: "Crystal Grow",
  category: "text",
  subcategory: "transform",
  icon: "💎",
  description: "Croissance cristalline progressive avec structures géométriques complexes.",
  parameters: {
    vitesse: { type: "range", min: 0.1, max: 3, default: 1.3, description: "Vitesse de croissance cristalline" },
    intensite: { type: "range", min: 0, max: 1, default: 0.8, description: "Intensité de l'effet" },
    couleurBase: { type: "color", default: "#8b5cf6", description: "Couleur de base des cristaux" }
  },
  compatibility: { text: true, image: false, logo: true, background: false },
  performance: "medium",
  preview: { gif: "crystalgrow.gif", duration: 3000, loop: true },
  tags: ["text", "crystal", "prism", "geometric", "fractal"],
  
  getEffectCode: function(elementId, params) {
    const vitesse = params.vitesse || this.parameters.vitesse.default;
    const intensite = params.intensite || this.parameters.intensite.default;
    const couleurBase = params.couleurBase || this.parameters.couleurBase.default;

    const elementCss = `
      #${elementId} {
        animation: crystalGrow${elementId} ${2/vitesse}s ease-in-out infinite;
        filter: drop-shadow(0 0 ${20*intensite}px ${couleurBase}) hue-rotate(0deg);
      }
    `;

    const keyframesCss = `
      @keyframes crystalGrow${elementId} {
        0%, 100% { 
          transform: scale(1) rotate(0deg); 
          filter: drop-shadow(0 0 ${20*intensite}px ${couleurBase}) hue-rotate(0deg);
        }
        25% { 
          transform: scale(${1 + intensite*0.1}) rotate(${intensite*2}deg); 
          filter: drop-shadow(0 0 ${30*intensite}px ${couleurBase}) hue-rotate(90deg);
        }
        50% { 
          transform: scale(${1 + intensite*0.15}) rotate(${intensite*1}deg); 
          filter: drop-shadow(0 0 ${40*intensite}px ${couleurBase}) hue-rotate(180deg);
        }
        75% { 
          transform: scale(${1 + intensite*0.1}) rotate(${-intensite*2}deg); 
          filter: drop-shadow(0 0 ${30*intensite}px ${couleurBase}) hue-rotate(270deg);
        }
      }
    `;

    return { elementCss, keyframesCss };
  }
};
