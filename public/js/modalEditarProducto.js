
function closeDialog(id) {
    document.body.classList.remove('no-scroll');
    const modal = document.getElementById(`modal-editar-${id}`);
    modal.close();
}
   
function editarProducto(id) {
    // Recupera los datos del producto usando el data-* atributos
    const producto = document.querySelector(`button[data-id="${id}"]`);
    console.log(producto)
    const nombre = producto.getAttribute('data-nombre');
    const precio = producto.getAttribute('data-precio');
    const stock = producto.getAttribute('data-stock');
    const marca = producto.getAttribute('data-marca');
    const categoria = producto.getAttribute('data-categoria');

    // Rellena los campos del formulario en la modal correspondiente
    document.getElementById(`id-editar-${id}`).value = id;
    document.getElementById(`nombre-${id}`).value = nombre;
    document.getElementById(`precio-${id}`).value = precio;
    document.getElementById(`stock-${id}`).value = stock;
    document.getElementById(`marca-${id}`).value = marca;
    document.getElementById(`categoria-${id}`).value = categoria;
    document.body.classList.add('no-scroll');
    // Abre el modal correspondiente
    const modal = document.getElementById(`modal-editar-${id}`);
    modal.showModal();
}

// Enviar los datos editados al servidor

