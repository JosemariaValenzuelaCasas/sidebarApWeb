export const loginCheck = user =>{
    if(user){
        window.location.href = "mostrar";
    }else{
        window.location.href = "./index.html";
    }
}