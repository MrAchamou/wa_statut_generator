
module.exports = {
  basic: {
    name: 'WhatsApp Basic',
    description: 'Scénario basique pour WhatsApp',
    template: 'basic',
    defaultContent: {
      title: 'Nouveau Message',
      message: 'Découvrez notre offre spéciale !',
      cta: 'En savoir plus',
      contact: '+33 6 12 34 56 78'
    },
    elements: ['title', 'message', 'cta', 'contact'],
    style: {
      backgroundColor: '#075e54',
      textColor: '#ffffff',
      accentColor: '#25d366'
    }
  },
  
  standard: {
    name: 'WhatsApp Standard',
    description: 'Scénario standard pour WhatsApp avec logo',
    template: 'standard',
    defaultContent: {
      title: 'Message Professionnel',
      message: 'Votre entreprise de confiance',
      cta: 'Contactez-nous',
      contact: '+33 6 12 34 56 78',
      shopName: 'Mon Entreprise'
    },
    elements: ['title', 'logo', 'message', 'cta', 'contact'],
    style: {
      backgroundColor: '#075e54',
      textColor: '#ffffff',
      accentColor: '#25d366'
    }
  },

  premium: {
    name: 'WhatsApp Premium',
    description: 'Scénario premium avec effets avancés',
    template: 'standard',
    defaultContent: {
      title: 'Offre Exclusive',
      message: 'Une expérience unique vous attend',
      cta: 'Découvrir maintenant',
      contact: '+33 6 12 34 56 78',
      shopName: 'Premium Brand'
    },
    elements: ['title', 'logo', 'message', 'cta', 'contact'],
    style: {
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      accentColor: '#ffd700'
    }
  }
};
