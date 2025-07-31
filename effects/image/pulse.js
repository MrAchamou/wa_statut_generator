module.exports = {
  name: 'pulse',
  type: 'image',
  description: 'Effet de pulsation',
  css: `
    @keyframes imagePulse {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
      }
      50% { 
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
      }
    }
    .effect-pulse {
      animation: imagePulse 2s infinite;
    }
  `,
  parameters: {
    duration: { value: '2s', type: 'string' },
    scale: { value: 1.05, type: 'number' }
  }
};