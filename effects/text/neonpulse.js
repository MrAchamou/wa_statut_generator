
module.exports = {
  id: "neonpulse",
  name: "Neon Pulse",
  category: "text",
  subcategory: "glow",
  icon: "⚡",
  description: "Pulsation néon électrique avec lueur dynamique.",
  parameters: {
    vitesse: { type: "range", min: 0.5, max: 3, default: 1.5, description: "Vitesse de pulsation" },
    intensite: { type: "range", min: 0, max: 1, default: 0.9, description: "Intensité de la lueur" },
    couleur: { type: "color", default: "#00ffff", description: "Couleur néon" }
  },
  compatibility: { text: true, image: false, logo: true, background: false },
  performance: "high",
  preview: { gif: "neonpulse.gif", duration: 2000, loop: true },
  tags: ["text", "neon", "electric", "glow"],
  
  getEffectCode: function(elementId, params) {
    const vitesse = params.vitesse || this.parameters.vitesse.default;
    const intensite = params.intensite || this.parameters.intensite.default;
    const couleur = params.couleur || this.parameters.couleur.default;

    const elementCss = `
      #${elementId} {
        animation: neonPulse${elementId} ${2/vitesse}s ease-in-out infinite;
        text-shadow: 0 0 ${20*intensite}px ${couleur};
      }
    `;

    const keyframesCss = `
      @keyframes neonPulse${elementId} {
        0%, 100% { 
          text-shadow: 0 0 ${20*intensite}px ${couleur}, 0 0 ${30*intensite}px ${couleur};
        }
        50% { 
          text-shadow: 0 0 ${40*intensite}px ${couleur}, 0 0 ${60*intensite}px ${couleur}, 0 0 ${80*intensite}px #ff00ff;
        }
      }
    `;

    return { elementCss, keyframesCss };
  }
};
