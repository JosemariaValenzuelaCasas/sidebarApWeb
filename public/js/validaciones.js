document.getElementById('myForm').addEventListener('submit', function(event) {
    
    event.preventDefault();

    let name = document.getElementById('name');
    let phone = document.getElementById('phone');
    let email = document.getElementById('email');

    name.style.border = "";
    phone.style.border = "";
    email.style.border = "";

    let errorMessage = "";

    let nameFormat = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)?$/; 
    if (name.value.trim() === "") {
        errorMessage += "El nombre no puede estar vacío.\n";
        name.style.border = "2px solid red"; 
    } else if (!nameFormat.test(name.value)) {
        errorMessage += "Cada nombre debe tener al menos dos letras y solo puede tener letras.\n";
        name.style.border = "2px solid red"; 
    }

    let phoneFormat = /^[0-9]{9,15}$/;
    if (!phoneFormat.test(phone.value)) {
        errorMessage += "El teléfono debe tener entre 9 y 15 dígitos.\n";
        phone.style.border = "2px solid red"; 
    }

    
    let emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailFormat.test(email.value)) {
        errorMessage += "El email no tiene un formato válido.\n";
        email.style.border = "2px solid red"; 
    }

    
    if (errorMessage !== "") {
        alert(errorMessage);
    } else {
        alert("Formulario enviado correctamente!");
        document.getElementById('myForm').submit();
        
    }
});