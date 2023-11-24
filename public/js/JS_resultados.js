/* Obtenemos los valores que pasamos anteriormente por la URL
Fuente: https://developer.mozilla.org/en-US/docs/Web/API/Location/search */
const valores = window.location.search;
const params = new URLSearchParams(valores);

//Creamos las variables de la URL
var listaIntentos = params.get('intentos').toUpperCase().split(","); //El array se nos devuelve como un string, por lo que usamos split()
var input = params.get('input');

let mensaje1 = document.getElementById("mensaje1");
let tabla = document.getElementById("tablaIntentos");

if (listaIntentos.includes('')) { //En el caso en el que se acierte a la primera
    tabla.remove();
    mensaje1.appendChild(document.createTextNode("¡GENIAL! La letra era la " + input.toUpperCase() + " y has acertado a la primera ;)"));
} else { //Para imprimir en una tabla el array 
    mensaje1.appendChild(document.createTextNode("¡Has acertado! La letra era la " + input.toUpperCase()));
    for (var i = 0; i < listaIntentos.length; i++) { //Recorremos el array y lo vamos insertando en la tabla
        /* Usamos funciones que sirven para crear rows y celdas en las tablas
        Fuente: https://developer.mozilla.org/es/docs/Web/API/HTMLTableElement/insertRow */
        var fila = tabla.insertRow();
        var celdaLetra = fila.insertCell(0);
        celdaLetra.innerHTML = listaIntentos[i]; //Imprimimos por un lado las letras introducidas

        var celdaIntento = fila.insertCell(1);
        celdaIntento.innerHTML = "Intento " + (i + 1); //Imprimimos por otro el intento asociado a la letra
    }

}

//Para volver a la página del juego
function jugarOtraVez() {
    window.open("letra_abecedario.html", "_self");
}