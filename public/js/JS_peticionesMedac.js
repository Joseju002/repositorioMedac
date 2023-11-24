function peticionGet() {
    var peticion_http = new XMLHttpRequest();

    //Hago que la peticion quede a la espera de respuesta y cuando llegue ejecute la funcion
    peticion_http.onreadystatechange = muestraContenido;

    //Defino mi peticion, tipo GET, la ruta /saluda y asincrona
    peticion_http.open('GET', '/saluda', true /* TRUE significa que es asincrono */);
    //Envio la peticion
    peticion_http.send(null);

    function muestraContenido() {
        //Compruebo que el estado de la petición está finalizada (4)
        if (peticion_http.readyState == 4) {
            //Compruebo que el estado de la respuesta sea exitoso (200)
            if (peticion_http.status == 200) {
                //Alerta con el mensaje
                alert(peticion_http.responseText);
            }
        }
    }
}

function peticionPost() {
    var peticion_http = new XMLHttpRequest();

    //Hago que la peticion quede a la espera de respuesta y cuando llegue ejecute la funcion
    peticion_http.onreadystatechange = muestraContenido;

    //Defino mi peticion, tipo POST, la ruta /login y asincrona
    peticion_http.open('POST', '/login', true /* TRUE significa que es asincrono */);
    peticion_http.setRequestHeader('Content-Type', 'application/json');
    //Envio la peticion
    peticion_http.send(JSON.stringify({username:"paco", password:"1234"}));

    function muestraContenido() {
        //Compruebo que el estado de la petición está finalizada (4)
        if (peticion_http.readyState == 4) {
            //Compruebo que el estado de la respuesta sea exitoso (200)
            if (peticion_http.status == 200) {
                //Alerta con el mensaje
                window.location.replace("/rutaSegura");
            }
        }
    }
}