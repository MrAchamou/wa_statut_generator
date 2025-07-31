
module.exports = {
  basic: {
    name: 'Instagram Basic',
    description: 'Scénario basique pour Instagram',
    template: 'basic',
    defaultContent: {
      title: 'Nouveau Post',
      message: 'Suivez-nous pour plus de contenu !',
      cta: 'Suivre',
      contact: '@moncompte'
    },
    elements: ['title', 'message', 'cta', 'contact'],
    style: {
      backgroundColor: '#405de6',
      textColor: '#ffffff',
      accentColor: '#fd5949'
    }
  },

  story: {
    name: 'Instagram Story',
    description: 'Format story Instagram',
    template: 'standard',
    defaultContent: {
      title: 'Story du jour',
      message: 'Ne ratez pas nos actualités !',
      cta: 'Voir plus',
      contact: '@moncompte',
      shopName: 'Mon Brand'
    },
    elements: ['title', 'logo', 'message', 'cta', 'contact'],
    style: {
      backgroundColor: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      textColor: '#ffffff',
      accentColor: '#ffffff'
    }
  },

  premium: {
    name: 'Instagram Premium',
    description: 'Post premium avec effets avancés',
    template: 'standard',
    defaultContent: {
      title: 'Contenu Exclusif',
      message: 'L\'excellence à votre portée',
      cta: 'Explorer',
      contact: '@premiumaccount',
      shopName: 'Premium Collection'
    },
    elements: ['title', 'logo', 'message', 'cta', 'contact'],
    style: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      accentColor: '#ffd700'
    }
  }
};
