const express = require('express');
const path = require('path');
const session = require('express-session');  // Importa express-session
const app = express();
const routes = require('./public/js/routes');

console.log("Servidor iniciado");

// Configuración de express-session
app.use(session({
  secret: 'team_15', // Cambia esto por un valor seguro
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Cambia a true si usas HTTPS
}));

// Configuración de la vista EJS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas estáticas
app.use("/uploads", express.static("uploads"));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname)));
app.set('views', path.join(__dirname, 'views'));

// Aquí es donde se añaden las rutas
app.use(routes);

app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000");
});

