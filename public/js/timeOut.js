let timeout;

const inactivityLimit = 15 * 60 * 1000;  // 5 minutos de inactividad

// Reiniciar el temporizador cada vez que el usuario interactúe con la página
function resetInactivityTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(logoutUser, inactivityLimit);
}

// Cerrar sesión si el tiempo de inactividad se supera
function logoutUser() {
    alert("Tu sesión ha expirado por inactividad. Cerrando sesión.");
    window.location.href = "/logout";  // Redirige a la ruta de logout
}

// Configurar eventos para reiniciar el temporizador
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);

// Establecer el temporizador inicial
resetInactivityTimer();

