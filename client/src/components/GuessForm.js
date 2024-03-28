import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GuessForm.css';
import { auth } from '../firebaseConfig';
import { createExplosionEffect } from './ExplosionEffect';
import { createFlameEffect } from './FlameEffect';


function GuessForm({ gameOverText, setGameOverText, gameActive, setGameActive, resetTrigger, ajouterOrbes }) {
  const uid = auth.currentUser?.uid;  
  const [word, setWord] = useState('');
    const [temperature, setTemperature] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [devinImage, setDevinImage] = useState('');
    const [devinBanner, setDevinBanner] = useState('');
    const [hasWordBeenSubmitted, setHasWordBeenSubmitted] = useState(false); // Nouvelle variable d'état
    const [submittedWords, setSubmittedWords] = useState([]); // Ajout pour stocker les mots soumis
    const [multiplier, setMultiplier] = useState(5); // Nouveau multiplicateur de score
    const [hasFoundConfirmedWord, setHasFoundConfirmedWord] = useState(false);
    const MAX_ATTEMPTS = 10;
    const PENALITE_PAR_TENTATIVE = 10; // Pénalité pour chaque tentative
    const [orbes, setOrbes] = useState({
        novice: 0,
        apprenti: 0,
        confirme: 0,
        expert: 0,
        maitre: 0
      });

    useEffect(() => {
        if (!gameActive) return; // S'assure que la réinitialisation se fait seulement si le jeu est actif

        setAttempts(0);
        setWord('');
        setTemperature('');
        setDevinImage('');
        setDevinBanner('');
        setHasWordBeenSubmitted(false); // Réinitialiser l'état de soumission du mot
        setSubmittedWords([]); // Vide la liste des mots soumis
        setHasFoundConfirmedWord(false); //Reinitialise l'etat confirme pour recuperation du butin
        setMultiplier(5); // Réinitialise le multiplicateur pour une nouvelle partie
        setOrbes({
          novice: 0,
          apprenti: 0,
          confirme: 0,
          expert: 0,
          maitre: 0
        });
    }, [gameActive, resetTrigger]);

    const handleTemperatureToImage = (temperature) => {
        if (temperature >= 90) return '/assets/devins/maitre.png';
        if (temperature >= 65) return '/assets/devins/expert.png';
        if (temperature >= 45) return '/assets/devins/confirme.png';
        if (temperature >= 20) return '/assets/devins/apprenti.png';
        return '/assets/devins/novice.png';
    };

    const handleTemperatureToBanner = (temperature) => {
      if (temperature >= 90) return '/assets/devins/banniere-maitre.png';
      if (temperature >= 65) return '/assets/devins/banniere-expert.png';
      if (temperature >= 45) return '/assets/devins/banniere-confirme.png';
      if (temperature >= 20) return '/assets/devins/banniere-apprenti.png';
      return '/assets/devins/banniere-novice.png';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gameActive) return; // Empêche les soumissions si le jeu est terminé
    const newAttempts = attempts + 1;
    const newMultiplier = Math.max(1, 5 - Math.floor((newAttempts - 1) / 2)); // Ajuste le multiplicateur
    setAttempts(newAttempts);
    setHasWordBeenSubmitted(true); // Mettre à jour l'état pour indiquer qu'un mot a été soumis
    setMultiplier(newMultiplier);
  
    try {
        const response = await axios.post('http://localhost:5000/guess', { word });
        const temp = response.data.temperature;
        
        // Logique existante pour le calcul du score ajustée avec le multiplicateur

        if (temp >= 90) {
            // Si un mot de température élevée est trouvé, on ne termine pas la partie immédiatement,
            // mais on continue jusqu'à ce que le nombre maximum de tentatives soit atteint
            // ou que le mot secret soit trouvé.
            setHasFoundConfirmedWord(true); // Active la récupération du butin si un mot de température élevée a été trouvé
            createExplosionEffect('maître');
        } else if (temp >= 65) {
            setHasFoundConfirmedWord(true); // Active la récupération du butin si un mot confirmé ou supérieur a été trouvé
            createFlameEffect();
        } else if (temp >= 45) {
            setHasFoundConfirmedWord(true); // Active la récupération du butin si un mot confirmé ou supérieur a été trouvé
            createExplosionEffect('confirmé');
        }

        // Nouvelle logique pour attribuer des orbes basée sur la température
        const newOrbes = { ...orbes };
        if (temp > 99) newOrbes.maitre += 1;
        else if (temp >= 65) newOrbes.expert += 1;
        else if (temp >= 45) newOrbes.confirme += 1;
        else if (temp >= 20) newOrbes.apprenti += 1;
        else newOrbes.novice += 1;
        setOrbes(newOrbes);

        let orbeType = '';
        if (temp > 99) orbeType = 'maitre';
        else if (temp >= 65) orbeType = 'expert';
        else if (temp >= 45) orbeType = 'confirme';
        else if (temp >= 20) orbeType = 'apprenti';
        else orbeType = 'novice';

        setTemperature(`Votre niveau de devin est : ${temp}%`);
        setDevinImage(handleTemperatureToImage(temp));
        setDevinBanner(handleTemperatureToBanner(temp));
        setWord('');

        // Ajout du mot soumis et du score au tableau des mots soumis
        setSubmittedWords(prevWords => [...prevWords, { word, orbeType, temp }]);

        if (temp === 100) {
            const finalMessage = (
                <>
                    Félicitations ! Vous avez récupéré des orbes :<br />
                    {newOrbes.novice} <img src="/assets/orbes/orbe-novice.png" alt="Orbe de novice" style={{ width: '30px', marginRight: '40px' }} />  
                    {newOrbes.apprenti} <img src="/assets/orbes/orbe-apprenti.png" alt="Orbe d'apprenti" style={{ width: '30px', marginRight: '40px' }} />  
                    {newOrbes.confirme} <img src="/assets/orbes/orbe-confirme.png" alt="Orbe de confirmé" style={{ width: '30px', marginRight: '40px' }} />  
                    {newOrbes.expert} <img src="/assets/orbes/orbe-expert.png" alt="Orbe d'expert" style={{ width: '30px', marginRight: '40px' }} />  
                    {newOrbes.maitre} <img src="/assets/orbes/orbe-maitre.png" alt="Orbe de maître" style={{ width: '30px', marginRight: '40px' }} />
                </>
            );
            setGameActive(false); // Désactive le jeu
            setGameOverText(finalMessage);
            // Utiliser ajouterOrbes pour mettre à jour le total des orbes dans App.js
            ajouterOrbes(uid, newOrbes);
        } else if (newAttempts >= MAX_ATTEMPTS) {
            // Si le nombre maximum de tentatives est atteint, on termine la partie.
            const finalMessage = hasFoundConfirmedWord ? (
                <>
                    Félicitations ! Vous avez récupéré des orbes :<br />
                    {newOrbes.novice} <img src="/assets/orbes/orbe-novice.png" alt="Orbe de novice" style={{ width: '30px', marginRight: '40px' }} />  
                    {newOrbes.apprenti} <img src="/assets/orbes/orbe-apprenti.png" alt="Orbe d'apprenti" style={{ width: '30px', marginRight: '40px' }} />  
                    {newOrbes.confirme} <img src="/assets/orbes/orbe-confirme.png" alt="Orbe de confirmé" style={{ width: '30px', marginRight: '40px' }} />  
                    {newOrbes.expert} <img src="/assets/orbes/orbe-expert.png" alt="Orbe d'expert" style={{ width: '30px', marginRight: '40px' }} />  
                    {newOrbes.maitre} <img src="/assets/orbes/orbe-maitre.png" alt="Orbe de maître" style={{ width: '30px', marginRight: '40px' }} />
                </>
            ) : `Dommage ! Vous n'avez pas trouvé de mot de niveau confirmé ou supérieur. Le mot secret était : ${response.data.secretWord}.`;
            setGameActive(false); // Désactive le jeu
            setGameOverText(finalMessage);
            // Utiliser ajouterOrbes pour mettre à jour le total des orbes dans App.js
            ajouterOrbes(uid, newOrbes);
        }
        
    } catch (error) {
        console.error('Erreur lors de la soumission :', error);
    }
};
    return (
        <div className="guess-form-container">
            <form onSubmit={handleSubmit} className="form-wrapper">
                <input
                    type="text"
                    className="input-field"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Entrez votre mot"
                    required
                    disabled={!gameActive || attempts >= MAX_ATTEMPTS}
                />
                <button
                    type="submit"
                    className="guess-button"
                    disabled={!gameActive || attempts >= MAX_ATTEMPTS}
                >
                    Deviner
                </button>
            </form>
            {!gameActive &&
              <div className="game-over-animation">{gameOverText}</div>
            }
            <div className="game-display">
              {devinImage && (
                  <div className="devin-banner-container" key={new Date().getTime()}>  {/* Clé unique pour forcer la réanimation*/}
                      <img
                          src={devinImage}
                          alt="Niveau du devin"
                          className="devin-image"
                      />      
                      {devinBanner && (
                          <img
                              src={devinBanner} // Assurez-vous que bannerImage est correctement défini dans votre état
                              alt="Bannière du niveau"
                              className="banner-image"
                          />
                      )}
                  </div>
              )}
              {hasWordBeenSubmitted && ( // Afficher le tableau seulement si un mot a été soumis 
                submittedWords.length > 0 && (
                  <div className="score-table-container">
                    <table className="score-table">
                      <thead>
                        <tr>
                          <th>N°</th>
                          <th>Mot</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submittedWords.map((entry, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{entry.word}</td>
                              <td>{entry.temp}°   <img src={`/assets/orbes/orbe-${entry.orbeType}.png`} alt={`Orbe de ${entry.orbeType}`} style={{ width: '30px' }}/></td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
        </div>
    );
}

export default GuessForm;



