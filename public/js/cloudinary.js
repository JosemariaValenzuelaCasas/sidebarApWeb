const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: "dmzhjy0bj",
    api_key: "511554587812571",
    api_secret: "FaSglQK5p6KCrl5y2ACajJT1i5Y",
});

// Configuración de almacenamiento en disco con Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Define la carpeta donde se almacenarán los archivos subidos
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      // Si quieres conservar el nombre original del archivo, usa `file.originalname`
      cb(null, Date.now() + path.extname(file.originalname)); // Si deseas usar un nombre único
    }
});

  // Crear la instancia de multer con la configuración de almacenamiento
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
