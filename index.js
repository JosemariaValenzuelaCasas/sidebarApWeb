const express = require('express');
const path = require('path');
const app = express();
const routes = require('./public/js/routes');

// Configuración de la vista EJS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(express.static('public'));

// Usamos las rutas importadas
app.use(routes);

app.listen(3000, function () {
    console.log("servidor creado http://localhost:3000");
});
