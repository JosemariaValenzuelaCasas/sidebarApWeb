const menu = document.getElementById("menu");
const barraLateral = document.querySelector(".barra-lateral")
const spans = document.querySelectorAll("span");
const modoOscuro = document.getElementById("modo-oscuro")
const palanca = document.querySelector(".switch")
const circulo = document.querySelector(".circulo");
const main = document.querySelector(".main");
const navegacion = document.querySelector(".navegacion-side")

palanca.addEventListener("click",()=>{
    let body = document.body;
    body.classList.toggle("dark-mode");
    circulo.classList.toggle("prendido");
})

menu.addEventListener("click",()=>{
    barraLateral.classList.toggle("mini-barra-lateral");
    modoOscuro.classList.toggle("mini-modo-oscuro");
    main.classList.toggle("min-main");
    navegacion.classList.toggle("oculto")
    spans.forEach((spans)=>{
        spans.classList.toggle("oculto")
        
    })
    
})