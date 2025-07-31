# 🚀 PROMPT DÉTAILLÉ POUR L'IA DE REPLIT : BACKEND SOCIAL CONTENT MASTERCLASS

## 🎯 OBJECTIF PRINCIPAL

Créer un backend Node.js/Express.js robuste, performant et sans dépendances externes majeures, capable de s'intégrer parfaitement avec le frontend existant du `Social Content Masterclass`. Ce backend doit gérer la logique métier complexe des effets spéciaux, des scénarios de contenu, et la génération de médias (HTML, puis potentiellement MP4/GIF via un processus asynchrone ou un service tiers à définir par l'IA de Replit).

Le frontend est déjà développé et fonctionne en mode local. Il attend un backend pour débloquer toutes ses fonctionnalités avancées de génération et d'export. L'IA de Replit est chargée de construire ce backend de A à Z, en s'appuyant sur les spécifications détaillées ci-dessous.

## ⚙️ TECHNOLOGIES ET ARCHITECTURE

Le backend doit être implémenté en **Node.js** en utilisant le framework **Express.js**. L'accent est mis sur la légèreté et l'auto-hébergement sur Replit. Par conséquent, il est impératif de **minimiser les dépendances externes** et de privilégier les solutions natives ou les bibliothèques légères si absolument nécessaires.

### Structure du Projet :
Le projet doit suivre une architecture modulaire et propre, organisée comme suit :

```
/
├── server.js               # Point d'entrée principal de l'application Express
├── routes/                 # Définition des routes de l'API
│   └── api.js
├── controllers/            # Logique métier associée aux routes
│   └── contentController.js
├── services/               # Services auxiliaires (ex: EffectProcessor, ScenarioEngine)
│   ├── effectProcessor.js
│   └── scenarioEngine.js
├── models/                 # Modèles de données (si nécessaire, pour la structure des requêtes/réponses)
├── config/                 # Fichiers de configuration (ex: CORS, ports)
├── effects/                # Définition des effets spéciaux (JS)
│   ├── text/               # Effets applicables au texte
│   │   ├── crystalgrow.js
│   │   └── neonpulse.js
│   │   └── ... (30 effets texte)
│   └── image/              # Effets applicables aux images/logos
│       ├── pulse.js
│       └── rotate.js
│       └── ... (30 effets image)
├── scenarios/              # Définition des scénarios de contenu (JS ou JSON)
│   ├── whatsapp.js
│   ├── instagram.js
│   ├── facebook.js
│   ├── tiktok.js
│   ├── youtube.js
│   ├── linkedin.js
│   ├── twitter.js
│   └── product.js
├── templates/              # Templates HTML de base pour la génération de statuts
│   ├── basic.html
│   ├── standard.html
│   ├── premium.html
│   └── masterclass.html
└── utils/                  # Utilitaires divers (ex: validation, helpers)
```

## 🔗 SPÉCIFICATIONS DE L'API REST

Le backend doit exposer les endpoints suivants pour interagir avec le frontend :

### 1. `GET /health`
- **Description :** Endpoint simple pour vérifier l'état de santé du serveur.
- **Réponse attendue (JSON) :**
  ```json
  {
    "status": "ok",
    "message": "Backend is running",
    "timestamp": "2025-07-31T12:34:56Z"
  }
  ```

### 2. `GET /effects`
- **Description :** Retourne la liste complète des effets spéciaux disponibles, organisés par catégorie (texte, image). Ces effets sont définis dans le dossier `/effects/`.
- **Réponse attendue (JSON) :**
  ```json
  {
    "text": [
      {
        "id": "crystalgrow",
        "name": "Crystal Grow",
        "category": "text",
        "subcategory": "transform",
        "icon": "💎",
        "description": "Croissance cristalline progressive...",
        "parameters": {
          "vitesse": { "type": "range", "min": 0.1, "max": 3, "default": 1.3, "description": "Vitesse de croissance" },
          "intensite": { "type": "range", "min": 0, "max": 1, "default": 0.8, "description": "Intensité de l'effet" }
        },
        "compatibility": { "text": true, "image": false, "logo": true, "background": false },
        "performance": "medium",
        "preview": { "gif": "crystalgrow.gif", "duration": 3000, "loop": true },
        "tags": ["text", "crystal", "fractal"]
      },
      // ... autres effets texte
    ],
    "image": [
      {
        "id": "pulse",
        "name": "Pulse",
        "category": "image",
        "subcategory": "scale",
        "icon": "💓",
        "description": "Pulsation rythmique de l'élément...",
        "parameters": {
          "vitesse": { "type": "range", "min": 0.5, "max": 3, "default": 2, "description": "Vitesse de pulsation" },
          "amplitude": { "type": "range", "min": 0.1, "max": 0.5, "default": 0.2, "description": "Amplitude" }
        },
        "compatibility": { "text": false, "image": true, "logo": true, "background": false },
        "performance": "high",
        "preview": { "gif": "pulse.gif", "duration": 2000, "loop": true },
        "tags": ["image", "scale"]
      },
      // ... autres effets image
    ]
  }
  ```
