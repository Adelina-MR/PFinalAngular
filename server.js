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
server.use(bodyParser.json());

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
function processLogin(req, res, db) {
    var correo = req.body.user;
    var password = req.body.passwd;

    db.get(
        // consulta y parámetros cuyo valor será usado en los '?'
        'SELECT * FROM users WHERE correo=?', correo,
        // funcion que se invocará con los datos obtenidos de la base de datos
        (err, row) => {
            if (row == undefined) {
                // La consulta no devuelve ningun dato -: no existe el usuario
                res.json({ errormsg: 'El usuario no existe'});
            } else if (row.password === password) {
                // La contraseña es correcta
                // Asociar el userID a los datos de la sesión
                req.session.userID = row.id; // solo el id del usuario registrado

                // Preparar los datos a enviar al navegador (AngularJS)
                var data = {
                    uid: row.uid,
                    correo: row.correo,
                    nombre: row.nombre,
                    password: row.password,
                    rol: row.rol
                };

                // enviar en la respuesta serializado en formato JSON
                res.json(data);
            } else {
                // La contraseña no es correcta, -: enviar este otro mensaje
                res.json({ errormsg: 'Fallo de autenticación'});
            }
        }
    );
}

function verificarUsuario(req) {
    return req.session.userID != undefined;
}

// Ruta para mostrar el archivo Login.html
router.get('/login', (req, res) => {
    // Obtener la ruta completa del archivo Login.html
    const filePath = 'C:\\Users\\Adelina\\Desktop\\Universidad\\4ºAÑO\\Laboratorio de Ingeniería de Software\\Practica3_Angular\\html\\Login.html';

    // Enviar el archivo como respuesta al cliente
    res.sendFile(filePath);
});

// Ruta para mostrar el archivo Login.html cuando se acceda a la raíz
router.get('/', (req, res) => {
    // Obtener la ruta completa del archivo Login.html
    const filePath = 'C:\\Users\\Adelina\\Desktop\\Universidad\\4ºAÑO\\Laboratorio de Ingeniería de Software\\Practica3_Angular\\html\\Login.html';

    // Enviar el archivo como respuesta al cliente
    res.sendFile(filePath);
});

// Ahora la acción asociada al login sería:
router.post('/login', (req, res) => {
    // Comprobar si la petición contiene los campos ('user' y 'passwd')
    if (!req.body.user || !req.body.passwd) {
        res.json({ errormsg: 'Peticion mal formada'});
    } else {
        // La petición está bien formada -> procesarla
        processLogin(req, res, db);
    }
});


//----------------------------------------------------------------------------------------------------------------------------------------
// Añadir las rutas al servidor
server.use('/', router);

// Añadir las rutas estáticas al servidor.
server.use(express.static('.'));

server.use(express.static(path.join(__dirname, 'js')));
server.use(express.static(path.join(__dirname, 'css')));
server.use(express.static(path.join(__dirname, 'html')));

// Poner en marcha el servidor ...
server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
