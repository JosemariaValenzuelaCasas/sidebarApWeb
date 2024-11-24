const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "dmzhjy0bj",
    api_key: "511554587812571",
    api_secret: "FaSglQK5p6KCrl5y2ACajJT1i5Y",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "productos", // Carpeta en Cloudinary
        allowed_formats: ["jpg", "png"], // Formatos permitidos
    },
});

const upload = multer({ storage });

module.exports = upload;

const cloudinary = require("cloudinary").v2;
const upload = require("./cloudinary"); 