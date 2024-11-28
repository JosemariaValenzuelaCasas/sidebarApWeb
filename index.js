const express = require('express');
const path = require('path');
const app = express();
const routes = require('./public/js/routes');
console.log("xd")
// Configuración de la vista EJS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname)));
app.set('views', path.join(__dirname, 'views'));
app.use(routes);
 
app.listen(3000, function () {
    console.log("servidor creado http://localhost:3000");
});
