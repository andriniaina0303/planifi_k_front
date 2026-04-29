# 📊 PlanifiK - Documentation Complète du Projet

## 🎯 Vue d'ensemble

**PlanifiK** est une plateforme web d'analyse de campagnes d'emailing/advertising construite avec **React 18 + Vite**. Elle permet de visualiser, analyser et segmenter les contacts à partir de plusieurs bases de données.

### Caractéristiques principales
- 📈 Dashboard avec KPIs (Sends, Opens, Clicks, Unsubs, eCPM, CA)
- 📊 Graphiques et visualisations interactives (Chart.js)
- 🔍 Recherche et filtrage avancé des annonceurs
- 📋 Module de comptage/segmentation de contacts
- 🏥 Indicateur de "santé" des campagnes (score 0-100)
- 🎨 Interface responsive (Desktop/Mobile avec Bootstrap + Ant Design)
- 🔐 Authentification JWT avec intercepteurs Axios

---

## 📁 Architecture des dossiers

```
src/
├── main.jsx                    # Point d'entrée React
├── App.jsx                     # Routeur principal (React Router)
├── api/                        # Appels API et intercepteurs
│   ├── interceptor.js         # Instance Axios avec JWT + gestion erreurs
│   ├── advertiser.js          # API des annonceurs (mock/réel)
│   └── databases.js           # API des bases (cache localStorage)
├── config/                     # Configuration centralisée
│   └── config.js              # Endpoints API
├── pages/                      # Pages principales
│   ├── Home/Home.jsx          # Layout avec sidebar
│   ├── Login/Login.jsx        # Page de connexion
│   ├── Counting/Counting.jsx  # Module de comptage
│   └── Reporting/
│       ├── Advertisers.jsx    # Dashboard annonceurs
│       ├── AdvertiserDetail.jsx # Détails d'un annonceur
│       └── Databases.jsx      # Gestion bases (placeholder)
├── components/                 # Composants réutilisables
│   ├── chart/                 # Graphiques (Chart.js)
│   ├── table/                 # Tableaux de données
│   ├── filter/                # Composants de filtrage
│   ├── menu/                  # Navigation (sidebar)
│   ├── Kpi/                   # Cartes KPI
│   ├── healthComponents/      # Indicateur de santé
│   ├── details/               # Détails et visualisations
│   └── ...autres composants
├── utils/                      # Fonctions utilitaires
│   ├── Tokens.js              # Design tokens (couleurs, shadows)
│   ├── Helpers.js             # Formatage (fmt, pct, usd)
│   ├── healthKitFunc.js       # Calcul score de santé
│   └── utils.jsx              # Décodage Base64 et mojibake
├── assets/                     # Ressources statiques
│   ├── css/                   # Stylesheets
│   └── images/                # Images
├── data/                       # Données statiques
│   └── listetags.js          # Liste des 97 tags disponibles
└── temp/                       # Données mock JSON
    ├── all_advertiser.json
    └── adv_detail.json
```

---

## 🚀 Flux de données principal

### 1️⃣ Initialisation
```
main.jsx 
  ↓
App.jsx (React Router setup)
  ↓
BrowserRouter → Routes
```

### 2️⃣ Navigation
- Route `/login` → LoginPage
- Route `/` → Home (avec Outlet pour sous-routes)
  - `/reporting/advertisers` → Advertisers (dashboard)
  - `/reporting/advertisers/:id` → AdvertiserDetail
  - `/reporting/database` → Databases
  - `/counting` → Counting (segmentation)

### 3️⃣ Chargement des données
```
Component useEffect
  ↓
get_liste_advertisers() / get_advertisers_detail(id)
  (via src/api/advertiser.js)
  ↓
api.get() ← interceptor.js (ajoute token)
  ↓
Backend (ou mock JSON si USE_MOCK=true)
  ↓
Mise à jour du state React → Re-render
```

### 4️⃣ Gestion du cache
- `get_all_databases()` met en cache pour 1 heure
- Si le cache est valide : return immédiat
- Si expiré : appel API + refresh du cache
- Mode fallback : si erreur API, retourne le cache expiré

---

## 🔑 Concepts clés

