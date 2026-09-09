# 🌐 SiteCraft — Créateur de Sites Web Intuitif & Hébergé Localement

SiteCraft est une application web moderne et complète permettant à tout utilisateur non technique de concevoir, modifier et prévisualiser des sites web entièrement fonctionnels, hébergés localement sans aucun déploiement cloud.

---

## 🚀 Démarrage Rapide

### 1. Lancer l'application
Le serveur démarre le backend et sert l'application web complète sur le port **3001** :

```bash
npm start
```

Ou en mode développement (avec rechargement à chaud Vite) :
```bash
npm run dev
```

Ouvrez ensuite votre navigateur sur :
👉 **[http://localhost:3001](http://localhost:3001)**

---

## 🌟 Sites d'Exemple Pré-intégrés (Démo)

L'application est livrée avec **4 sites web complets et ultra réalistes**, directement consultables et modifiables dans l'outil :

1. **🥐 [Atelier Pâtisserie & Café Délice](http://localhost:3001/site/patisserie-delice)**
   - Boulangerie artisanale & salon de thé bio à Paris.
   - *Fonctionnalités* : Carte gourmande avec prix et tags, galerie photos, avis clients 5 étoiles, formulaire de réservation de brunch ou commande personnalisée.
   - *Design* : Typographie classique (Playfair Display), palette chaleureuse ambre & miel, cartes très arrondies.

2. **⚡ [NovaPulse AI — Plateforme d'Intelligence Augmentée](http://localhost:3001/site/novapulse-ai)**
   - Solution SaaS B2B de traitement et d'analyse de données d'entreprise par IA.
   - *Fonctionnalités* : Métriques en temps réel, grille tarifaire interactive avec bascule mensuelle / annuelle (-25%), accordéon FAQ interactif, formulaire de demande de démo d'entreprise.
   - *Design* : Dark mode futuriste indigo & cyan, typographie tech Outfit, bordures épurées.

3. **📷 [Elena Vance — Photographie d'Art & Direction Visuelle](http://localhost:3001/site/elena-vance-photo)**
   - Portfolio d'une photographe de mode et direction artistique entre Paris et Milan.
   - *Fonctionnalités* : Galerie photos avec lightbox plein écran, filtres thématiques (Mode, Portrait, Architecture), prestations sur mesure, formulaire de contact pour shooting.
   - *Design* : Minimalisme éditorial noir & or, typographie soignée serif, angles nets sans arrondi.

4. **🚀 [Sommet Tech & Innovation Paris 2026](http://localhost:3001/site/sommet-tech-2026)**
   - Grande conférence européenne deeptech & intelligence artificielle.
   - *Fonctionnalités* : **Compte à rebours interactif en temps réel** vers la date de l'événement, liste des conférenciers de renom, chiffres clés, billetterie par formules, barre d'inscription newsletter, formulaire sponsors & presse.
   - *Design* : Palette violette & rose vibrante, typographie Space Grotesk.

---

## 🛠️ Fonctionnalités de l'Outil

### 1. Tableau de bord (Dashboard)
- Vue d'ensemble de tous les sites créés avec aperçu visuel, date de mise à jour, état de publication (Publié / Brouillon).
- **Accès direct en un clic** :
  - 👁️ **Visiter** : Ouvre le site hébergé en direct (`/site/:slug`).
  - ✏️ **Modifier** : Ouvre l'éditeur visuel en direct.
  - 📬 **Boîte de réception** : Affiche tous les messages reçus via les formulaires du site avec badge de messages non lus.
  - 📋 **Dupliquer** : Clone instantanément un site existant.
  - 📥 **Exporter en ZIP** : Télécharge une archive autonome prête à être ouverte sans serveur ou hébergée n'importe où.
  - 🗑️ **Supprimer** : Suppression sécurisée avec confirmation.
  - 🔄 **Restaurer les démos** : Permet de réinitialiser à tout moment les 4 sites d'exemple officiels.

### 2. Éditeur Visuel Intuitif (WYSIWYG)
- **Sélecteur d'affichage réactif** :
  - 💻 **Ordinateur** (100%)
  - 📱 **Tablette** (768px)
  - 📱 **Mobile** (375px)
- **Mode Aperçu / Mode Édition** : Bascule instantanée pour masquer les bordures d'outils et tester la navigation comme un visiteur réel.
- **Historique Annuler / Rétablir (Undo / Redo)** : Pour expérimenter sans crainte d'erreur.
- **Ajout de blocs riche et visuel** :
  - En-tête / Barre de navigation
  - Section Hero (Split, Centré, Plein écran avec fond)
  - Fonctionnalités & Services (Grille 2, 3 ou 4 colonnes)
  - À propos / Histoire (Image gauche ou droite, points clés)
  - Galerie photos (Grille avec lightbox plein écran)
  - Carte restaurant / Menu / Catalogue de prestations avec prix
  - Grille tarifaire (avec toggle mensuel / annuel)
  - Avis & Témoignages clients avec étoiles
  - Foire aux questions (FAQ) avec accordéon interactif
  - Compte à rebours interactif (Jours / Heures / Minutes / Secondes)
  - Chiffres clés / Statistiques
  - Formulaire de contact / Réservation
  - Inscription newsletter
  - Bannière d'appel à l'action (CTA)
  - Pied de page (Footer) avec réseaux sociaux et copyright
- **Gestionnaire d'images complet** :
  - Bibliothèque de photos gratuites haute résolution classées par thématique (Gastronomie, Tech, Mode, Événements, Nature).
  - Téléversement direct de photos depuis son propre ordinateur (stockées localement dans `uploads/`).
  - Lien URL personnalisé.
- **Personnalisation du thème** :
  - Palettes harmonieuses prêtes à l'emploi.
  - Sélecteur de couleurs personnalisées (Primaire, Accent, Arrière-plan, Texte).
  - Choix de typographies (Inter, Playfair Display, Outfit, Space Grotesk, Plus Jakarta Sans).
  - Arrondi des cartes et boutons (Droit, Discret, Moderne, Généreux).

### 3. Hébergement Local & Boîte de Réception Réelle
- Tous les sites sont servis directement par l'application locale sur `http://localhost:3001/site/:slug`.
- Chaque formulaire de contact ou inscription newsletter sur un site hébergé envoie réellement les données au serveur local.
- Le propriétaire du site peut consulter tous ses messages dans la **Boîte de Réception Locale** (nom, email, téléphone, prestation demandée, message, date et heure) avec possibilité de réponse rapide par email ou de suppression.

---

## 📁 Architecture du Projet

```
site-builder/
├── data/
│   ├── sites.json          # Données des sites créés et persistés
│   └── submissions.json    # Messages et formulaires soumis
├── uploads/                # Images téléversées localement
├── server/
│   ├── index.js            # Serveur Express (API + Hébergeur de sites + Fallback SPA)
│   ├── db.js               # Persistance locale JSON avec slugification automatique
│   ├── seedSites.js        # Données détaillées des 4 sites d'exemple
│   ├── siteRenderer.js     # Moteur de rendu HTML autonome ultra rapide & interactif
│   └── routes/
│       ├── sites.js        # CRUD, duplication et export ZIP
│       ├── submit.js       # Gestion des formulaires de contact & boîte de réception
│       └── upload.js       # Téléversement d'images locales (Multer)
├── client/                 # Interface React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/     # Composants UI, Modales, Drawer d'édition
│   │   ├── pages/          # Dashboard et Éditeur visuel
│   │   └── data/           # Palettes de thèmes et bibliothèque d'images
│   └── dist/               # Fichiers de production compilés servis par le serveur
└── README.md
```