- **Implémentation :** Le backend doit lire dynamiquement les fichiers `.js` présents dans `effects/text/` et `effects/image/`, extraire leurs métadonnées (l'objet `export const effectName = {...}`), et les retourner sous forme de JSON. La fonction `apply` de chaque effet n'est pas exécutée côté backend, seules les métadonnées sont nécessaires.

### 3. `GET /scenarios`
- **Description :** Retourne la liste complète des scénarios de contenu disponibles, organisés par plateforme et par niveau. Ces scénarios sont définis dans le dossier `/scenarios/`.
- **Réponse attendue (JSON) :**
  ```json
  {
    "whatsapp": {
      "basic": {
        "name": "Message Simple",
        "template": "Bienvenue chez {shop} ! Votre {sector} de confiance. Contactez-nous au {contact}",
        "elements": ["title", "logo", "message", "cta", "contact"]
      },
      "standard": { /* ... */ },
      "premium": { /* ... */ },
      "masterclass": { /* ... */ }
    },
    "instagram": { /* ... */ },
    // ... autres plateformes
  }
  ```
- **Implémentation :** Similaire à `/effects`, le backend doit lire et agréger les définitions de scénarios depuis le dossier `/scenarios/`.

### 4. `POST /generate`
- **Description :** Reçoit les données de configuration du frontend (plateforme, scénario, contenu textuel, images encodées en Base64, effets choisis) et génère le statut final sous forme de HTML prêt à être affiché ou converti.
- **Requête attendue (JSON) :**
  ```json
  {
    "platform": "whatsapp",
    "scenario": "basic",
    "device": "iphone",
    "format": "9-16",
    "mood": "sobre",
    "content": {
      "shopName": "Ma Boutique",
      "sector": "mode",
      "audience": "jeune",
      "title": "Nouvelle Collection !",
      "message": "Découvrez nos dernières créations...",
      "cta": "Acheter maintenant",
      "contact": "+33612345678",
      "logoBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." // Optionnel, si une image est uploadée
    },
    "effects": {
      "title": "crystalgrow",
      "logo": "pulse",
      "message": "neonpulse",
      "cta": "glitch"
    },
    "export": {
      "format": "mp4", // ou "gif"
      "quality": "high",
      "duration": 10
    }
  }
  ```
- **Réponse attendue (JSON) :**
  ```json
  {
    "success": true,
    "htmlContent": "<!DOCTYPE html><html><head>...</head><body>...</body></html>",
    "message": "Contenu généré avec succès."
  }
  ```
  En cas d'erreur :
  ```json
  {
    "success": false,
    "error": "Message d'erreur détaillé"
  }
  ```
- **Logique d'Implémentation :**
    1.  **Validation :** Valider les données reçues (présence des champs requis, types corrects).
    2.  **Chargement du Scénario :** Charger le template de scénario correspondant (`platform` et `scenario`).
    3.  **Chargement du Template HTML :** Charger le fichier HTML de base (ex: `templates/basic.html`).
    4.  **Injection de Contenu :** Remplacer les placeholders dans le template HTML avec les données fournies (`shopName`, `title`, `message`, `cta`, `contact`, `logoBase64`). L'IA doit définir une stratégie pour l'injection (ex: `{{title}}`, `{{logo}}`, etc.).
    5.  **Injection des Effets :** C'est la partie cruciale. Pour chaque élément (`title`, `logo`, `message`, `cta`), si un effet est spécifié :
        *   Le backend doit récupérer la définition de l'effet (son `id` et ses `parameters`).
        *   Il doit générer le code JavaScript et/ou CSS nécessaire pour appliquer cet effet à l'élément correspondant dans le HTML. Cela implique de reproduire la logique `apply` des effets du frontend, mais côté serveur pour l'intégration dans le HTML final. L'IA devra analyser les exemples d'effets fournis dans le frontend (`crystalgrow.effect.js`, `pulse_img.js`) pour comprendre comment ces effets sont appliqués (principalement via des classes CSS et des keyframes).
        *   Les keyframes CSS devront être injectées dynamiquement dans le `<style>` du HTML généré si elles ne sont pas déjà présentes.
        *   Les classes CSS (`effect-crystalgrow`, `effect-pulse`, etc.) devront être ajoutées aux éléments HTML pertinents.
    6.  **Gestion des Images :** Si `logoBase64` est fourni, il doit être injecté comme `src` d'une balise `<img>` dans le HTML.
    7.  **Retour HTML :** Retourner le HTML complet et rendu.

## 📁 DÉFINITION DES EFFETS SPÉCIAUX (CÔTÉ BACKEND)

**TRÈS IMPORTANT :** Le backend ne doit en aucun cas dépendre d'un dépôt GitHub externe pour les effets. Tous les fichiers d'effets doivent être stockés directement dans le dossier `/effects/` du backend. Il n'y a **AUCUN besoin de token GitHub** ou de toute autre forme d'authentification pour accéder aux effets. Le backend doit lire ces fichiers localement.

Les fichiers d'effets dans `/effects/text/` et `/effects/image/` doivent être structurés comme des modules Node.js exportant un objet de configuration. L'IA de Replit devra créer 60 fichiers d'effets (30 texte, 30 image) avec des métadonnées réalistes, même si la logique `apply` sera simplifiée côté backend pour l'injection CSS/JS.

**Exemple de structure d'un fichier d'effet (ex: `effects/text/crystalgrow.js`) :**

```javascript
// effects/text/crystalgrow.js

module.exports = {
    id: "crystalgrow",
    name: "Crystal Grow",
    category: "text",
    subcategory: "transform",
    icon: "💎",
    description: "Croissance cristalline progressive avec structures géométriques complexes.",
    parameters: {
        vitesse: { type: "range", min: 0.1, max: 3, default: 1.3, description: "Vitesse de croissance cristalline" },
        intensite: { type: "range", min: 0, max: 1, default: 0.8, description: "Intensité de l'effet" },
        couleurBase: { type: "color", default: "#8b5cf6", description: "Couleur de base des cristaux" }
    },
    compatibility: { text: true, image: false, logo: true, background: false },
    performance: "medium",
    preview: { gif: "crystalgrow.gif", duration: 3000, loop: true },
    tags: ["text", "crystal", "prism", "geometric", "fractal"],
    
    // Cette fonction 'getEffectCode' est la partie que le backend doit générer pour l'injection HTML
    getEffectCode: function(elementId, params) {
        const vitesse = params.vitesse || this.parameters.vitesse.default;
        const intensite = params.intensite || this.parameters.intensite.default;
        const couleurBase = params.couleurBase || this.parameters.couleurBase.default;

        // CSS pour l'élément spécifique
        const elementCss = `
            #${elementId} {
                animation: crystalGrow ${2/vitesse}s ease-in-out infinite;
                filter: drop-shadow(0 0 ${20*intensite}px ${couleurBase}) hue-rotate(0deg);
            }
        `;

        // Keyframes CSS (doivent être injectées une seule fois dans le <head>)
        const keyframesCss = `
            @keyframes crystalGrow {
                0%, 100% { 
                    transform: scale(1) rotate(0deg); 
                    filter: drop-shadow(0 0 ${20*intensite}px ${couleurBase}) hue-rotate(0deg);
                }
                25% { 
                    transform: scale(${1 + intensite*0.1}) rotate(${intensite*2}deg); 
                    filter: drop-shadow(0 0 ${30*intensite}px ${couleurBase}) hue-rotate(90deg);
                }
                50% { 
                    transform: scale(${1 + intensite*0.15}) rotate(${intensite*1}deg); 
                    filter: drop-shadow(0 0 ${40*intensite}px ${couleurBase}) hue-rotate(180deg);
                }
                75% { 
                    transform: scale(${1 + intensite*0.1}) rotate(${-intensite*2}deg); 
                    filter: drop-shadow(0 0 ${30*intensite}px ${couleurBase}) hue-rotate(270deg);
                }
            }
        `;

        return { elementCss, keyframesCss };
    }
};
```

