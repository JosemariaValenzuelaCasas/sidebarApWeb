
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
import { auth } from "./firebase.mjs";
import { showMessage } from "./showMessage.mjs";

const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    const userID = userCredentials.user.uid;
    console.log(userCredentials)
    // Close the login modal
    const modal = bootstrap.Modal.getInstance(signInForm.closest('.modal'));
    modal.hide();

    // reset the form
    signInForm.reset();

    // show welcome message
    showMessage("Welcome " + userCredentials.user.email);

    try {
      // Ahora envías el email y password en lugar del userID
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })  // Envías el email y password
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
    }

  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      showMessage("Wrong password", "error");
    } else if (error.code === 'auth/user-not-found') {
      showMessage("User not found", "error");
    } else {
      showMessage("Something went wrong", "error");
    }
  }
});

