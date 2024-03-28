// Game.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import GuessForm from './GuessForm';
import './Game.css'; // Assurez-vous que les styles sont définis correctement dans Game.css

function Game({ triggerNewGame, setTriggerNewGame, ajouterOrbes }) {
    const navigate = useNavigate();
    const [gameActive, setGameActive] = useState(true);
    const [gameOverText, setGameOverText] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) navigate('/login');
        });
        return unsubscribe;
    }, [navigate]);

    useEffect(() => {
        if (triggerNewGame) {
            startNewGame();
            setTriggerNewGame(false); // Réinitialise le trigger après le démarrage d'une nouvelle partie
        }
    }, [triggerNewGame, setTriggerNewGame]);

    // Fonction pour démarrer une nouvelle partie
    const startNewGame = () => {
        fetch('http://localhost:5000/new-game')
            .then(response => response.json())
            .then(data => {
                // Ici, on peut mettre à jour l'état du jeu avec les données reçues si nécessaire
                setGameActive(true);
                setGameOverText('');
                // Logique supplémentaire basée sur la réponse du serveur
                console.log("Nouvelle partie démarrée:", data);
            })
            .catch(error => {
                console.error('Erreur lors de la demande de nouvelle partie:', error);
            });
    };

    return (
        <div className="game-layout">
            <GuessForm gameActive={gameActive} setGameActive={setGameActive} gameOverText={gameOverText} setGameOverText={setGameOverText} resetTrigger={triggerNewGame} ajouterOrbes={ajouterOrbes} />
        </div>
    );
}

export default Game;