console.clear();

var Layer = function (canvasId) {
    // Con el getContext cogemos el contexto del canvas. Le pasamos como parametro 2d de 2 dimensiones, tambien se le puede pasar 3d pero no se usa.
    var canvas  = document.getElementById(canvasId),
        context = canvas.getContext('2d'),
        api     = {};

    // Methods
    // Canvas no tiene un metodo propio para limpiar por lo que se utiliza este "truco" que consiste en redimensionar el canvas y esto provoca que el canvas
    // se limpie automaticamente
    api.clean = function () {
        canvas.width = canvas.width;
    };

    api.drawLine = () => {
        context.beginPath();
        // Indica donde comienza la linea
        context.moveTo(400, 300);
        // Indica a donde vamos a mover la linea
        context.lineTo(450, 250);
        context.lineTo(500, 300);
        // Esta funcion se encarga de cerrar lo que seria una linea
        context.closePath();

        // Propiedades de la linea

        // Color de la linea
        context.strokeStyle = 'red';
        // Tamaño de la linea
        context.lineWidth = '5';
        // Estilo de la union de flechas
        context.lineJoin = 'bevel';

        // Ejecuta lo anterior
        context.stroke();
    };

    api.drawCircle = function () {
        context.beginPath();
        context.arc(400, 300, 100, 0, 2 * (Math.PI), true);

        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = 'white';
        context.stroke();
    };

    // Crear un lienzo degradado
    api.drawGradient = function () {
        // Primero debemos declarar un objeto poligonal que sera al que se le aplique el liezo, si no no pinta nada
        // context.rect(0, 0, 800, 600);
        this.drawCircle();

        var gradient = context.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#8ED6FF');
        gradient.addColorStop(1, '#004CB3');

        context.fillStyle = gradient;
        context.fill();
    };

    api.drawImage = function () {
        var imgObject = new Image();
        imgObject.src = 'images/plot_vacio_Tfg.png'

        // Con esto pintamos la imagen
        imgObject.onload = function () {
            context.drawImage(imgObject, 0, 0, 800, 600);

            var image = context.getImageData(0, 0, 800, 600);
            // Con el image.data obtenemos una matriz de pixeles, cada pixel ocupa 4 posiciones. Ej
            // pixel0 = [R,G,B,C] donde los tres primeros son los colores y el ultimo es el canal.
            // Si hubiera una imagen con tres pixels el array tendra doce posiciones.
            var pixels = image.data;

            // Con esto podemos aplicar filtros a la imagen como una escala de grises o invertir los colores
            for (let index = 0; index < pixels.length; index++) {
                var red = pixels[index * 4];
                var green = pixels[index * 4 + 1];
                var blue = pixels[index * 4 + 2];

                // Filtro para escala de grises
                // var grey = (red + green + blue) / 3;

                // pixels[index * 4] = grey;
                // pixels[index * 4 + 1] = grey;
                // pixels[index * 4 + 2] = grey;

                // Filtro para invertir colores
                pixels[index * 4] = 255 - red;
                pixels[index * 4 + 1] = 255 - green;
                pixels[index * 4 + 2] = 255 - blue;
            }
            context.putImageData(image, 0, 0);
        };
    };

    // Para guardar el canvas que has creado
    api.saveCanvas = function () {
        // Esto convierte el canvas en base64
        var result = canvas.toDataURL();

        var link = document.createElement('a'),
            url = result,
            filename = 'plot_vacio_Tfg.png';
            
        link.setAttribute('href', url);
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return api;
};
