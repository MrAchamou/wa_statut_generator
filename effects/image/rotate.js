
module.exports = {
  id: "rotate",
  name: "Rotation Continue",
  category: "image",
  subcategory: "transform",
  icon: "🔄",
  description: "Rotation continue fluide de l'élément.",
  parameters: {
    vitesse: { type: "range", min: 0.1, max: 5, default: 1, description: "Vitesse de rotation" },
    direction: { type: "select", options: ["clockwise", "counterclockwise"], default: "clockwise", description: "Direction de rotation" }
  },
  compatibility: { text: false, image: true, logo: true, background: false },
  performance: "high",
  preview: { gif: "rotate.gif", duration: 3000, loop: true },
  tags: ["image", "rotation", "spin"],
  
  getEffectCode: function(elementId, params) {
    const vitesse = params.vitesse || this.parameters.vitesse.default;
    const direction = params.direction || this.parameters.direction.default;
    const rotationDirection = direction === "clockwise" ? "360deg" : "-360deg";

    const elementCss = `
      #${elementId} {
        animation: rotateEffect${elementId} ${3/vitesse}s linear infinite;
      }
    `;

    const keyframesCss = `
      @keyframes rotateEffect${elementId} {
        from { 
          transform: rotate(0deg);
        }
        to { 
          transform: rotate(${rotationDirection});
        }
      }
    `;

    return { elementCss, keyframesCss };
  }
};
