
module.exports = {
  name: 'typewriter',
  type: 'text',
  description: 'Effet machine à écrire avec curseur clignotant',
  css: `
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink-caret {
      from, to { border-color: transparent; }
      50% { border-color: #00ff00; }
    }
    .effect-typewriter {
      overflow: hidden;
      border-right: 3px solid #00ff00;
      white-space: nowrap;
      margin: 0 auto;
      animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
    }
  `,
  parameters: {
    duration: { value: '3.5s', type: 'string' },
    steps: { value: 40, type: 'number' }
  }
};
