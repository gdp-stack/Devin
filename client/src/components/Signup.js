import React, { useState } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Importez setDoc pour Firestore
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Ajout d'un champ username
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        username: username, // Ajout de username
        orbes: { // Initialisation des types d'orbes à zéro
          novice: 0,
          apprenti: 0,
          confirme: 0,
          expert: 0,
          maitre: 0,
        },
      });
    } catch (error) {
      setError("Erreur d'inscription : " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
          required
        />
        <button type="submit" className="button">S'inscrire</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
