const mongoose = require('mongoose');

// Definición del esquema con la estructura de las películas en MongoDB
const PeliculaSchema = new mongoose.Schema({
    titulo: { type: String, required: true }, // Título de la película, requerido
    director: { type: String, required: true }, // Director de la película, requerido
    genero: { type: String, required: true }, // Género de la película, requerido
    anio: { type: Number, required: true }, // Año de la película, requerido
    sinopsis: { type: String }, // Sinopsis de la película, opcional
    imagen: { type: String } // URL de la imagen de la película, opcional
}, { timestamps: true }); // Agregar timestamps de creación del documento y última actualización

// Creamos y exportamos el modelo Pelicula para usarlo para crear, leer, actualizar y eliminar películas de la base de datos
module.exports = mongoose.model('Pelicula', PeliculaSchema);