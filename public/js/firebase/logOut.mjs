import {signOut} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
import{auth} from './firebase.mjs'
const logout = document.querySelector('#logout')

logout.addEventListener('click', async()=>{
    await signOut(auth)
    console.log("usuario out")
    window.location.href = "/index.html";
})