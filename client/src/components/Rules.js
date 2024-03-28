import React from 'react';
import './Rules.css'; // Assurez-vous d'importer le fichier CSS

function Rules() {
  return (
    <div className="rules-page-container">
      <div className="rules-container">
        <h2>Règles du Jeu</h2>
        <p>
          <strong className="keyword">Trouver le mot secret</strong> est l'objectif principal du jeu. Tu proposes des mots et reçois des <strong className="keyword">indices</strong> qui t'indiquent à quel point tu es proche du mot secret. Plus ta proposition est <strong className="keyword">proche</strong> du mot secret, plus tu accumules des <strong className="keyword">orbes magiques</strong>.
        </p>
        <p>
          Ces <strong className="keyword">orbes</strong> sont précieuses car elles te permettent d'obtenir des <strong className="keyword">aides</strong>, comme révéler des lettres du mot secret ou ajouter des tentatives supplémentaires. La partie se termine quand le mot secret est trouvé ou que toutes les tentatives sont épuisées.
        </p>
        {/* Exemples avec images */}
        <div className="image-examples">
            <img src="/assets/screenshots-jeu/screen-1.png" alt="Conditions de victoire" className="screenshot" />
            <p>La <strong className="keyword">victoire</strong> est atteinte en décodant le mot secret avec astuce et stratégie.</p>
            <img src="/assets/screenshots-jeu/screen-2.png" alt="Conditions de défaite et orbes" className="screenshot" />
            <p>En cas de <strong className="keyword">défaite</strong>, si toutes les tentatives sont épuisées sans avoir trouvé un mot de niveau <strong className="keyword">confirmé</strong> ou supérieur, le jeu prend fin sans que les orbes collectées ne soient conservées. Cette règle souligne l'importance de la stratégie et de la réflexion dans le choix des mots pour maximiser tes chances de réussite.</p>
        </div>
      </div>
    </div>
  );
}

export default Rules;
