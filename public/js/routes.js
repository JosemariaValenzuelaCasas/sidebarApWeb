const express = require('express');
const { conexion, connection,con } = require('./database');
const router = express.Router();
const { cloudinary, upload } = require('./cloudinary');
const fs = require('fs');
const { auth, signInWithEmailAndPassword } = require("./firebase/firebaseNode.js");
// Configuración de multer para almacenar archivos temporalmente
const admin = require('firebase-admin');


// Inicializa Firebase Admin con tus credenciales
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("./firebase/config/configKey.json"))
  });
} else {
  admin.app(); // Usa la app ya existente si está inicializada
}

// Ahora puedes usar los servicios de Firebase
const getAuth = admin.auth;

// Ruta para la página principal en "index.html"
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

router.get("/formulario", function (req, res) {
    res.render("formulario");
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
    console.log(datos)
    console.log(req.file)
    const imagenLocal = req.file; // Imagen guardada localmente
    const userID = req.session.userID;
    console.log("UID: " + userID);
    if (!userID) {
        return res.status(400).json({ success: false, message: "No se ha autenticado al usuario." });
    }

    console.log("UID: " + userID);
    if (!imagenLocal) {
        return res.status(400).json({ success: false, message: "Error: No se subió ninguna imagen." });
    }

    let nombre = datos.name;
    let celular = datos.phone;
    let email = datos.email;
    let mensaje = datos.message;
    let categoria = datos.categoria;
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
        let registrar = `INSERT INTO producto (producto, marca, precio, stock, imagen, categoria, user_id) 
                         VALUES ('${nombre}', '${celular}', '${email}', '${mensaje}', '${imagenUrl}', '${categoria}', '${userID}');`;

        conexion.query(registrar, function (error) {
            if (error) {
                return res.status(500).json({ success: false, message: "Error al registrar el producto." });
            }

            res.json({ success: true, message: "Producto registrado correctamente." });
        });
        console.log("klk")
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);

        // Si algo falla, elimina el archivo local para limpiar recursos
        if (imagenLocal && fs.existsSync(imagenLocal.path)) {
            fs.unlinkSync(imagenLocal.path);
        }

        res.status(500).json({ success: false, message: "Error al procesar la imagen." });
    }
});

router.post('/actualizar-producto', upload.single('imagen'), async (req, res) => {
    const { id, nombre, precio, stock, marca, categoria, imagenCard, imagenModal, nuevaImagen } = req.body;
    try {
        if (imagenCard !== imagenModal) {
            console.log("ImagenAntigua: " + imagenCard, "ImagenNueva: " + imagenModal)
            // Actualizar la base de datos con el nuevo secureUrl y los datos del producto
            const queryUpdate = `
                UPDATE producto 
                SET producto = ?, precio = ?, stock = ?, marca = ?, imagen = ?, categoria = ?
                WHERE id = ?
            `;
 
            conexion.query(queryUpdate, [nombre, precio, stock, marca, nuevaImagen, categoria, id], (error) => {
                if (error) {
                    console.error("Error al actualizar el producto en la base de datos:", error);
                    return res.status(500).send("Error al actualizar el producto");
                }
                console.log(nuevaImagen)
                res.json({
                    imagenNueva: nuevaImagen, // La nueva URL de la imagen
                    nombre: nombre, // Otros datos que se están actualizando
                    precio: precio,
                    stock: stock,
                    marca: marca,
                    categoria: categoria
                });
            });

        } else {
            // Las imágenes son iguales, solo actualizamos los datos del producto
            const queryUpdate = `
                UPDATE producto 
                SET producto = ?, precio = ?, stock = ?, marca = ?, categoria = ?
                WHERE id = ?
            `;

            conexion.query(queryUpdate, [nombre, precio, stock, marca, categoria, id], (error) => {
                if (error) {
                    console.error("Error al actualizar el producto en la base de datos:", error);
                    return res.status(500).send("Error al actualizar el producto");
                }
                res.json({
                    imagenNueva: nuevaImagen,
                    nombre: nombre, // Otros datos que se están actualizando
                    precio: precio,
                    stock: stock,
                    marca: marca,
                    categoria: categoria
                });
            });

        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return res.status(500).json({
            mensaje: 'Hubo un problema al actualizar el producto'
        });
    }
});


router.post('/upload', upload.single('imagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se envió ningún archivo.' });
    }
    const nuevaImagen = req.file;
    const resultadoCloudinary = await cloudinary.uploader.upload(nuevaImagen.path, {
        folder: 'productos' // Carpeta en Cloudinary
    });
    if (fs.existsSync(nuevaImagen.path)) {
        fs.unlinkSync(nuevaImagen.path); // Eliminar archivo local
    }

    const nuevoSecureUrl = resultadoCloudinary.secure_url;
    console.log(nuevoSecureUrl)
    const filePath = nuevoSecureUrl;
    res.json({ filePath });
});

