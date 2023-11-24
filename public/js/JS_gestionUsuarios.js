function iniciarSesion() {
    var usuario = document.getElementById('user').value;
    var contrasena = document.getElementById('pass').value;

    //HAGO LA PETICION AL SERVIDOR Y GUARDO LA RESPUESTA EN LA VARIABLE PROMISE
    var promise = $.ajax({
        type: 'POST',
        url: '/loginNuevo',

        //Lo que envío (en forma de JSON)
        data:JSON.stringify({username:usuario, password:contrasena}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });

    var mensajeError = document.getElementById('errorcito');
    mensajeError.textContent = "";

    //TRATAR LA RESPUESTA QUE ME DA EL SERVIDOR
    promise.always(function(data) {
        console.log("Entra");
        if (data.res == "login true") { //Si el login es exitoso
            document.cookie = "usuario=" + data.res.user;
            document.cookie = "contrasena=" + data.res.password;
            window.location.replace("/rutaSegura");
        } else if (data.res == "login invalid") { //Si no es exitoso
            mensajeError.appendChild(document.createTextNode("El usuario que estás introduciendo no existe."));
        } else if (data.res == "login failed") { //Ha faltado un parametro
            mensajeError.appendChild(document.createTextNode("Los parametros no están completos."));
        } else { //Por si los datos son corruptos u otra cosa en vez de hacer que el cliente espere
            window.alert("Error");
        }
    });
}

function registrarUsuario() {
    var usuario = document.getElementById('user').value;
    var contrasena = document.getElementById('pass').value;

    //HAGO LA PETICION AL SERVIDOR Y GUARDO LA RESPUESTA EN LA VARIABLE PROMISE
    var promise = $.ajax({
        type: 'POST',
        url: '/registrarNueva',

        //Lo que envío (en forma de JSON)
        data:JSON.stringify({username:usuario, password:contrasena}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });

    var mensajeError = document.getElementById('errorcito');
    mensajeError.textContent = "";

    //TRATAR LA RESPUESTA QUE ME DA EL SERVIDOR
    promise.always(function(data) {
        console.log("Entra");
        if (data.res == "register true") { //Si el registro es exitoso
            console.log("Entro");
            document.cookie = "usuario=" + data.res.user;
            document.cookie = "contrasena=" + data.res.password;
            window.location.replace("/loginNuevo");
        } else if (data.res == "register exists") { //Si el usuario ya existe
            mensajeError.appendChild(document.createTextNode("Usuario existente."));
        } else if (data.res == "register failed") { //Ha faltado un parametro
            mensajeError.appendChild(document.createTextNode("Los parametros no están completos."));
        } else { //Por si los datos son corruptos u otra cosa en vez de hacer que el cliente espere
            window.alert("Error");
        }
    });
}

function obtenerUsuarios() {
    var usuario;

    var promise = $.ajax({
        type: 'POST',
        url: '/rutaSegura',

        //Lo que envío (en forma de JSON)
        data:JSON.stringify({username:usuario}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });   
    
    promise.always(function (data) {
        var tabla = document.getElementById('tablaUsuarios');
        console.log(data);

        data.forEach(function (usuario) {
            var fila = document.createElement('tr');
            var nombreUsuario = document.createElement('td');

            nombreUsuario.textContent = usuario.nombre;

            fila.appendChild(nombreUsuario);
            tabla.appendChild(fila);
        });
    });
}