// Función para obtener y mostrar los eventos desde el servidor
function obtenerEvento() {
    fetch('/eventos')
        .then(response => response.json())
        .then(evento => {
            const hoy = new Date();
            const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

            const diaSemana = dias[hoy.getDay()];
            const mes = meses[hoy.getMonth()];
            const dia = hoy.getDate();
            const anio = hoy.getFullYear();

            document.getElementById("dayTitle").textContent = `Hoy: ${diaSemana} ${dia} de ${mes} de ${anio}, Evento: ${evento.titulo}`;
            
        })
        .catch(error => {
            console.error('Error al obtener el evento:', error);
        });
}

// Ejecutar la función al cargar la página
obtenerEvento();
