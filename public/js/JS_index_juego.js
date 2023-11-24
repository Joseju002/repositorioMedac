//Función con la que vamos a otra página
function aJuego() {
    window.open("letra_abecedario.html", "_self");
}

//Declaramos un array con las letras del abecedario
var letras = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
//console.log(letras);

//Para obtener el abecedario de la página HTML
let h3 = document.getElementById("abecedario");

//Obtenemos una letra aleatoria del array de las letras
var letraGen = letras[Math.floor(Math.random() * letras.length)];
//console.log(letraGen);

let contador = 0; //Variable donde almacenamos los intentos
let cantIntentos = document.getElementById("intentos"); //Para poder mostrar los intentos en pantalla

let listaIntentos = new Array(); //Array en el se se almacenan todas las letras introducidas (salvo la correcta)

function introducirLetra() { //Función que actúa cuando se introduzca una letra y se haga clic
    let mensaje1 = document.getElementById("mensaje1"); //Obtenemos por ID el elemento en el que indicamos la letra introducida
    mensaje1.textContent = ""; //La vacíamos para que se pueda sobreescribir

    let input = document.getElementById("letraIntr").value; //Obtenemos el valor del input
    //console.log(input);

    /*Comprobamos si lo introducido en el input es o no una letra. Para esto usamos la función
    include(), que sirve para comprobar si existe o no el valor del input en el array.
    Fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/includes */
    if (!letras.includes(input.toUpperCase())) { //Si valor del input no existe en el array
        mensaje1.appendChild(document.createTextNode("El valor no es válido."));
        cantIntentos.appendChild(mensajeIntentos);
    } else { //Si valor del input existe en el array
        if (listaIntentos.includes(input.toUpperCase())) { //Si la letra introducida en el input ya ha sido introducida anteriormente
            mensaje1.appendChild(document.createTextNode("La letra " + input.toUpperCase() + " ya ha sido introducida"));
        } else {
            cantIntentos.textContent = ""; //Para sobreescribir los intentos
            if (input.toUpperCase() === letraGen) {//Si la letra introducida es igual a la letra generada aleatoriamente
                window.open("resultados.html?intentos=" + listaIntentos + "&input=" + input, "_self"); //Abrimos una nueva ventana, pasando como variable el array de los intentos y la letra introducida
            } else if (letras.indexOf(input.toUpperCase()) < letras.indexOf(letraGen)) { //Si la letra aleatoria es posterior a la introducida
                /* Para sustituir un carácter en una cadena de texto, utilizamos la función replace()
                Fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/replace */
                var cambio = h3.innerHTML.replace(input.toUpperCase(), "_"); //Tachamos las letras que ya se han introducido
                h3.textContent = "";
                h3.appendChild(document.createTextNode(cambio));
                mensaje1.appendChild(document.createTextNode("La letra es posterior a " + input.toUpperCase()));
                contador++;
            } else {  //Si la letra aleatoria es anterior a la introducida
                var cambio = h3.innerHTML.replace(input.toUpperCase(), "_");
                h3.textContent = "";
                h3.appendChild(document.createTextNode(cambio));
                mensaje1.appendChild(document.createTextNode("La letra es anterior a " + input.toUpperCase()));
                contador++;
            }
            listaIntentos.push(input.toUpperCase()); //Insertar las letras introducidas (intentos) en un array
            cantIntentos.appendChild(document.createTextNode("Intentos: " + contador)); //Actualizamos el contador en el HTML
            //console.log(listaIntentos);            
        }
    }
}  