// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "dev-in-5f5b5.firebaseapp.com",
    projectId: "dev-in-5f5b5",
    storageBucket: "dev-in-5f5b5.appspot.com",
    messagingSenderId: "896138481961",
    appId: "1:896138481961:web:317efdba1238d79afee738"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Get an instance of FirebaseAuth for authentication
export const auth = getAuth(app);

// Get an instance of Firestore for the database
export const firestore = getFirestore(app);
