import React from "react";
import "../../assets/css/sidebar.css";

// Composant MenuItem : un bouton de menu réutilisable
// Props reçues :
// - icon : une icône React (renommée en Icon)
// - label : texte affiché
// - onClick : action quand on clique
// - color : couleur de l’icône
const MenuItem = ({ icon: Icon, label, onClick, color }) => (
  <button
    // Classes Bootstrap + custom CSS
    className="menu-btn w-100 text-start d-flex align-items-center gap-3 mb-1"
    
    // Action au clic
    onClick={onClick}
  >
    {/* Icône dynamique passée en props */}
    <Icon
      className="menu-icon"
      style={{ color }} // couleur personnalisée
    />

    {/* Texte du menu */}
    <span>{label}</span>
  </button>
);

export default MenuItem;