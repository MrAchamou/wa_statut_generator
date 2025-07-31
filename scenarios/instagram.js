
module.exports = {
  basic: {
    name: "Produit Simple",
    template: "{product} disponible maintenant ! À partir de 29€ #{shop}",
    elements: ["title", "logo", "message", "cta"],
    defaultContent: {
      title: "Nouveau Produit",
      message: "Disponible dès maintenant",
      cta: "Voir plus"
    }
  },
  standard: {
    name: "Lifestyle",
    template: "Vivez l'expérience {shop} 📸 Quand qualité rime avec style de vie",
    elements: ["title", "logo", "message", "cta"],
    defaultContent: {
      title: "Lifestyle",
      message: "Vivez l'expérience unique",
      cta: "Explorer"
    }
  },
  premium: {
    name: "Collection Capsule",
    template: "✨ COLLECTION CAPSULE EXCLUSIVE ✨ Découvrez nos pièces limitées chez {shop}",
    elements: ["title", "logo", "message", "cta"],
    defaultContent: {
      title: "Collection Capsule",
      message: "Pièces limitées exclusives",
      cta: "Shopper"
    }
  },
  masterclass: {
    name: "Behind the Scenes",
    template: "Dans les coulisses de {shop} 🎬 Découvrez la passion qui anime notre équipe",
    elements: ["title", "logo", "message", "cta"],
    defaultContent: {
      title: "Behind the Scenes",
      message: "Découvrez nos coulisses",
      cta: "Suivre"
    }
  }
};
