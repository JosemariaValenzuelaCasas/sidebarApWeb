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
    destination: (req, file, cb) => {
        cb(null, "public/uploads"); // Carpeta donde se guardarán las imágenes localmente
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
    },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
