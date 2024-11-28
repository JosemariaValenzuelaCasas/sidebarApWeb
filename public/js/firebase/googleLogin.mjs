import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
import { auth } from "./firebase.mjs";
import { showMessage } from "./showMessage.mjs";

const googleButton = document.querySelector("#googleLogin");

googleButton.addEventListener("click", async (e) => {
    e.preventDefault();
  
    const provider = new GoogleAuthProvider();
    googleButton.disabled = true; // Deshabilitar botón temporalmente
    try {
      const credentials = await signInWithPopup(auth, provider);
      console.log(credentials);
      console.log("google sign in");
  
      const email = credentials.user.email; // Email del usuario autenticado
      const uid = credentials.user.uid; // UID del usuario
  
      // Cierra el modal
      const modalInstance = bootstrap.Modal.getInstance(googleButton.closest(".modal"));
      modalInstance.hide();
  
      // Mostrar mensaje de bienvenida
      showMessage("Welcome " + credentials.user.displayName);
      console.log("UID: ",uid)
      try {
        // Ahora envías el email o el UID
        const response = await fetch('/loginGoogle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, uid }) // Envías email y UID al backend
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error en la autenticación: ${errorData.message || 'Desconocido'}`);
        }
  
        const data = await response.json();
        console.log('Usuario autenticado:', data);
        window.location.replace("/mostrar");
      } catch (error) {
        console.error('Error:', error);
        showMessage("Error en la autenticación con el servidor");
      }
    } catch (error) {
      console.error("Error durante la autenticación con Google:", error.message);
      showMessage("Error durante la autenticación con Google");
    } finally {
      googleButton.disabled = false; // Habilitar botón
    }
  });
  