document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    let formData = new FormData(document.getElementById("myForm"));  // Recoge todos los datos del formulario, incluida la imagen

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
    .catch((error) => {
        if (error instanceof Response) {
            error.text().then((responseText) => {
                console.error("Error de la respuesta:", responseText);
                document.getElementById("response-message").innerText = "Hubo un problema con la solicitud.";
            });
        } else {
            console.error("Error en la solicitud:", error);
            document.getElementById("response-message").innerText = "Hubo un problema con la solicitud.";
        }
    });
});