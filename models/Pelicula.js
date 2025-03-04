const mongoose = require('mongoose');

const PeliculaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    director: { type: String, required: true },
    genero: { type: String, required: true },
    anio: { type: Number, required: true },
    sinopsis: { type: String },
    imagen: { type: String } // URL del cartel de la película
}, { timestamps: true });

module.exports = mongoose.model('Pelicula', PeliculaSchema);
