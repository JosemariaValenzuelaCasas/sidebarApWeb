
function openDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    document.body.classList.add('no-scroll');
    dialog.showModal(); // Muestra el diálogo como modal
}

function closeDialog() {
    const dialogs = document.querySelectorAll("dialog");
    document.body.classList.remove('no-scroll');
    dialogs.forEach((dialog) => dialog.close()); // Cierra todos los diálogos
}

function activarCargarImagen() {
    document.getElementById('nuevaImagen').click(); // Hace clic automáticamente en el input file
}

// Cambiar la imagen en la modal al seleccionar una nueva
async function cambiarImagen(event) {
    const file = event.target.files[0];  // Obtener el archivo seleccionado
    if (file) {
        // Crear un FormData para enviar la imagen a Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "imagenesAPP"); // Usa tu preset

        try {
            // Subir la imagen a Cloudinary
            const response = await fetch("https://api.cloudinary.com/v1_1/dmzhjy0bj/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (data.secure_url) {
                // Si la carga fue exitosa, actualizar el campo oculto con la URL de la imagen
                const nuevaImagenUrl = document.getElementById('nuevaImagenUrl');
                nuevaImagenUrl.value = data.secure_url;  // Guarda la URL de la imagen

                // Actualizar la imagen que se muestra en la página
                document.getElementById('imagenProducto').src = data.secure_url;
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
        }
    }
}
// Mostrar el modal con los datos del producto
document.querySelectorAll('.editar').forEach((boton) => {
    boton.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        const nombre = event.target.dataset.nombre;
        const precio = event.target.dataset.precio;
        const stock = event.target.dataset.stock;
        const marca = event.target.dataset.marca;
        const imagen = event.target.dataset.imagen; // Obtiene la imagen del dataset

        // Cargar los datos en el formulario de la modal
        document.getElementById('id-editar').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('precio').value = precio;
        document.getElementById('stock').value = stock;
        document.getElementById('marca').value = marca;

        // Mostrar la imagen actual en la modal
        const imagenModal = document.getElementById('imagenProducto'); 
        imagenModal.src =imagen; // Establece la ruta de la imagen en la modal

        // Mostrar la modal
        openDialog('modal-editar');
    });
});

// Enviar los datos editados al servidor
document.getElementById('form-editar').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('id-editar').value;
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const marca = document.getElementById('marca').value;
    const imagen = document.getElementById('imagenProducto').src;
    console.log(imagen);
    const nuevaImagenUrl = document.getElementById('nuevaImagenUrl').value;  // Obtener la URL de la imagen
    const imagenAnterior = imagen.split('/').slice(-1)[0].split('.')[0];

    try {
        const response = await fetch('/actualizar-producto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id,
              nombre,
              precio,
              stock,
              marca,
              imagenAnterior, // Pasas el Public ID de la imagen anterior
              nuevaImagenUrl  // Pasas la nueva URL de la imagen subida
            })
          });

        const data = await response.json();

        if (response.ok) {
            console.log('Producto actualizado:', data);
            location.reload(); // Recargar para ver los cambios o actualizar sin recargar
        } else {
            console.error('Error al actualizar el producto:', data);
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
});

