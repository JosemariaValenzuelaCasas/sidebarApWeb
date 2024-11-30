import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
import { auth } from "./firebase.mjs";
import { showMessage } from "./showMessage.mjs";

const signUpForm = document.querySelector("#signup-form");

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log(userCredential)

    
    /*const signupModal = document.querySelector('#signupModal');
    const modal = bootstrap.Modal.getInstance(signupModal);
    modal.hide();*/

    signUpForm.reset();

    showMessage("Welcome " + userCredential.user.email);

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
    if (error.code === 'auth/email-already-in-use') {
      showMessage("Email already in use", "error")
    } else if (error.code === 'auth/invalid-email') {
      showMessage("Invalid email", "error")
    } else if (error.code === 'auth/weak-password') {
      showMessage("Weak password", "error")
    } else if (error.code) {
      showMessage("Something went wrong", "error")
    }
  }

});