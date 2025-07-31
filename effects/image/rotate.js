module.exports = {
  name: 'rotate',
  type: 'image',
  description: 'Effet de rotation',
  css: `
    @keyframes imageRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .effect-rotate {
      animation: imageRotate 4s linear infinite;
    }
  `,
  parameters: {
    duration: { value: '4s', type: 'string' },
    direction: { value: 'clockwise', type: 'string' }
  }
};