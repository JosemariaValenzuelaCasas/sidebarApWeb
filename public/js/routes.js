const express = require('express');
const { conexion, connection } = require('./database');
const router = express.Router();
const multer = require('multer');
const { cloudinary, upload } = require('./cloudinary');
const fs = require('fs');
const path = require('path');

// Configuración de multer para almacenar archivos temporalmente

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

router.post('/validar', upload.single('image'), async function (req, res) {
    const datos = req.body;
    const imagenLocal = req.file; // Imagen guardada localmente
    console.log(imagenLocal.path)
    if (!imagenLocal) {
        return res.status(400).json({ success: false, message: "Error: No se subió ninguna imagen." });
    }

    let nombre = datos.name;
    let celular = datos.phone;
    let email = datos.email;
    let mensaje = datos.message;

    try {
        // Subir la imagen desde el almacenamiento local a Cloudinary
        const resultadoCloudinary = await cloudinary.uploader.upload(imagenLocal.path, {
            folder: "productos", // Carpeta en Cloudinary
        });

        // Obtener la URL de la imagen subida a Cloudinary
        const imagenUrl = resultadoCloudinary.secure_url;

        console.log("Imagen subida a Cloudinary:", imagenUrl);

        // Eliminar el archivo local después de subirlo (opcional)
        if (fs.existsSync(imagenLocal.path)) {
            fs.unlinkSync(imagenLocal.path);
        }

        // Guardar los datos en la base de datos
        let registrar = `INSERT INTO producto (producto, marca, precio, stock, imagen) 
                         VALUES ('${nombre}', '${celular}', '${email}', '${mensaje}', '${imagenUrl}');`;

        conexion.query(registrar, function (error) {
            if (error) {
                return res.status(500).json({ success: false, message: "Error al registrar el producto." });
            }

            res.json({ success: true, message: "Producto registrado correctamente." });
        });
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);

        // Si algo falla, elimina el archivo local para limpiar recursos
        if (imagenLocal && fs.existsSync(imagenLocal.path)) {
            fs.unlinkSync(imagenLocal.path);
        }

        res.status(500).json({ success: false, message: "Error al procesar la imagen." });
    }
});

router.post("/actualizar-producto", async (req, res) => {
  const { id, nombre, precio, stock, marca, imagenAnterior, nuevaImagenUrl } = req.body;

  // 1. Eliminar la imagen anterior si existe
  if (imagenAnterior) {
    try {
      console.log(imagenAnterior)
      // Eliminar la imagen de Cloudinary
      const result = await cloudinary.uploader.destroy(imagenAnterior);
      console.log('Imagen eliminada:', result);
    } catch (error) {
      console.error('Error al eliminar la imagen anterior:', error);
      return res.status(500).send('Error al eliminar la imagen anterior');
    }
  }

  // 2. Actualizar los datos del producto en la base de datos
  const query = "UPDATE producto SET producto = ?, precio = ?, stock = ?, marca = ?, imagen = ? WHERE id = ?";
  conexion.query(query, [nombre, precio, stock, marca, nuevaImagenUrl, id], (error) => {
    if (error) {
      console.error("Error al actualizar el producto:", error);
      return res.status(500).send("Error al actualizar el producto");
    }
    res.json({ message: "Producto actualizado correctamente" });
  });
});

module.exports = router;
