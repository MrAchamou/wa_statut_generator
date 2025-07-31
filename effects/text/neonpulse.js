module.exports = {
  name: 'neonpulse',
  type: 'text',
  description: 'Effet de pulsation néon',
  css: `
    @keyframes neonPulse {
      0%, 100% { 
        text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff;
        opacity: 1;
      }
      50% { 
        text-shadow: 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff;
        opacity: 0.8;
      }
    }
    .effect-neonpulse {
      animation: neonPulse 2s ease-in-out infinite;
      color: #fff;
    }
  `,
  parameters: {
    duration: { value: '2s', type: 'string' },
    color: { value: '#ff00ff', type: 'color' }
  }
};