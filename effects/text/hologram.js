
module.exports = {
  name: 'hologram',
  type: 'text',
  description: 'Effet hologramme avec scintillement',
  css: `
    @keyframes hologram {
      0%, 100% { 
        opacity: 0.8;
        text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
      }
      50% { 
        opacity: 1;
        text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff;
      }
    }
    .effect-hologram {
      color: #00ffff;
      animation: hologram 2s ease-in-out infinite;
      font-weight: bold;
    }
  `,
  parameters: {
    color: { value: '#00ffff', type: 'color' },
    intensity: { value: 2, type: 'number' }
  }
};
