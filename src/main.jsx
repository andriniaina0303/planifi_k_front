/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIN.JSX - Point d'entrée de l'application React
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Fichier racine qui initialise l'application :
 * 1. Crée la racine React DOM
 * 2. Charge les dépendances CSS (Ant Design + Bootstrap)
 * 3. Enveloppe l'app avec StrictMode pour les avertissements de développement
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'; // Version récente d'Ant Design recommande 'reset.css'

import App from './App.jsx'
// Bootstrap CSS et JS pour composants responsive
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

/**
 * Initialise l'application React
 * - Trouve l'élément #root dans index.html
 * - Active StrictMode pour détecter les problèmes potentiels
 * - Rend le composant App et ses enfants
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