### Mode Mock vs Production
```javascript
// Dans src/api/advertiser.js et databases.js
const USE_MOCK = true;  // true = données locales (dev)
                         // false = appels API réels
```

### Design Tokens
Centralisés dans `src/utils/Tokens.js` :
- **Couleurs** : primary, success, warning, danger, info, cyan, pink, orange, purple
- **Ombres** : shadow, shadowMd, shadowLg
- **Dégradés** : headerGradient (violet → rose)
- **Espacement** : cardRadius (16px)

### Formatage de données
Utilitaires dans `src/utils/Helpers.js` :
- `fmt(value)` → "1 234 567" (nombres avec séparateurs)
- `pct(value)` → "10.57%" (pourcentages)
- `usd(value)` → "15.57" (montants)

### Score de santé (Health Score)
Calcul dans `src/utils/healthKitFunc.js` :
- **Open Rate** (35 pts) : > 15% = 35, > 10% = 25, > 5% = 15, ≤ 5% = 5
- **CTR** (35 pts) : > 3% = 35, > 1.5% = 25, > 0.5% = 15, ≤ 0.5% = 5
- **Unsub Rate** (30 pts, inverse) : < 0.1% = 30, < 0.3% = 20, < 0.5% = 10, ≥ 0.5% = 0
- **Total** : 0-100 pts
- **Couleurs** : >= 75 (vert), >= 50 (jaune), >= 25 (orange), < 25 (rouge)

### Intercepteurs Axios
Dans `src/api/interceptor.js` :

**Request Interceptor** :
- Récupère le token du localStorage
- L'ajoute au header `Authorization: Bearer <token>`

**Response Interceptor** :
- Vérifie `authenticated === false` → logout
- Gère les codes HTTP (401, 403, 404, 500)
- Ignore les erreurs de type `blob` (téléchargements)

---

## 📊 Pages principales

### 1️⃣ Advertisers (`/reporting/advertisers`)
**Dashboard des annonceurs**
- Affiche les KPIs globaux (Sends, Openers, Clickers, Unsubs, CTR)
- Filtrage par : annonceur, taux_clickers, taux_unsubs, minSends
- Tri par : sends, openers, clickers, unsubs, taux_clickers, eCPM, ca
- Graphiques : ChartSwitcher (top sends, openers vs clickers), TopTagsEcpm
- Tableau interactif : AdvertisersTable avec recherche et tags

