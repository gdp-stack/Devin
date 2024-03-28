import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importez cette fonction
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Nouvel état pour stocker l'erreur

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialiser l'erreur à chaque tentative
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // La redirection est gérée par le listener d'authentification dans App.js
    } catch (error) {
      setError("Erreur de connexion : " + error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="button">Se connecter</button>
        {error && <p className="error">{error}</p>} {/* Affichage de l'erreur */}
      </form>
    </div>
  );
};

export default Login;
