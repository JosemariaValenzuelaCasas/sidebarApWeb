// Importación dinámica dentro de un bloque asíncrono
let appFirebase, auth;

(async () => {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
  const { getAuth } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js");
  const { getAnalytics } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js");

  // Configuración de Firebase
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
  appFirebase = initializeApp(firebaseConfig);
  const analytics = getAnalytics(appFirebase);
  auth = getAuth(appFirebase);

  // Exporta fuera de la función
})();

// Exporta las variables fuera de la función
export { appFirebase, auth };

