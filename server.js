'use strict';

// Cargamos el modulo de Express
const express = require('express');

// Crearmos un objeto servidor HTTP
const server = express();

// definimos el puerto a usar por el servidor HTTP
const port = 8080;

// Cargamos el modulo para la gestion de sesiones
const session = require('express-session');

const path = require('path');
const jwt = require('jsonwebtoken');

// Creamos el objeto con la configuración
const sesscfg = {
    secret: 'practicas-lsi-2023',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 8*60*60*1000 } // 8 working hours
};

// Se le dice al servidor que use el modulo de sesiones con esa configuracion
server.use(session(sesscfg));

// Obtener la referencia al módulo 'body-parser'
const bodyParser = require('body-parser');

// Configuring express to use body-parser as middle-ware.
server.use(bodyParser.urlencoded({ extended: false }));
// Configurando body-parser para analizar datos JSON
server.use(bodyParser.json());

// Configurando body-parser para analizar datos codificados en url-encoded
server.use(bodyParser.urlencoded({ extended: true }));

// Obtener el configurador de rutas
const router = express.Router();

// cargar el módulo para bases de datos SQLite
var sqlite3 = require('sqlite3').verbose();

//----------------------------------------------------------------------------------------------------------------------------------------
// Abrir nuestra base de datos

var db = new sqlite3.Database(
    'Database.db',    // nombre del fichero de base de datos
    (err) => { // funcion que será invocada con el resultado
        if (err)      // Si ha ocurrido un error
            console.log(err);  // Mostrarlo por la consola del servidor
    }
);
//----------------------------------------------------------------------------------------------------------------------------------------

// Ruta para mostrar el archivo Login.html
router.get('/login', (req, res) => {
    // Obtener la ruta completa del archivo Login.html
    const filePath = path.join(__dirname, 'html', 'Login.html');

    // Enviar el archivo como respuesta al cliente
    res.sendFile(filePath);
});

// Ruta para mostrar el archivo Login.html cuando se acceda a la raíz
router.get('/', (req, res) => {
    // Obtener la ruta completa del archivo Login.html
    const filePath = path.join(__dirname, 'html', 'Login.html');

    // Enviar el archivo como respuesta al cliente
    res.sendFile(filePath);
});

// Ahora la acción asociada al login sería:
router.post('/login', (req, res) => {
    // Comprobar si la petición contiene los campos ('user' y 'passwd')
    if (!req.body.user || !req.body.passwd) {
        res.status(400).json;
    } else {
        console.log('Solicitud POST recibida en /login');
        console.log('Datos de la solicitud:', req.body);
        // La petición está bien formada -> procesarla
        processLogin(req, res, db);
    }
});

function processLogin(req, res, db) {
    console.log('Procesando el REQUEST del login',req.body);

    var correo = req.body.user;
    var password = req.body.passwd;

    db.get(
        // consulta y parámetros cuyo valor será usado en los '?'
        'SELECT * FROM users WHERE correo=?', correo,
        // funcion que se invocará con los datos obtenidos de la base de datos
        (err, row) => {
            if (row == undefined) {
                // La consulta no devuelve ningun dato -: no existe el usuario
                res.status(401).json({ errormsg: 'El usuario no existe' });
            } else if (row.password === password) {
                // La contraseña es correcta
                // Generar un identificador de sesión único
                var sessionID = generateSessionID();
                // Asociar el sessionID a los datos de la sesión
                req.session.sessionID = sessionID;
                // Preparar la respuesta con el sessionID
                var response = {
                    session_id: sessionID
                };
                // Enviar la respuesta como JSON
                res.json(response);
            } else {
                // La contraseña no es correcta, -: enviar este otro mensaje
                res.status(401).json({ errormsg: 'Fallo de autenticación' });
            }
        }
    );
}

// Función para generar un identificador de sesión único
function generateSessionID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}


//----------------------------------------------------------------------------------------------------------------------------------------
// Añadir las rutas al servidor
server.use('/', router);
server.use('/img', express.static(path.join(__dirname, 'img')));


// Añadir las rutas estáticas al servidor.
server.use(express.static('.'));

server.use(express.static(path.join(__dirname, 'html')));
server.use(express.static(path.join(__dirname, 'js')));
server.use(express.static(path.join(__dirname, 'css')));
server.use(express.static(path.join(__dirname, 'img')));

server.use((req, res, next) => {
    console.log('Received request:', req.method, req.url);
    next();
});

// Poner en marcha el servidor ...
server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
