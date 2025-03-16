const express = require('express');
const router = express.Router();
const Pelicula = require('../models/Pelicula');

// 📌 Obtenemos todas las películas
router.get('/', async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las películas" });
    }
});

// 📌 Obtenemos una película por ID
router.get('/:id', async (req, res) => {
    try {
        const pelicula = await Pelicula.findById(req.params.id);
        if (!pelicula) return res.status(404).json({ error: "Película no encontrada" });
        res.json(pelicula);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la película" });
    }
});

// 📌 Creamos una o varias películas
router.post('/', async (req, res) => {
    try {
        // Verificamos si el cuerpo de la solicitud es un array o un objeto individual
        const data = Array.isArray(req.body) ? req.body : [req.body];

        // Insertamos múltiples películas en la base de datos
        const peliculasInsertadas = await Pelicula.insertMany(data);

        res.status(201).json({ mensaje: "Películas agregadas correctamente", peliculas: peliculasInsertadas });
    } catch (error) {
        console.error("❌ Error al crear la película:", error);
        res.status(400).json({ error: error.message });
    }
});

// 📌 Actualizamos una película por ID
router.put('/:id', async (req, res) => {
    try {
        const peliculaActualizada = await Pelicula.findByIdAndUpdate(req.params.id, req.body, {new: true });
        if (!peliculaActualizada) return res.status(404).json({ error: "Película no encontrada" });
        res.json(peliculaActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la película" });
    }
});

// 📌 Eliminamos una película por ID
router.delete('/:id', async (req, res) => {
    try {
        const peliculaEliminada = await Pelicula.findByIdAndDelete(req.params.id);
        if (!peliculaEliminada) return res.status(404).json({ error: "Película no encontrada" });
        res.json({ mensaje: "Película eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la película" });
    }
});

module.exports = router;