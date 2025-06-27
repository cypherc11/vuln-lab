
# VulnApp - Application Web d'Entraînement

## Description

VulnApp est une application web moderne conçue pour l'apprentissage de la cybersécurité. Elle simule une plateforme utilisateur classique avec différentes fonctionnalités courantes.

## Déploiement Local

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

1. Clonez le repository :
```bash
git clone <votre-repository-url>
cd vulnapp
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez l'application en mode développement :
```bash
npm run dev
```

4. Ouvrez votre navigateur et accédez à :
```
http://localhost:5173
```

### Commandes disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie la qualité du code

### Structure du projet

```
src/
├── components/ui/     # Composants d'interface réutilisables
├── pages/            # Pages de l'application
│   ├── Index.tsx     # Page d'accueil
│   ├── Login.tsx     # Authentification
│   ├── Register.tsx  # Inscription
│   ├── Profile.tsx   # Profil utilisateur
│   ├── Search.tsx    # Recherche
│   ├── Admin.tsx     # Administration
│   ├── Upload.tsx    # Upload de fichiers
│   └── Contact.tsx   # Contact
├── lib/              # Utilitaires
└── App.tsx          # Composant racine
```

## Fonctionnalités

- 🔐 Système d'authentification complet
- 👤 Gestion des profils utilisateurs
- 🔍 Moteur de recherche intégré
- 📁 Upload et gestion de fichiers
- 📧 Formulaire de contact
- ⚡ Interface moderne et responsive
- 🛡️ Panel d'administration

## Technologies utilisées

- **Frontend** : React 18, TypeScript, Tailwind CSS
- **Routing** : React Router
- **UI Components** : Shadcn/ui
- **Icons** : Lucide React
- **Build Tool** : Vite

## Comptes de test

Pour tester l'application, vous pouvez utiliser ces comptes :

- **Utilisateur standard** : `user` / `password`
- **Administrateur** : `admin` / `admin123`

## Notes importantes

⚠️ Cette application est conçue pour un usage éducatif uniquement. Elle ne doit être utilisée que dans un environnement de test sécurisé et isolé.

## Support

Si vous rencontrez des problèmes, vérifiez que :
- Node.js et npm sont correctement installés
- Toutes les dépendances sont installées (`npm install`)
- Le port 5173 est disponible

## Licence

Ce projet est destiné à un usage éducatif uniquement.
