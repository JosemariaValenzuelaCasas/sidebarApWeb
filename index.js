const mysql = require("mysql");
const express= require("express");
const app = express();

/* manejo de imagenes*/
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento para imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
    },
});
const upload = multer({ storage });

let conexion = mysql.createConnection({
    host:"rds.c568qm82elso.us-east-1.rds.amazonaws.com",
    database: "datos",
    user: "admin",
    password: "admin123"
});

const connection = mysql.createConnection({
    host:"rds.c568qm82elso.us-east-1.rds.amazonaws.com",
    database: "calendario",
    user: "admin",
    password: "admin123"
});

app.use(express.static('/css'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static('public'));

// Ruta para la página principal en "index.html"
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get("/formulario", function(req,res){

    res.render("formulario")
});

app.get("/mostrar", function(req,res){

    const consulta = "SELECT * FROM producto"; // Cambia 'user' por el nombre de tu tabla
    conexion.query(consulta, function (error, resultados) {
        if (error) {
            res.status(500).send("Error al obtener datos de la base de datos");
        } else {
            res.render("mostrar", { usuarios: resultados }); // Renderiza la vista con los datos
        }
    });
});

connection.connect(err => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos');
});

app.get('/eventos', (req, res) => {
    const query = 'SELECT * FROM calendarioCivico ORDER BY fecha DESC LIMIT 1'; // Obtener el evento más reciente

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error al obtener eventos');
            return;
        }
        res.json(results[0]); // Enviar el primer evento como JSON
    });
});


app.post("/validar", upload.single("image"), function (req, res) {
    const datos = req.body;
    const imagen = req.file; // Imagen cargada
  
    if (!imagen) {
      return res.status(400).send("Error: No se subió ninguna imagen.");
    }
  
    let nombre = datos.name;
    let celular = datos.phone;
    let email = datos.email;
    let mensaje = datos.message;
    let imagenRuta = imagen.filename; // Nombre del archivo guardado
  
    console.log("Datos recibidos:", nombre, celular, email, mensaje, imagenRuta);
  
    // Query para insertar en la base de datos
    let registrar = `INSERT INTO producto (producto, marca, precio, stock, imagen) 
                     VALUES ('${nombre}', '${celular}', '${email}', '${mensaje}', '${imagenRuta}');`;
  
    conexion.query(registrar, function (error) {
      if (error) {
        console.error("Error al registrar en la base de datos:", error);
        return res.status(500).send("Error al registrar producto.");
      } else {
        console.log("Producto registrado con éxito");
        res.status(200).send("Producto registrado con éxito.");
      }
    });
});




app.listen(3000,function(){
    console.log("servidor creado http://localhost:3000")
});