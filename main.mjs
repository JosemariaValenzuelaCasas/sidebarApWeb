

import {auth} from './public/js/firebase/firebase.mjs' 
import {onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
import {loginCheck} from './public/js/firebase/loginCheck.mjs'

import './public/js/firebase/signUpForm.mjs'
import './public/js/firebase/signInForm.mjs'
import './public/js/firebase/googleLogin.mjs'
onAuthStateChanged(auth, async(user)=>{
    if(user){
        loginCheck(user)
    }else{
        
    }
}) 