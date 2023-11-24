//Requires
const express = require('express');
var fs = require("fs");
var session = require('express-session');

//Rutas a tus archivos de certificado y clave privada
const privateKey = fs.readFileSync('miclave.key', 'utf-8');
const certificate = fs.readFileSync('micertificado.pem', 'utf-8');
var credentials = { key: privateKey, cert: certificate, passphrase: '123456'};
//var https = require('https');

//Para usar la base de datos en este fichero
const mongoose = require('mongoose');
const {usuario, conectarDB} = require('./conexionBBDD.js');

//var cookieParser = require('cookie-parser');
const app = express();
//var server = https.createServer(credentials, app);
var server = require('http').Server(app);


//Librerías
var port = process.env.PORT || 3001; //Puerto, para no repetirlo

//Dependencias
app.use(express.json()); //Para leer ficheros json
app.use(express.static('public')); //Para que se tenga acceso a toda la carpeta public
app.use(session({ //Para el inicio de sesion
    secret: 'cadena secreta',
    resave: false,
    saveUninitialiazed: true,
    cookie: { secure:false }
}));
//app.use(cookieParser('secreto aqui'));
var usuarios = cargarUsuarios(); //Aqui se almacenarán los usuarios del archivo JSON

//Para el inicio de sesión del usuario
var auth = function(req, res, next) {
    //Si el usuario tiene los permisos
    if (req.session && req.session.user === "admin" && req.session.admin) {
        return next(); //Continua
    } else { //Si el usuario no tiene los permisos
        return res.sendStatus(401); //Frena
    }
}



//CUANDO ENTRA EN EL SERVIDOR CON GET

//Raiz
app.get('/', (req, response) => {
    //Lee el fichero, en este caso, el index.html
    var contenido = fs.readFileSync("+./public/index.html");

    //Lo que responde en el cliente es un fichero HTML
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

//Para iniciar sesion
app.get('/login', (req, response) => {
    var contenido = fs.readFileSync("./public/formulario.html");

    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

//Para crear cuenta
app.get('/registro', (req, response) => {
    var contenido = fs.readFileSync("./public/registro.html");

    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

//Para iniciar sesion (BBDD)
app.get('/loginNuevo', (req, response) => {
    var contenido = fs.readFileSync("./public/formulario.html");

    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

//Para crear cuenta (BBDD)
app.get('/registrarNueva', (req, response) => {
    var contenido = fs.readFileSync("./public/registro.html");

    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

//Cuando la sesion esta iniciada
app.get('/rutaSegura', /*Ruta en la que va a entrar*/auth, (req,response) => {
    var contenido = fs.readFileSync("./public/logeado.html");

    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

app.get("/saluda", function(req, res) {
    res.send("Hola mundo");
});

app.get('/peticionesMedac', (req, response) => {
    var contenido = fs.readFileSync("./public/peticionesMedac.html");

    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

//Funciones POST

app.post('/login', function(req, res){
    if (!req.body.username || !req.body.password) {
        res.send({"res":"login failed"});
    } else {
        const usuarioEncontrado = usuarios.find(usuario =>
            usuario.username == req.body.username && usuario.password == req.body.password    
        );

        if (usuarioEncontrado) {
            req.session.user = "admin";
            req.session.admin = true;
            return res.send({"res":"login true"});
        } else {
            res.send({"res":"login invalid"});
        }
    }
});

app.post('/loginNuevo', async function(req, res){
    if (!req.body.username || !req.body.password) {
        res.send({"res":"login failed"});
    } else {
        try {
            //Con 'await' le indicamos que el programa no continúe hasta que se ejecute la línea de comando
            usuarioEncontrado = await usuario.findOne({nombre: req.body.username, password: req.body.password});
        } catch (err) {
            console.error('Error al iniciar sesion: ', err);
        }

        if (usuarioEncontrado) {
            req.session.user = "admin";
            req.session.admin = true;
            return res.send({"res":"login true"});
        } else {
            res.send({"res":"login invalid"});
        }
    }
});

app.post('/registro', function(req, res){
    if (!req.body.username || !req.body.password) {
        res.send({"res":"register failed"});
    } else {
        let usuarioExiste = false;
        //Comprobamos si ya existe el usuario que queremos registrar
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].username == req.body.username) {
                usuarioExiste = true;
            }
        }
        if (usuarioExiste) {
            res.send({"res":"register exists"});
        } else {
            res.send({"res":"register true"});
        }
    }
});

app.post('/registrarNueva', async function(req, res){
    if (!req.body.username || !req.body.password) {
        res.send({"res":"register failed"});
    } else {
        try {
            //Con 'await' le indicamos que el programa no continúe hasta que se ejecute la línea de comando
            usuarioExistente = await usuario.findOne({nombre: req.body.username});
        } catch (err) {
            console.error('Error al crear usuario: ', err);
        }
        if (usuarioExistente) {
            req.session.user = "admin";
            req.session.admin = true;
            res.send({"res":"register exists"});
        } else {
            const nuevoUsuario = new usuario( {
                nombre: req.body.username,
                password:req.body.password
            });
            try {
                nuevoUsuario.save();
                console.log('Nuevo usuario creado: ', nuevoUsuario);
                res.send({"res":"register true"});
            } catch (err) {
                console.error('Error al crear usuario: ', err);
            }
        }
        
    }
});

app.post('/rutaSegura', auth /* No está de más por seguridad */, async function (req, res) {
    try {
        //Devuelve solo los nombres de los usuarios
        usuarios = await usuario.find({}).select("nombre");
        res.json(usuarios);
    } catch (err) {
        console.error("Error al buscar usuarios: ", err);
    }
});

//Para tirar el servidor (para probar con forever)
app.post('/error', function(req,res){
    process.exit(1);
});

//Funciones para gestionar usuarios
function guardarUsuarios (usuarios) {
    //Serializar el array a JSON
    const json = JSON.stringify(usuarios); //Funciona como un serialize de PHP
    //Escribimos en un archivo
    fs.writeFileSync('usuarios.json', json, 'utf8', function(error) {
        if (error) {
            console.log('Ha ocurrido un error al guardar los usuarios', error);
        } else {
            console.log('Usuarios guardados correctamente SIUUUU');
        }
    });
}

function cargarUsuarios () {
    try {
        //Lee el archivo
        const data = fs.readFileSync('usuarios.json', 'utf8');
        //Deserializar el JSON a un objeto JavaScript
        console.log("-=###=- USUARIOS CARGADOS -=###=-");
        console.log(JSON.parse(data));
        return JSON.parse(data);
    } catch (error) {
        //Si hay un error al leer el archivo, devuelve el error
        console.log('Error al leer los usuarios', error);
        return []; //Devuelve un array vacío
    }
}

conectarDB();
//Funcion MAIN del servidor
server.listen (port, () => {
    console.log('Aplicacion escuchando en el puerto 3000');
});
