module.exports = {
  name: 'crystalgrow',
  type: 'text',
  description: 'Effet de croissance cristalline',
  css: `
    @keyframes crystalGrow {
      0% { 
        transform: scale(0.1) rotate(0deg);
        opacity: 0;
        filter: brightness(0.5);
      }
      30% { 
        transform: scale(0.6) rotate(10deg);
        opacity: 0.7;
        filter: brightness(1.2);
      }
      60% { 
        transform: scale(1.1) rotate(-5deg);
        opacity: 0.9;
        filter: brightness(1.5);
      }
      100% { 
        transform: scale(1) rotate(0deg);
        opacity: 1;
        filter: brightness(1);
      }
    }
    .effect-crystalgrow {
      animation: crystalGrow 2s ease-out forwards;
      text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4);
    }
  `,
  parameters: {
    duration: { value: '2s', type: 'string' },
    intensity: { value: 1, type: 'number' }
  }
};