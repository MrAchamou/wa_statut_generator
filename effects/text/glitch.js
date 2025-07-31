
module.exports = {
  id: "glitch",
  name: "Glitch Digital",
  category: "text",
  subcategory: "distortion",
  icon: "📺",
  description: "Effet de glitch numérique avec distorsion pixel.",
  parameters: {
    intensite: { type: "range", min: 0.1, max: 1, default: 0.7, description: "Intensité du glitch" },
    vitesse: { type: "range", min: 0.1, max: 3, default: 1.2, description: "Vitesse du glitch" }
  },
  compatibility: { text: true, image: false, logo: true, background: false },
  performance: "medium",
  preview: { gif: "glitch.gif", duration: 1000, loop: true },
  tags: ["text", "glitch", "digital", "cyber"],
  
  getEffectCode: function(elementId, params) {
    const intensite = params.intensite || this.parameters.intensite.default;
    const vitesse = params.vitesse || this.parameters.vitesse.default;

    const elementCss = `
      #${elementId} {
        animation: glitchEffect${elementId} ${0.3/vitesse}s ease-in-out infinite;
        position: relative;
      }
    `;

    const keyframesCss = `
      @keyframes glitchEffect${elementId} {
        0%, 100% { 
          transform: translateX(0);
          filter: hue-rotate(0deg);
        }
        20% { 
          transform: translateX(${-2*intensite}px);
          filter: hue-rotate(90deg);
        }
        40% { 
          transform: translateX(${2*intensite}px);
          filter: hue-rotate(180deg);
        }
        60% { 
          transform: translateX(${-1*intensite}px);
          filter: hue-rotate(270deg);
        }
        80% { 
          transform: translateX(${1*intensite}px);
          filter: hue-rotate(360deg);
        }
      }
    `;

    return { elementCss, keyframesCss };
  }
};
