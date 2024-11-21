const express = require('express');
const { conexion, connection } = require('./database');
const upload = require('./multer');
const router = express.Router();

// Ruta para la página principal en "index.html"
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

router.get("/formulario", function (req, res) {
    res.render("formulario");
});

router.get("/mostrar", function (req, res) {
    const consulta = "SELECT * FROM producto";
    conexion.query(consulta, function (error, resultados) {
        if (error) {
            res.status(500).send("Error al obtener datos de la base de datos");
        } else {
            res.render("mostrar", { usuarios: resultados });
        }
    });
});

router.get('/eventos', (req, res) => {
    const query = 'SELECT * FROM calendarioCivico ORDER BY fecha DESC LIMIT 1'; 

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error al obtener eventos');
            return;
        }
        res.json(results[0]); // Enviar el primer evento como JSON
    });
});

router.post("/validar", upload.single("image"), function (req, res) {
    const datos = req.body;
    const imagen = req.file; // Imagen cargada

    if (!imagen) {
        return res.status(400).json({ success: false, message: "Error: No se subió ninguna imagen." });
    }

    let nombre = datos.name;
    let celular = datos.phone;
    let email = datos.email;
    let mensaje = datos.message;
    let imagenRuta = imagen.filename; // Nombre del archivo guardado

    console.log("Datos recibidos:", nombre, celular, email, mensaje, imagenRuta);

    let registrar = `INSERT INTO producto (producto, marca, precio, stock, imagen) 
                     VALUES ('${nombre}', '${celular}', '${email}', '${mensaje}', '${imagenRuta}');`;

    conexion.query(registrar, function (error) {
        if (error) {
            return res.status(500).json({ success: false, message: "Error al registrar el producto." });
        }

        res.json({ success: true, message: "Producto registrado correctamente." });
    });
});

router.post('/actualizar-stock', (req, res) => {
    const id = req.body.id;
    const stockActual = parseInt(req.body.stock_actual, 10);
    const nuevoStock = stockActual + 1; // Incrementa el stock en 1
  
    const query = 'UPDATE producto SET stock = ? WHERE id = ?';
    conexion.query(query, [nuevoStock, id], (error) => {
      if (error) {
        console.error('Error actualizando el stock:', error);
        return res.status(500).send('Error actualizando el stock');
      }
  
      // Redirigir de vuelta a la página de productos
      res.redirect('/mostrar'); // Cambia esto por tu ruta principal
    });
});

module.exports = router;
