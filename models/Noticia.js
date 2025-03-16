const mongoose = require('mongoose');

// Definición del esquema con la estructura de las noticias en MongoDB
const NoticiaSchema = new mongoose.Schema({
    fecha: { type: Date, required: true }, 
    titulo: { type: String, required: true }, 
    texto: {type: String, required:true},
    url: { type: String, required: true },
    origen: {type: String, required:true},
    imagen: { type: String } 
}, { timestamps: true }); 
// Creamos y exportamos el modelo Noticia para usarlo para crear, leer, actualizar y eliminar películas de la base de datos
module.exports = mongoose.model('Noticia', NoticiaSchema);