L'IA devra créer des fonctions `getEffectCode` similaires pour les 60 effets, en s'inspirant des classes CSS et keyframes déjà définies dans le frontend (`social-content-masterclass-complete.html`).

## 📚 DÉFINITION DES SCÉNARIOS (CÔTÉ BACKEND)

Les scénarios doivent être définis dans le dossier `/scenarios/` et être structurés pour être facilement lisibles par le backend. Chaque fichier (ex: `scenarios/whatsapp.js`) exportera un objet contenant les scénarios pour cette plateforme.

**Exemple de structure d'un fichier de scénario (ex: `scenarios/whatsapp.js`) :**

```javascript
// scenarios/whatsapp.js

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
        template: "🔥 OFFRE DU JOUR ! {product} à seulement {price} chez {shop}. Commandez maintenant !",
        elements: ["title", "logo", "message", "cta", "contact"],
        defaultContent: {
            title: "Offre Spéciale !",
            message: "Profitez de -20% sur tout !",
            cta: "J'en profite !"
        }
    },
    // ... autres scénarios pour WhatsApp
};
```

## 📄 TEMPLATES HTML DE BASE

Le dossier `/templates/` doit contenir des fichiers HTML de base (ex: `basic.html`, `standard.html`) qui serviront de canevas pour la génération. Ces templates doivent inclure des placeholders (ex: `{{title}}`, `{{message}}`, `{{logo}}`, `{{cta}}`, `{{footer}}`) qui seront remplacés par le backend. Ils doivent également avoir une structure où les éléments de contenu (`content-title`, `content-main`, etc.) ont des `id` clairs pour l'injection des effets.

