
module.exports = {
  basic: {
    name: "Message Simple",
    template: "Bienvenue chez {shop} ! Votre {sector} de confiance. Contactez-nous au {contact}",
    elements: ["title", "logo", "message", "cta", "contact"],
    defaultContent: {
      title: "Bienvenue !",
      message: "Découvrez nos offres.",
      cta: "Contactez-nous !"
    }
  },
  standard: {
    name: "Offre du Jour",
    template: "🔥 OFFRE DU JOUR ! {product} à prix exceptionnel chez {shop}. Commandez maintenant !",
    elements: ["title", "logo", "message", "cta", "contact"],
    defaultContent: {
      title: "Offre Spéciale !",
      message: "Profitez de -20% sur tout !",
      cta: "J'en profite !"
    }
  },
  premium: {
    name: "Nouvelle Collection",
    template: "✨ NOUVELLE COLLECTION ! Découvrez nos dernières créations chez {shop}. Qualité premium, prix imbattables.",
    elements: ["title", "logo", "message", "cta", "contact"],
    defaultContent: {
      title: "Collection Exclusive",
      message: "Des créations uniques vous attendent",
      cta: "Découvrir"
    }
  },
  masterclass: {
    name: "Storytelling",
    template: "Il était une fois une passion... Celle de vous offrir le meilleur. Chez {shop}, chaque produit raconte une histoire. La vôtre commence ici.",
    elements: ["title", "logo", "message", "cta", "contact"],
    defaultContent: {
      title: "Notre Histoire",
      message: "Une passion qui devient réalité",
      cta: "Rejoignez l'aventure"
    }
  }
};
