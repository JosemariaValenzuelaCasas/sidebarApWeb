document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    // Recoge los datos del formulario
    fetch("/validarSupport", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
        }),
    })
        .then((response) => response.json()) // Espera la respuesta del servidor en formato JSON
        .then((data) => {
            if (data.success) {
                // Mostrar toast de éxito
                Toastify({
                    text: data.message, // Mensaje del servidor
                    duration: 3000, // Duración en milisegundos
                    close: true, // Botón de cerrar
                    gravity: "bottom", // Posición: "top" o "bottom"
                    position: "center", // Posición en la pantalla
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
                    },
                }).showToast();

                document.getElementById("myForm").reset(); // Limpiar el formulario
            } else {
                // Mostrar toast de error
                Toastify({
                    text: "Hubo un error al registrar la pregunta.",
                    duration: 3000,
                    close: true,
                    gravity: "bottom",
                    position: "center",
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)", // Estilo de fondo para error
                    },
                }).showToast();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            Toastify({
                text: "Hubo un problema con la solicitud.",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "center",
                style: {
                    background: "linear-gradient(to right, #ff5f6d, #ffc371)", // Estilo de fondo para error
                },
            }).showToast();
        });
});
