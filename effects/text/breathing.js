
module.exports = {
  name: 'breathing',
  type: 'text',
  description: 'Effet de respiration avec pulsation douce',
  css: `
    @keyframes breathing {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.05); opacity: 1; }
    }
    .effect-breathing {
      animation: breathing 3s ease-in-out infinite;
      transform-origin: center;
    }
  `,
  parameters: {
    duration: { value: '3s', type: 'string' },
    scale: { value: 1.05, type: 'number' }
  }
};
