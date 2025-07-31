
module.exports = {
  id: "pulse",
  name: "Pulse",
  category: "image",
  subcategory: "scale",
  icon: "💓",
  description: "Pulsation rythmique de l'élément avec effet de battement.",
  parameters: {
    vitesse: { type: "range", min: 0.5, max: 3, default: 2, description: "Vitesse de pulsation" },
    amplitude: { type: "range", min: 0.1, max: 0.5, default: 0.2, description: "Amplitude du pulse" }
  },
  compatibility: { text: false, image: true, logo: true, background: false },
  performance: "high",
  preview: { gif: "pulse.gif", duration: 2000, loop: true },
  tags: ["image", "scale", "heartbeat"],
  
  getEffectCode: function(elementId, params) {
    const vitesse = params.vitesse || this.parameters.vitesse.default;
    const amplitude = params.amplitude || this.parameters.amplitude.default;

    const elementCss = `
      #${elementId} {
        animation: pulseEffect${elementId} ${1/vitesse}s ease-in-out infinite;
      }
    `;

    const keyframesCss = `
      @keyframes pulseEffect${elementId} {
        0%, 100% { 
          transform: scale(1);
        }
        50% { 
          transform: scale(${1 + amplitude});
        }
      }
    `;

    return { elementCss, keyframesCss };
  }
};
