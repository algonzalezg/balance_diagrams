
window.onload = () => {

    var dataPoints = [{x: 1, y: 10}, {x: 2, y: 13}, {x: 3, y: 18}, {x: 4, y: 20}, {x: 5, y: 17},{x: 6, y: 10}, {x: 7, y: 13}, {x: 8, y: 18}, {x: 9, y: 20}, {x: 10, y: 17}];

    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Dynamic Data"
        },
        axisX: {
            title: "Axis X Title"
        },
        axisY: {
            title: "Units"
        },
        data: [{
            type: "line",
            dataPoints: dataPoints
        }
        ]
    });

    chart.render();

    // Para que lo veas mas claro el () => {} "equivale" a function() {}, es una forma que tiene js de declarar una funcion anonima. Y como en js se pueden meter funciones en varibles se aprovecha el meterlas en un const.
    const printNewPoint = () => {
        // Se estaba cogiendo el valor bien, pero se necesitaba parsear el valor a un entero, parece que el array solo acepta enteros. Antes se cogia "4" y con el parse a int ya coge 4
        const xVal = parseInt(this.document.getElementById('xVal').value);
        const yVal = parseInt(this.document.getElementById('yVal').value);
        console.log('hola', yVal)
        dataPoints.push({
            x: xVal,
            y: yVal
        });

        chart.render();
    }

    // Aqui era donde te decia que quitaras el () => {} (lo llaman arrow function), que vi que sobraba. Si te fijas a la funcion de printNewPoint le he quitado los parentesis.
    // Esto se hace asi porque tu lo que quieres es que cuando se llame a este evento, en este caso click, se pretende que se ejecuten las lineas que trae esa funcion
    // Si tu le pones el nombre y los parentesis lo unico que hace es ejecutar inmediatamente la funcion y no queda asociada al evento.
    this.document.getElementById('addPoint').addEventListener('click', printNewPoint);
}
