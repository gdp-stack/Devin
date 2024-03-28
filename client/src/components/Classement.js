import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './Classement.css';

function Classement() {
    const [classement, setClassement] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchClassement = async () => {
            const querySnapshot = await getDocs(collection(firestore, "users"));
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({ uid: doc.id, ...doc.data() });
            });

            users.sort((a, b) => {
                const orbesA = a.orbes;
                const orbesB = b.orbes;
                return orbesB.maitre - orbesA.maitre || 
                       orbesB.expert - orbesA.expert ||
                       orbesB.confirme - orbesA.confirme ||
                       orbesB.apprenti - orbesA.apprenti ||
                       orbesB.novice - orbesA.novice;
            });

            setClassement(users);
        };

        fetchClassement();

        const unsubscribe = auth.onAuthStateChanged(user => setUser(user));
        return () => unsubscribe();
    }, []);

    return (
        <div className="classement-page-container">
            <h2>Classement des Joueurs</h2>
            <table className="classement-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nom du Joueur</th>
                        <th>Orbes de Maître</th>
                        <th>Orbes d'Expert</th>
                        <th>Orbes de Confirmé</th>
                        <th>Orbes d'Apprenti</th>
                        <th>Orbes de Novice</th>
                    </tr>
                </thead>
                <tbody>
                    {classement.map((joueur, index) => (
                        <tr key={joueur.uid} className={user && joueur.uid === user.uid ? "highlighted" : ""}>
                            <td>{index + 1}</td>
                            <td>{joueur.username}</td>
                            <td>{joueur.orbes.maitre}</td>
                            <td>{joueur.orbes.expert}</td>
                            <td>{joueur.orbes.confirme}</td>
                            <td>{joueur.orbes.apprenti}</td>
                            <td>{joueur.orbes.novice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Classement;
