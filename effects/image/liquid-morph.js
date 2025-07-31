
module.exports = {
  name: 'liquid-morph',
  type: 'image',
  description: 'Effet de morphisme liquide',
  css: `
    @keyframes liquidMorph {
      0%, 100% { 
        border-radius: 20px;
        transform: scale(1);
      }
      25% { 
        border-radius: 50px 20px 30px 40px;
        transform: scale(1.02);
      }
      50% { 
        border-radius: 30px 50px 20px 35px;
        transform: scale(0.98);
      }
      75% { 
        border-radius: 40px 30px 50px 20px;
        transform: scale(1.01);
      }
    }
    .effect-liquid-morph {
      animation: liquidMorph 6s ease-in-out infinite;
      overflow: hidden;
    }
  `,
  parameters: {
    duration: { value: '6s', type: 'string' },
    morphStrength: { value: 1, type: 'number' }
  }
};
