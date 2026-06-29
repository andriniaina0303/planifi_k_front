# 📚 Résumé de la Documentation du Projet PlannifiK

## Mise à jour du résumé

Date : 25 juin 2026  
Base : `src/`  
Fichiers source détectés : **90** (JS / JSX / TS / TSX)

---

## Structure du projet `src/`

### Entrée et configuration
- `src/main.jsx` — point d'entrée React / Vite
- `src/App.jsx` — application principale, routing et layout global
- `src/App.css` — styles applicatifs
- `src/index.css` — styles globaux
- `src/config/config.js` — configuration API et endpoints

### API
- `src/api/interceptor.js` — intercepteurs Axios, JWT, gestion d'erreurs
- `src/api/advertiser.js` — données annonceurs
- `src/api/databases.js` — données bases de données
- `src/api/recommend.js` — recommandations / service additionnel

### Pages
- `src/pages/Login/Login.jsx` — page de connexion
- `src/pages/Home/Home.jsx` — page d'accueil
- `src/pages/Counting/Counting.jsx` — page Counting / métriques
- `src/pages/Reporting/Advertisers/Advertisers.jsx` — liste des annonceurs
- `src/pages/Reporting/Advertisers/AdvertiserDetail.jsx` — détail annonceur
- `src/pages/Reporting/Advertisers/AdvertiserDetailBackup.jsx` — version backup / alternative
- `src/pages/Reporting/Databases/Databases.jsx` — page bases de données
- `src/pages/Reporting/Databases/DatabaseDetails.jsx` — détails base de données
- `src/pages/Reporting/Seasonality/Seasonality.jsx` — reporting saisonnalité

### Menu et navigation
- `src/components/menu/SideBarContent.jsx` — sidebar principale
- `src/components/menu/ReportingMenu.jsx` — menu reporting
- `src/components/menu/CountingMenuItem.jsx` — menu Counting
- `src/components/bouton/MenuItem.jsx` — bouton de menu
- `src/components/bouton/SubMenuItem.jsx` — bouton sous-menu
- `src/components/bouton/SwitchBtnTableChart.jsx` — switch tableau / chart

### Filtres et sélecteurs
- `src/components/filter/FilterReporting.jsx` — filtre principal reporting
- `src/components/filter/FiltersBar.jsx` — barre de filtres
- `src/components/filter/RangeFilter.jsx` — filtre plage numérique
- `src/components/filter/ScoreFilter.jsx` — filtre score
- `src/components/other/MultiSelect.jsx` — sélection multiple
- `src/components/other/CountryMultiSelect.jsx` — sélection pays
- `src/components/other/GlobalInsights .jsx` — graphique insights global (nom de fichier à vérifier)

### KPI
- `src/components/Kpi/KpiCardReporting.jsx` — carte KPI reporting
- `src/components/Kpi/KpiCardAdvertiserDetail.jsx` — carte KPI détail annonceur

### Charts
- `src/components/chart/ChartSwitcher.jsx` — commutateur de graphiques
- `src/components/chart/DashboardCharts.jsx` — graphiques dashboard
- `src/components/chart/GenderPieChart.jsx` — diagramme genre
- `src/components/chart/RecommendationPanel.jsx` — panneau recommandations
- `src/components/chart/ReportingDetailsChart.jsx` — chart détails reporting
- `src/components/chart/TopDBEcpm.jsx` — top eCPM par base
- `src/components/chart/TopDBTags.jsx` — top tags base
- `src/components/chart/TopTagsEcpm.jsx` — top tags eCPM

### Détails et tables
- `src/components/details/GlobalOverView.jsx` — aperçu global
- `src/components/details/GlobalTable.jsx` — tableau global
- `src/components/details/common/AnalyseBadge.jsx` — badge analyse
- `src/components/details/common/CreateColsTop.jsx` — création colonnes top
- `src/components/details/common/createMergedColumns.jsx` — colonnes fusionnées
- `src/components/details/common/DimSection.jsx` — section dimensions
- `src/components/details/common/Exportadvertiser.jsx` — export annonceur
- `src/components/details/common/ExportBase.jsx` — export base
- `src/components/details/common/FunnelViz.jsx` — visualisation funnel
- `src/components/details/common/RateBar.jsx` — barre de taux
- `src/components/details/brands/CreateColumns.jsx` — colonnes marques
- `src/components/details/brands/DimensionsCollaps.jsx` — dimensions collapsibles

