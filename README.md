
# 🚀 Social Content Masterclass - Backend

Backend Node.js/Express pour la génération de contenu social avec effets spéciaux et scénarios dynamiques.

## 🏗️ Architecture

```
/
├── server.js                 # Point d'entrée Express
├── routes/
│   └── api.js               # Routes API
├── controllers/
│   └── contentController.js # Logique métier
├── services/
│   ├── effectProcessor.js   # Traitement des effets
│   └── scenarioEngine.js    # Moteur de scénarios
├── effects/                 # Bibliothèque d'effets locaux
│   ├── text/               # 30 effets texte
│   └── image/              # 30 effets image
├── scenarios/              # Scénarios par plateforme
├── templates/              # Templates HTML
└── package.json
```

## 🔗 Endpoints API

### GET /health
Vérification de l'état du serveur.

### GET /api/effects
Retourne tous les effets disponibles organisés par catégorie.

### GET /api/scenarios  
Retourne tous les scénarios organisés par plateforme.

### POST /api/generate
Génère le contenu HTML avec effets appliqués.

## 🚀 Démarrage

```bash
npm install
npm start
```

Le serveur démarre sur le port 5000.

## 📝 Utilisation

Le backend fonctionne avec le frontend Social Content Masterclass et génère du HTML dynamique avec les effets spéciaux intégrés.

## 🎨 Effets Disponibles

- **Texte**: crystalgrow, neonpulse, glitch, etc.
- **Image**: pulse, rotate, etc.

## 🎬 Scénarios

- **WhatsApp**: basic, standard, premium, masterclass
- **Instagram**: basic, standard, premium, masterclass
- Plus de plateformes à venir...