router.post('/eliminar-imagen', async (req, res) => {
    const { public_id } = req.body; // Recibir el public_id desde el cliente

    if (!public_id) {
        return res.status(400).json({ message: 'Falta el public_id de la imagen.' });
    }

    try {
        // Eliminar la imagen en Cloudinary
        const resultado = await cloudinary.uploader.destroy(public_id);

        if (resultado.result !== 'ok') {
            throw new Error('No se pudo eliminar la imagen.');
        }

        res.json({ message: 'Imagen eliminada correctamente.', public_id });
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ message: 'Error al eliminar la imagen.', error });
    }
});

router.put('/productos/eliminar', (req, res) => {
    const { ids } = req.body; // Recibe los IDs del cliente

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send('No se enviaron productos para eliminar.');
    }

    // Actualiza el estado de los productos en la base de datos
    const query = 'UPDATE producto SET producto_estado = 0 WHERE id IN (?)';
    conexion.query(query, [ids], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar los productos.');
        }
        res.send('Productos eliminados correctamente.');
    });
});


//SESION



router.get("/mostrar", function (req, res) {
    console.log("Sesión activa:", req.session); // Verifica la sesión
    const userID = req.session.userID; // Obtén el userID de la sesión
    if (!userID) {
        return res.redirect("/index.html"); // Si no está autenticado, redirige al login
    }

    // Consulta SQL para obtener los productos del usuario
    const consulta = "SELECT * FROM producto WHERE producto_estado = 1 AND user_id = ?";
    conexion.query(consulta, [userID], function (error, resultados) {
        if (error) {
            console.error("Error al obtener datos de la base de datos:", error);
            res.status(500).send("Error al obtener datos de la base de datos");
        } else {
            res.render("mostrar.ejs", { usuarios: resultados });
        }
    });
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Faltan parámetros de email o contraseña' });
    }

    try {
        // Intentamos la autenticación con Firebase
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const userID = userCredentials.user.uid;

        // Almacena el userID en la sesión
        req.session.userID = userID;

        res.json({ message: 'Usuario autenticado', userID });
    } catch (error) {
        console.log("Error al autenticar al usuario:", error);  // Log del error en el servidor
        res.status(400).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

router.post("/loginGoogle", async (req, res) => {
    const { email, uid } = req.body;
    console.log(uid)
    if (!email || !uid) {
        return res.status(400).json({ message: "Faltan datos para autenticar" });
    }

    try {
        // Verifica que el UID o email coincidan con un usuario válido
        const userRecord = await getAuth().getUser(uid);

        if (userRecord.email !== email) {
            return res.status(401).json({ message: "Usuario no autorizado" });
        }

        // Establece la sesión
        req.session.userID = uid;
        console.log('UID almacenado en la sesión:', req.session.userID);


        res.json({ message: "Usuario autenticado", userID: uid });
    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(500).json({ message: "Error en la autenticación", error: error.message });
    }
});

router.get('/logout', (req, res) => {
    // Elimina la sesión y redirige al login o página principal
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error al cerrar sesión.");
        }
        res.redirect('/index');
    });
});


//soporte
router.get("/soporte", function (req, res) {
    const consulta = `
        SELECT mainPregunta, respuesta
        FROM preguntaUsuario
        WHERE estado_pregunta = 'activa' AND mainPregunta != 'Sin consolidar'
        GROUP BY mainPregunta, respuesta
        ORDER BY COUNT(*) DESC
        LIMIT 5;
    `;

    con.query(consulta, function (error, resultados) {
        if (error) {
            res.status(500).send("Error al obtener datos de la base de datos");
        } else {
            res.render("soporte", { preguntasTop: resultados });
        }
    });
});

router.post('/validarSupport', async function (req, res) {
    const datos = req.body;
    console.log(datos)
    // Imagen guardada localmente
    let nombre = datos.name;
    let celular = datos.phone;
    let email = datos.email;
    let mensaje = datos.message;
    let main = "Sin consolidar";
    let respuesta ="Pendiente de respuesta";
    console.log("klk")
    try {

        // Guardar los datos en la base de datos
        let registrar = `INSERT INTO preguntaUsuario (nombre, celular, email, pregunta, mainPregunta, respuesta) 
                         VALUES ('${nombre}', '${celular}', '${email}', '${mensaje}', '${main}', '${respuesta}');`;

        con.query(registrar, function (error) {
            if (error) {
                return res.status(500).json({ success: false, message: "Error al registrar el producto." });
            }

            res.json({ success: true, message: "Pregunta registrada correctamente." });
        })
        console.log("xddd")
    } catch (error) {
        console.error("Error ", error);

        res.status(500).json({ success: false, message: "Error p." });
    }
});

module.exports = router;





//lee esto webonazo el cambio de imagen funciona bien, debes implementar una solucion para cuando no se cambia la imagen
//Y no te olvides de los else de la funcion para actualizar la base de datos, prueba los errores, recuerda que debe estar bien pulido
//probablemente usemos la misma funcion para editar modales en el apartado de la generacion de registros de venta.