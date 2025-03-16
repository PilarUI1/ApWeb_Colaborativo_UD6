const express = require('express');
const router = express.Router();
const Noticia = require('../models/Noticia');

// 📌 Obtenemos todas las noticias
router.get('/', async (req, res) => {
    try {
        const noticias = await Noticia.find();
        res.json(noticias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las noticias" });
    }
});

// 📌 Obtenemos una noticia por ID
router.get('/:id', async (req, res) => {
    try {
        const noticia = await Noticia.findById(req.params.id);
        if (!noticia) return res.status(404).json({ error: "Noticia no encontrada" });
        res.json(noticia);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la noticia" });
    }
});

// 📌 Creamos una o varias noticias
router.post('/', async (req, res) => {
    try {
        // Verificamos si el cuerpo de la solicitud es un array o un objeto individual
        const data = Array.isArray(req.body) ? req.body : [req.body];

        // Insertamos múltiples noticias en la base de datos
        const noticiasInsertadas = await Noticia.insertMany(data);

        res.status(201).json({ mensaje: "Noticias agregadas correctamente", noticias: noticiasInsertadas });
    } catch (error) {
        console.error("❌ Error al crear la noticia:", error);
        res.status(400).json({ error: error.message });
    }
});

// 📌 Actualizamos una noticia por ID
router.put('/:id', async (req, res) => {
    try {
        const noticiaActualizada = await Noticia.findByIdAndUpdate(req.params.id, req.body, {new: true });
        if (!noticiaActualizada) return res.status(404).json({ error: "Noticia no encontrada" });
        res.json(noticiaActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la noticia" });
    }
});

// 📌 Eliminamos una noticia por ID
router.delete('/:id', async (req, res) => {
    try {
        const noticiaEliminada = await Noticia.findByIdAndDelete(req.params.id);
        if (!noticiaEliminada) return res.status(404).json({ error: "Noticia no encontrada" });
        res.json({ mensaje: "Noticia eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la noticia" });
    }
});

module.exports = router;