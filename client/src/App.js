import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Game from './components/Game';
import Login from './components/Login';
import Signup from './components/Signup';
import Rules from './components/Rules';
import Classement from './components/Classement';
import Marche from './components/Marche';
import './App.css';

function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [triggerNewGame, setTriggerNewGame] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            setUser(user);
            if (user) {
                // Récupération des orbes depuis Firestore
                const userRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setOrbesAccumulees(userData.orbes);
                } else {
                    console.log("Document utilisateur non trouvé");
                }
            }
        });
        return () => unsubscribe();
    }, []);
    
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/login");
            console.log("User signed out successfully");
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    };

    const toggleNewGame = () => {
        setTriggerNewGame(prev => !prev);
        navigate("/game");
    };

    const [orbesAccumulees, setOrbesAccumulees] = useState({
        novice: 0,
        apprenti: 0,
        confirme: 0,
        expert: 0,
        maitre: 0,
    });
    
    const ajouterOrbes = async (uid, orbes) => {
        // Mise à jour de l'état local
        setOrbesAccumulees(prevOrbes => {
            const nouvellesOrbes = {
                novice: prevOrbes.novice + orbes.novice,
                apprenti: prevOrbes.apprenti + orbes.apprenti,
                confirme: prevOrbes.confirme + orbes.confirme,
                expert: prevOrbes.expert + orbes.expert,
                maitre: prevOrbes.maitre + orbes.maitre,
            };
    
            // Mise à jour dans Firestore
            if (uid) {
                const userRef = doc(firestore, 'users', uid);
                getDoc(userRef).then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const orbesActuelles = docSnapshot.data().orbes;
                        const updatedOrbes = {
                            novice: orbesActuelles.novice + orbes.novice,
                            apprenti: orbesActuelles.apprenti + orbes.apprenti,
                            confirme: orbesActuelles.confirme + orbes.confirme,
                            expert: orbesActuelles.expert + orbes.expert,
                            maitre: orbesActuelles.maitre + orbes.maitre,
                        };
                        updateDoc(userRef, { orbes: updatedOrbes });
                    }
                });
            }
    
            return nouvellesOrbes;
        });
    };    

    // Appelée quand un utilisateur se connecte ou à la fin d'une partie
    const recupererEtMettreAJourOrbes = async (uid) => {
        const userRef = doc(firestore, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Récupération des orbes actuelles
            const orbesActuelles = userDoc.data().orbes;

            // Mise à jour des orbes avec les valeurs d'orbesAccumulees
            const nouvellesOrbes = {
                novice: orbesActuelles.novice + orbesAccumulees.novice,
                apprenti: orbesActuelles.apprenti + orbesAccumulees.apprenti,
                confirme: orbesActuelles.confirme + orbesAccumulees.confirme,
                expert: orbesActuelles.expert + orbesAccumulees.expert,
                maitre: orbesActuelles.maitre + orbesAccumulees.maitre,
            };

            // Mise à jour du document Firestore
            await updateDoc(userRef, {
                orbes: nouvellesOrbes
            });
        } else {
            console.log("Document utilisateur non trouvé");
        }
    };

    return (
            <div className="App">
                <header className="App-header">
                    <div className="header-content">
                    <img src="/assets/logo/logo-devin.png" alt="Devin Game Logo" className="game-logo" />
                        <h1>Bienvenue sur Devin</h1>
                    </div>
                    <div className="header-controls">
                        {user ? (
                            <>
                                <button onClick={handleSignOut} style={{margin: "10px"}}>Déconnexion</button>
                                <button onClick={toggleNewGame} style={{marginRight: "10px"}}>Nouvelle Partie</button>
                                <Link to="/rules" style={{marginRight: "10px"}}><button>Règles du jeu</button></Link>
                                <Link to="/classement" style={{marginRight: "10px"}}><button>Classement</button></Link>
                                {/*<Link to="/marche" style={{marginRight: "10px"}}><button>Marché</button></Link>*/}
                                <div className="orbes-container">
                                    <div className="orbe-tooltip" title="Orbe de Maître">
                                        <img src="/assets/orbes/stack-orbe-maitre.png" alt="Orbe Maitre" className="orbe-image" />
                                        <span>{orbesAccumulees.maitre}</span>
                                    </div>
                                    <div className="orbe-tooltip" title="Orbe d'Expert">
                                        <img src="/assets/orbes/stack-orbe-expert.png" alt="Orbe Expert" className="orbe-image" />
                                        <span>{orbesAccumulees.expert}</span>
                                    </div>
                                    <div className="orbe-tooltip" title="Orbe de Confirmé">
                                        <img src="/assets/orbes/stack-orbe-confirme.png" alt="Orbe Confirmé" className="orbe-image" />
                                        <span>{orbesAccumulees.confirme}</span>
                                    </div>
                                    <div className="orbe-tooltip" title="Orbe d'Apprenti">
                                        <img src="/assets/orbes/stack-orbe-apprenti.png" alt="Orbe Apprenti" className="orbe-image" />
                                        <span>{orbesAccumulees.apprenti}</span>
                                    </div>
                                    <div className="orbe-tooltip" title="Orbe de Novice">
                                        <img src="/assets/orbes/stack-orbe-novice.png" alt="Orbe Novice" className="orbe-image" />
                                        <span>{orbesAccumulees.novice}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <Link to="/login" style={{marginRight: "10px"}}><button>Connexion</button></Link>
                                <Link to="/signup" style={{marginRight: "10px"}}><button>Inscription</button></Link>
                                <Link to="/rules" style={{marginRight: "10px"}}><button>Règles du jeu</button></Link>
                            </div>
                        )}
                    </div>
                </header>
                <Routes>
                    <Route path="/" element={user ? <Navigate replace to="/game" /> : <Navigate replace to="/login" />} />
                    <Route path="/game" element={<Game triggerNewGame={triggerNewGame} setTriggerNewGame={setTriggerNewGame} ajouterOrbes={ajouterOrbes} />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/classement" element={<Classement />} /> 
                    {/*<Route path="/marche" element={<Marche />} />*/}
                    <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/game" />} />
                    <Route path="/signup" element={!user ? <Signup /> : <Navigate replace to="/game" />} />
                </Routes>
            </div>
    );
}

export default App;
