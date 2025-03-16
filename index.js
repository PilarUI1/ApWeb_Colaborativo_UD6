const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose'); // ✅ Usamos mongoose en lugar de MongoClient
let ejs = require('ejs');

const aplicacion = express();
const puerto = 8000;

// Habilitamos json en las peticiones, en el Body y datos de formulario
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

// Importar y usar las rutas de las películas
const peliculasRoutes = require('./routes/peliculas');
aplicacion.use('/api/peliculas', peliculasRoutes);

// Importar y usar las rutas de las noticias
const noticiasRoutes = require('./routes/noticias');
aplicacion.use('/api/noticias', noticiasRoutes);

// Se establece la conexión con MongoDB
const uri = "mongodb+srv://ASWGrupo1:ASWGrupo1@aswgrupo1.yods9.mongodb.net/ASWGrupo1?retryWrites=true&w=majority";

// Conectamos con Mongoose y manejamos los errores
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ Conectado a MongoDB con Mongoose"))
    .catch(err => {
        console.error("❌ Error en la conexión a MongoDB:", err);
        process.exit(1); // 🔴 Detener la aplicación si la conexión falla
    });

// Definimos el sistema de plantillas y el directorio donde se guardan
aplicacion.set('view engine', 'ejs');
aplicacion.set('views', './views');

// Definimos un directorio para el contenido estático
aplicacion.use(express.static(__dirname + '/static'));

// Utilizamos bodyParser y cookieParser como Middlewares
aplicacion.use(bodyParser.urlencoded({ extended: true }));
aplicacion.use(cookieParser());

// Generamos una clave aleatoria para firmar los JWT
jwtKey = require('node:crypto').randomBytes(8).toString('hex');

// Función para la autenticación de usuarios
function autenticarUsuario(req) {
    if (req.cookies['ASWGrupo1'] == null) { return -1; }
    try {
        tokenData = jwt.verify(req.cookies['ASWGrupo1'], jwtKey);
        return tokenData['userId'];
    }
    catch {
        return -1;
    }
}

// Función para leer los datos comunes de la BBDD
async function leerDatosComunes(req) {
    let listaPeliculas = await mongoose.connection.db.collection('peliculas').find({}).toArray();
    let listaUsuarios = await mongoose.connection.db.collection('usuarios').find({}).toArray();
    let listaPremios = [];
    let usuarioActivo = autenticarUsuario(req);
    return { listaPeliculas, listaUsuarios, listaPremios, usuarioActivo };
}

// Definimos las rutas principales
aplicacion.get('/', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    let listaNoticias = await mongoose.connection.db.collection('noticias').find({}).sort({'fecha':-1}).limit(6).toArray();
    res.render('portada', { parametrosComunes, noticias: listaNoticias });
});

aplicacion.get('/peliculas/', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    res.render('peliculas', { parametrosComunes });
});

aplicacion.get('/premios/', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    res.render('premios', { parametrosComunes });
});

aplicacion.get('/contacto/', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    res.render('contacto', { parametrosComunes });
});

aplicacion.get('/accesibilidad/', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    res.render('accesibilidad', { parametrosComunes });
});

aplicacion.get('/legal/', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    res.render('legal', { parametrosComunes });
});

aplicacion.get('/pelicula/:idPelicula', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    res.render('detalles_pelicula', { parametrosComunes, idPelicula: req.params.idPelicula, comentarios: {} });
});

// Rutas para la autenticación
aplicacion.get('/register', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    res.render('register', { parametrosComunes, emailDuplicado: false });
});

aplicacion.post('/register', async (req, res) => {
    let resultado = await mongoose.connection.db.collection('usuarios').findOne({ email: req.body.email });

    if (!resultado) {
        let hash = await bcrypt.hash(req.body.password, 10);
        let usuario = { nombre: req.body.nombre, email: req.body.email, password: hash };
        let insertResult = await mongoose.connection.db.collection('usuarios').insertOne(usuario);
        let token = jwt.sign({ userId: insertResult.insertedId.toString() }, jwtKey, { expiresIn: '7d' });
        res.cookie('ASWGrupo1', token);
        res.redirect('/');
    } else {
        let parametrosComunes = await leerDatosComunes(req);
        res.render('register', { parametrosComunes, emailDuplicado: true });
    }
});

aplicacion.get('/login', async (req, res) => {
    let parametrosComunes = await leerDatosComunes(req);
    res.render('login', { parametrosComunes, errorLogin: false });
});

aplicacion.post('/login', async (req, res) => {
    let resultado = await mongoose.connection.db.collection('usuarios').findOne({ email: req.body.email });

    if (!resultado) {
        let parametrosComunes = await leerDatosComunes(req);
        res.render('login', { parametrosComunes, errorLogin: true });
    } else {
        bcrypt.compare(req.body.password, resultado.password, async function (err, result) {
            if (result) {
                let token = jwt.sign({ userId: resultado._id.toString() }, jwtKey, { expiresIn: '7d' });
                res.cookie('ASWGrupo1', token);
                res.redirect('/');
            } else {
                let parametrosComunes = await leerDatosComunes(req);
                res.render('login', { parametrosComunes, errorLogin: true });
            }
        });
    }
});

aplicacion.get('/logout', (req, res) => {
    res.clearCookie("ASWGrupo1");
    res.redirect('/');
});

// Arrancamos el servidor
aplicacion.listen(puerto, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${puerto}`);
});