### Tableaux
- `src/components/table/ReportingTable.jsx` — tableau reporting
- `src/components/table/SeasonalTable.jsx` — tableau saisonnalité

### Utilitaires
- `src/utils/Helpers.js` — utilitaires généraux
- `src/utils/Tokens.js` — design tokens
- `src/utils/healthKitFunc.js` — calculs de santé campagne
- `src/utils/batchFiltersDating.js` — batchs filtres
- `src/utils/getDataKeys.js` — extraction de clés
- `src/utils/getSegmentID.js` — récupération ID segment
- `src/utils/getSegmentRecomd.jsx` — recommandation segment
- `src/utils/getStatusDots.jsx` — indicateurs de statut
- `src/utils/storedZustand.js` — stockage Zustand
- `src/utils/utils.jsx` — utilitaires divers

### Données / temporaires
- `src/data/listetags.js` — tags
- `src/data/testadv.js` — données test
- `src/temp/adv_detail.json` — données temporaires annonceur
- `src/temp/all_advertiser.json` — données temporaires annonceurs

### Sous-projet FranceMap
- `src/FranceMap/App.css`
- `src/FranceMap/index.css`
- `src/FranceMap/main.tsx`
- `src/FranceMap/MapApp.tsx`
- `src/FranceMap/MIGRATION_STATUS.md`
- `src/FranceMap/TAILWIND_TO_BOOTSTRAP_MIGRATION.md`
- fichiers `src/FranceMap/components/...`
- fichiers `src/FranceMap/hooks/...`
- fichiers `src/FranceMap/services/...`
- fichiers `src/FranceMap/utils/...`

---

## Notes importantes

- Le projet contient maintenant **90 fichiers source** détectés dans `src/`.
- La structure Reporting est plus complète que le résumé précédent : il y a des dossiers `Advertisers`, `Databases`, `Seasonality`.
- `src/components/other/GlobalInsights .jsx` contient un espace dans le nom de fichier. Vérifier si ce fichier doit être renommé.
- `src/pages/Reporting/Advertisers/AdvertiserDetailBackup.jsx` est présent et doit être documenté si utilisé.
- `src/api/recommend.js` est un nouveau service API à intégrer dans la documentation.
- `src/components/bouton/SwitchBtnTableChart.jsx` et `src/components/Kpi/KpiCardReporting.jsx` sont des composants récents.

---

## Recommandations immédiates

1. Vérifier le contenu et l’usage de `src/components/other/GlobalInsights .jsx`.
2. Documenter séparément les pages `Reporting/Seasonality` et `Reporting/Databases/DatabaseDetails.jsx`.
3. Mettre à jour le décompte de fichiers commentés basé sur le nouveau total de 90.
4. Ajouter une section FranceMap si ce sous-projet doit rester dans le résumé principal.

---

## Statistiques actualisées

- **Fichiers source détectés** : 90
- **Sous-dossiers principaux** : `api`, `components`, `config`, `data`, `pages`, `temp`, `utils`, `FranceMap`
- **Pages Reporting** : 9 fichiers principaux
- **Composants chart** : 8 fichiers
- **Composants détails** : 12 fichiers
- **Utilitaires** : 10 fichiers

---

## Résumé rapide

- ✅ Résumé aligné avec l’état actuel du projet.
- ✅ Nouveaux fichiers et dossiers identifiés.
- ⚠️ Deux éléments à valider : `GlobalInsights .jsx` et le dossier `FranceMap`.
- 💡 Le résumé doit désormais refléter 90 fichiers source plutôt que 47.

---

*Documentation mise à jour le 25 juin 2026*
