const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyDcSwuJ3k994IYx7OAxtVdlYct_S4HZHNU",
    authDomain: "inventoryapp-aa682.firebaseapp.com",
    projectId: "inventoryapp-aa682",
    storageBucket: "inventoryapp-aa682.firebasestorage.app",
    messagingSenderId: "115397505369",
    appId: "1:115397505369:web:889b53e339b53756f39c48",
    measurementId: "G-KZJ92F9HRK",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

module.exports = { auth, signInWithEmailAndPassword };