**Exemple de structure HTML simplifiée (ex: `templates/basic.html`) :**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statut Généré</title>
    <style>
        /* Styles de base pour le statut */
        body { margin: 0; font-family: sans-serif; background-color: #1a1a1a; color: white; }
        .status-container { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; text-align: center; }
        .status-element { margin-bottom: 10px; }
        /* Styles pour les effets seront injectés ici */
        {{EFFECT_STYLES}}
    </style>
</head>
<body>
    <div class="status-container">
        <div id="content-logo" class="status-element">{{logo}}</div>
        <h1 id="content-title" class="status-element">{{title}}</h1>
        <p id="content-main" class="status-element">{{message}}</p>
        <div id="content-cta" class="status-element">{{cta}}</div>
        <p id="content-footer" class="status-element">{{footer}}</p>
    </div>
</body>
</html>
```

Le placeholder `{{EFFECT_STYLES}}` est là où le backend injectera les keyframes CSS et les styles spécifiques aux éléments avec effets.

## 🖼️ GESTION DES IMAGES

Le backend ne doit pas stocker les images. Les images (comme le logo) seront envoyées par le frontend en Base64. Le backend doit simplement injecter cette chaîne Base64 directement dans l'attribut `src` d'une balise `<img>` dans le HTML généré.

Exemple : `<img id="content-logo-img" src="{{logoBase64}}" alt="Logo">`

## ⚡ EXPORT MP4/GIF (CONSIDÉRATIONS)

Le frontend demande un export MP4/GIF. L'IA de Replit doit savoir que la génération vidéo/GIF est une tâche gourmande en ressources et potentiellement longue. Étant donné la contrainte de 


légèreté et d'auto-hébergement sur Replit, il est peu probable que Replit puisse effectuer un rendu vidéo/GIF côté serveur en temps réel de manière efficace.

**Recommandations pour l'IA de Replit concernant l'export MP4/GIF :**

1.  **Priorité à la Génération HTML :** La priorité absolue est de générer le HTML final avec les effets appliqués. C'est le cœur de la demande du frontend.
2.  **Option 1 (Recommandée - Frontend-driven) :** Suggérer que la conversion MP4/GIF soit effectuée côté client (frontend) en utilisant des bibliothèques JavaScript comme `html2canvas` et `ffmpeg.js` (ou des services cloud comme Cloudinary, Imgix, etc. si le client est prêt à les intégrer et à gérer les coûts). Le backend se contenterait de fournir le HTML.
3.  **Option 2 (Si Replit le permet - Asynchrone) :** Si Replit offre des capacités de traitement en arrière-plan ou des intégrations avec des services de rendu vidéo (comme des APIs de rendu cloud), l'IA pourrait proposer un endpoint asynchrone (`POST /export`) qui prendrait le HTML généré, le convertirait en vidéo/GIF, et notifierait le frontend une fois le processus terminé (via WebSockets ou un polling simple).
4.  **Exclure le Rendu Temps Réel Côté Serveur :** Il est crucial de ne pas tenter de faire du rendu vidéo/GIF synchrone et en temps réel côté serveur avec les contraintes actuelles, car cela entraînerait des timeouts et une mauvaise expérience utilisateur.

Le prompt doit clairement indiquer que la fonctionnalité d'export MP4/GIF est une considération future ou une tâche à déléguer, et que la tâche principale du backend est de fournir le HTML rendu.

## 🔐 SÉCURITÉ ET SIMPLICITÉ

-   **Pas de Base de Données :** Le backend ne doit pas utiliser de base de données. Toutes les données (effets, scénarios) sont chargées depuis des fichiers au démarrage et gérées en mémoire.
-   **Pas de Stockage de Fichiers :** Le backend ne doit pas stocker de fichiers uploadés (comme les images). Les images sont traitées en Base64 et passées directement dans le HTML.
-   **CORS :** Le backend doit implémenter une politique CORS permissive pour permettre au frontend (qui sera hébergé sur GitHub Pages ou localement) de faire des requêtes. Idéalement, autoriser toutes les origines (`*`) pour la phase de développement, puis restreindre si nécessaire.
-   **Gestion des Erreurs :** Implémenter une gestion des erreurs robuste pour tous les endpoints de l'API, retournant des messages d'erreur clairs et des codes de statut HTTP appropriés.

## 🚀 CONTEXTE DU FRONTEND (POUR L'IA DE REPLIT)

Le frontend est une application HTML/CSS/JavaScript pure, conçue pour être légère et rapide. Il attend des réponses JSON structurées pour afficher les effets et les scénarios, et du HTML pour la prévisualisation du statut généré.

### Points Clés du Frontend :

-   **`backend-connector.js` :** Ce module gère la communication avec le backend. Il attend les endpoints `/health`, `/effects`, `/scenarios`, et `/generate`.
-   **`effect-manager.js` :** Ce module gère l'application des effets côté client. Le backend n'a pas besoin d'exécuter la logique `apply` des effets, mais doit fournir les métadonnées complètes et le code CSS/JS nécessaire pour que le frontend puisse les appliquer.
-   **Structure HTML du Preview :** Le frontend utilise un `div` avec l'ID `device-frame` et un `div` avec la classe `device-screen` qui contient un `canvas` pour les effets et un `div` avec la classe `content-layout`. Les éléments de contenu (`content-title`, `content-logo`, `content-main`, `content-cta`, `content-footer`) ont des IDs spécifiques. Le HTML généré par le backend doit s'intégrer dans cette structure ou être suffisamment autonome pour être affiché dans un `iframe` ou un `div` dédié.
-   **Injection d'Effets :** Le frontend applique les effets en ajoutant des classes CSS (ex: `effect-crystalgrow`) et en injectant des keyframes CSS dynamiquement. Le backend doit donc générer le HTML avec ces classes et les keyframes nécessaires incluses dans une balise `<style>` dans le `<head>` du HTML généré.

## ✅ RÉSULTAT ATTENDU

Un backend Node.js/Express.js fonctionnel sur Replit, capable de :

1.  Servir les métadonnées des 60 effets spéciaux (30 texte, 30 image) et des 100+ scénarios.
2.  Recevoir les requêtes de génération de statut du frontend.
3.  Générer dynamiquement un fichier HTML complet et stylisé, incluant le contenu utilisateur, les images Base64, et le code CSS/JS pour les effets spéciaux sélectionnés.
4.  Maintenir une architecture propre, modulaire et facile à comprendre pour de futures évolutions.
5.  Être prêt à être déployé sur Replit sans configuration complexe.

Ce prompt est conçu pour être le plus exhaustif possible, fournissant à l'IA de Replit toutes les informations nécessaires pour construire un backend parfaitement adapté au frontend existant. L'IA est encouragée à poser des questions si des clarifications sont nécessaires, mais l'objectif est qu'elle puisse travailler de manière autonome sur la base de ces spécifications.

