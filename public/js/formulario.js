document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    let formData = new FormData(this); // Recoge todos los datos del formulario, incluida la imagen

    fetch("/validar", { // Envia los datos al servidor en la ruta "/validar"
        method: "POST",
        body: formData
    })
    .then(response => response.json()) // Espera una respuesta en formato JSON
    .then(data => {
        if (data.success) {
            // Muestra el mensaje de éxito
            document.getElementById("response-message").innerText = data.message;
            document.getElementById("myForm").reset(); // Opcional: Limpiar el formulario
        } else {
            document.getElementById("response-message").innerText = "Hubo un error al registrar el producto.";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("response-message").innerText = "Hubo un problema con la solicitud.";
    });
});