
module.exports = {
  name: 'crystal-shatter',
  type: 'image',
  description: 'Effet de cristal qui se brise',
  css: `
    @keyframes crystalShatter {
      0% { 
        transform: scale(1);
        filter: brightness(1) contrast(1);
      }
      25% { 
        transform: scale(1.02);
        filter: brightness(1.2) contrast(1.1);
      }
      50% { 
        transform: scale(0.98) rotate(0.5deg);
        filter: brightness(0.8) contrast(1.2);
      }
      100% { 
        transform: scale(1);
        filter: brightness(1) contrast(1);
      }
    }
    .effect-crystal-shatter {
      animation: crystalShatter 4s ease-in-out infinite;
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
    }
  `,
  parameters: {
    duration: { value: '4s', type: 'string' },
    intensity: { value: 1, type: 'number' }
  }
};