### 2️⃣ AdvertiserDetail (`/reporting/advertisers/:id`)
**Page de détails complet d'un annonceur**
- Header avec informations globales et score de santé
- Onglets :
  - **Global** : KPIs détaillés, analyse, dimensions
  - **Bases** : Liste des bases associées avec classifications (A/B/C/D)
  - **Dimensions** : Breakdown par segments (genres, tranches d'âge, etc.)
- Charts : graphiques détaillés pour chaque métrique
- Tables : données détaillées avec export possible

### 3️⃣ Counting (`/counting`)
**Module de segmentation/comptage**
- Sélection de la base de données
- Critères de filtrage :
  - Localisation : départements et codes postaux (parsing libre)
  - Profil : genre, tranches d'âge, opt-in email
  - ISP : fournisseurs d'accès internet
  - Scores : revenu médian, propriétaires, pauvreté, CSP
- Soumission : appel API pour compter les contacts matchant
- Visualisation : graphiques de répartition (pie chart, bar chart)

### 4️⃣ Databases (`/reporting/database`)
**Gestion des bases de données**
- Actuellement : placeholder
- À développer : liste, créer, modifier, supprimer des bases

### 5️⃣ Login (`/login`)
**Page de connexion**
- Credentials temporaires : `user@example.com` / `123456`
- À intégrer : vraie authentification JWT backend

---

## 🎨 Composants réutilisables

### Graphiques (`/components/chart/`)
- **ChartSwitcher** : Graphiques navigables (Chart.js)
- **AdvertiserDetailChart** : Graphiques détaillés (Chart.js)
- **TopTagsEcpm** : Top annonceurs par eCPM
- **GenderPieChart** : Distribution genre (pie chart)
- **DashboardCharts** : Graphiques du dashboard

### Tableaux (`/components/table/`)
- **AdvertisersTable** : Tableau complet avec recherche et tags
- **GlobalTable** : Tableau détaillé dans AdvertiserDetail

### Filtres (`/components/filter/`)
- **FilterAdvertiser** : Critères de filtrage (débouchés)
- **FiltersBar** : Barre de filtres
- **RangeFilter** : Sliders pour plages
- **ScoreFilter** : Filtres de score

### Menus (`/components/menu/`)
- **SideBarContent** : Navigation sidebar
- **ReportingMenu** : Menu reporting
- **CountingMenuItem** : Items du menu Counting

### Autres
- **KpiCard** : Carte KPI simple
- **KpiCardAdvertiserDetail** : KPI détaillée
- **HealthKit** : Indicateur de santé (jauge + détails)
- **MultiSelect** : Sélecteur multiple
- **CountryMultiSelect** : Sélecteur de pays

---

## 🔐 Authentification

### Flow actuel
1. User remplit email/password
2. LoginPage compare avec credentials locales (temporaire)
3. Stockage du token dans localStorage
4. interceptor.js ajoute `Authorization: Bearer <token>` à chaque requête

### À améliorer
- Connecter à une vraie API d'authentification
- Gérer l'expiration du token (refresh token)
- Implémenter un logout avec suppression du token

---

## ⚙️ Configuration

### Backend
Dans `src/config/config.js` :
```javascript
const REACT_APP_ENDPOINT = "http://127.0.0.1:8000"

export const REACT_APP_ENDPOINT_ALL_ADVERTISERS = "/reporting/all_advertisers"
export const REACT_APP_ENDPOINT_ADVERTISER_DETAIL = "/reporting/advertiser/"
export const REACT_APP_ENDPOINT_ALL_DATABASES = "/database"
export const REACT_APP_ENDPOINT_ALL_SEGMENT = "/segment"
```

### Vite
Dans `vite.config.js` :
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Écoute sur toutes les interfaces
    port: 5173,  // Port dev
  },
})
```

---

## 📦 Dépendances principales

- **react** : Framework UI
- **react-router-dom** : Routage
- **antd** : Composants UI (Ant Design)
- **axios** : Client HTTP
- **chart.js** : Graphiques
- **bootstrap** : Framework CSS responsive
- **react-icons** : Icônes

---

## 🚀 Démarrage du développement

```bash
# Installer les dépendances
npm install

# Lancer le dev server (port 5173)
npm run dev

# Builder pour production
npm run build

# Lint et fix
npm run lint
```

---

## 📝 Conseils de développement

### Mode Mock
Pour développer sans backend :
1. Activer `USE_MOCK = true` dans `src/api/advertiser.js` et `databases.js`
2. Les données viendront des fichiers JSON dans `src/temp/`

### Ajouter une nouvelle page
1. Créer le fichier dans `src/pages/`
2. L'importer dans `App.jsx`
3. Ajouter la route dans `<Routes>`

### Ajouter un composant
1. Créer le dossier dans `src/components/`
2. L'exporter depuis le composant parent
3. Passer les props nécessaires

### Encodage de données
Si vous recevez du texte mal encodé :
```javascript
import { decodeBase64 } from "../../utils/utils";
const decoded = decodeBase64(base64String);
```

### Cache
Forcer un refresh du cache :
```javascript
const data = await get_all_databases(true);  // forceRefresh = true
```

---

## 🐛 Troubleshooting

**401 Non authentifié** :
- Vérifier que le token est en localStorage
- Vérifier que le backend accepte le format `Bearer <token>`

**Données mock affichées au lieu des données réelles** :
- Vérifier `USE_MOCK` dans `src/api/*`

**Caractères mal encodés (Ã©, ðŸ, etc.)** :
- Vérifier l'encodage du backend (UTF-8)
- Utiliser `decodeBase64()` si nécessaire

---

## 📞 Notes importantes

- Les credentials de connexion sont temporaires (user@example.com / 123456)
- Mode mock par défaut (USE_MOCK=true) pour développement sans backend
- Cache localStorage pour les bases de données (1 heure)
- Score de santé : agrège 3 critères pour notation 0-100

