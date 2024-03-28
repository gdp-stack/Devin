import React from 'react';
import './Marche.css';

function Marche() {
  // Ajoutez ici la logique pour lister les items disponibles sur le marché

  return (
    <div className="marche-container">
      <h2>Marché</h2>
      <section className="section boosts">
        <h3>Boosts et Avantages</h3>
        {/* Liste des boosts */}
      </section>
      
      <section className="section personnalisation">
        <h3>Personnalisation</h3>
        {/* Options de personnalisation */}
      </section>
      
      <section className="section exclusivites">
        <h3>Exclusivités</h3>
        {/* Items exclusifs */}
      </section>
      
      <section className="section utiliser">
        <h3>Comment Dépenser</h3>
        <p>Guide étape par étape...</p>
      </section>
    </div>
  );
}

export default Marche;
