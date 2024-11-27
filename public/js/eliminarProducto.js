
function eliminarProductosSeleccionados() {
    // Recopila todos los checkboxes seleccionados
    const checkboxes = document.querySelectorAll('.select-product:checked');
    const ids = Array.from(checkboxes).map(checkbox => checkbox.value); // Extrae los IDs

    if (ids.length === 0) {
        alert('Selecciona al menos un producto para eliminar.');
        return;
    }

    // Mostrar el cuadro de confirmación
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar ${ids.length} producto(s)?`);
    if (!confirmar) {
        return; // Si el usuario cancela, no hace nada
    }

    // Envía los IDs al servidor
    fetch('/productos/eliminar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
    })
    .then(response => {
        if (response.ok) {
            // Elimina las tarjetas seleccionadas del DOM
            ids.forEach(id => {
                const card = document.getElementById(`product-${id}`).closest('.card');
                if (card) card.remove();
            });
        } else {
            console.error('No se pudieron eliminar los productos.');
        }
    })
    .catch(error => console.error('Error:', error));
}

