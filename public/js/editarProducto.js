let nuevaRuta='';
function activarCargarImagen(id) {
    // Mostrar el input para que el usuario seleccione una nueva imagen
    document.getElementById(`nuevaImagen-${id}`).click();
    
}

function cambiarImagen(event, id) {
    const archivo = event.target.files[0]; // Obtener el archivo seleccionado
    if (!archivo) {
        alert('Por favor selecciona una imagen.');
        return;
    }

    const formData = new FormData(); // Crear un FormData para enviar el archivo
    formData.append('imagen', archivo);
    formData.append('id', id); // Puedes enviar el ID del producto para asociarlo

    // Enviar la imagen al servidor
    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al subir la imagen.');
            }
            return response.json();
        })
        .then((data) => {
            // Actualizar la imagen en el cliente con la nueva ruta
            nuevaRuta = data.filePath; // Ruta de la imagen devuelta por el servidor
            console.log("nueva ruta?",nuevaRuta)
            document.getElementById(`imagenProducto-${id}`).src = nuevaRuta;
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Hubo un problema al subir la imagen.');
        });

}

function obtenerIdDeImagen(imagenUrl) {
    try {
        const partes = imagenUrl.split('/upload/');
        if (partes.length < 2) {
            return null;
        }

        const rutaConExtension = partes[1];
        const publicId = rutaConExtension.split('.')[0];
        return publicId;
    } catch (error) {
        console.error('Error al obtener el ID de la imagen:', error);
        return null;
    }
}

function guardarCambios(event, id) {
    event.preventDefault();
    // Deshabilitar el botón y cambiar su texto a "Guardando..."
    const botonGuardar = document.getElementById(`guardar-cambios-${id}`);
    botonGuardar.disabled = true;
    botonGuardar.textContent = 'Guardando...';

    const imagenCard = document.getElementById(`imagenProducto2-${id}`).src; // Imagen actual
    const imagenModal = document.getElementById(`imagenProducto-${id}`).src; // Nueva imagen o la misma

    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', document.getElementById(`nombre-${id}`).value);
    formData.append('precio', document.getElementById(`precio-${id}`).value);
    formData.append('stock', document.getElementById(`stock-${id}`).value);
    formData.append('marca', document.getElementById(`marca-${id}`).value);
    formData.append('imagenCard', imagenCard); // URL actual de la imagen
    formData.append('imagenModal', imagenModal); // URL de la imagen de la modal
    formData.append('nuevaImagen', nuevaRuta);

    console.log("nuevaRuta desde el guardar: ",nuevaRuta)
    fetch('/actualizar-producto/', {
        method: 'POST',
        body: formData, // Enviar el FormData
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.imagenNueva)
            document.getElementById(`imagenProducto2-${id}`).src = data.imagenNueva; // Nueva imagen de la modal
            document.getElementById(`nombre-${id}`).textContent = data.nombre;
            document.getElementById(`precio-${id}`).textContent = data.precio;
            document.getElementById(`stock-${id}`).textContent = data.stock;
            document.getElementById(`marc-${id}`).textContent = data.marca;
            // Cerrar el modal
            closeDialog(id);

            // Rehabilitar el botón y restablecer el texto
            botonGuardar.disabled = false;
            botonGuardar.textContent = 'Guardar Cambios'; // Cambiar el texto del botón de vuelta a su estado original
        })
        .catch((error) => {
            console.error('Error al guardar cambios:', error);
            // Rehabilitar el botón y restaurar el texto si hay un error
            botonGuardar.disabled = false;
            botonGuardar.textContent = 'Guardar Cambios';
        });
}


