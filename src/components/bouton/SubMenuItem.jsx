import React from "react";
import "../../assets/css/sidebar.css";

// Composant SubMenuItem : bouton utilisé dans les sous-menus
// Props :
// - icon : icône React (renommée en Icon pour être utilisée comme composant)
// - label : texte affiché
// - onClick : fonction appelée lors du clic
// - color : couleur de l'icône
const SubMenuItem = ({ icon: Icon, label, onClick, color }) => (
  <button
    // Classe CSS pour styliser un item de sous-menu
    // - submenu-btn : style custom (plus petit / indenté)
    // - w-100 : largeur 100%
    // - text-start : alignement à gauche
    // - d-flex : flexbox
    // - align-items-center : centrage vertical
    // - gap-2 : espace entre icône et texte
    // - mb-1 : marge en bas
    className="submenu-btn w-100 text-start d-flex align-items-center gap-2 mb-1"

    // Action déclenchée au clic
    onClick={onClick}
  >
    {/* Icône du sous-menu */}
    <Icon
      size={14} // taille réduite (plus petit que MenuItem)
      style={{ color }} // couleur personnalisée passée en props
    />

    {/* Texte du sous-menu */}
    <span>{label}</span>
  </button>
);

export default SubMenuItem;