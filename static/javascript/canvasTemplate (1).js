
window.onload = () => {
    var num_line = 0
    var num_point = 0
    var dt_dict = {}
    var dt = []
    var dp = []
    //const linesMap = new MyMap()
    var selectPoints = document.getElementById("arr2");
    var selectLines = document.getElementById("arr");
    //[{x: 1, y: 10}, {x: 2, y: 13}, {x: 3, y: 18}, {x: 4, y: 20}, {x: 5, y: 17},{x: 6, y: 10}, {x: 7, y: 13}, {x: 8, y: 18}, {x: 9, y: 20}, {x: 10, y: 17}];
    var tp = "line"
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Diagrama de Equilibrio"
        },
        axisX: {
            title: "Axis X Title"
        },
        axisY: {
            title: "Units"
        },
        data: dt
    });

    chart.render();

    const addNewLine = () => {
    //Se añadira una linea con la informacion aportada anteriormente y setearan los atributos de la nueva linea a vacio
        var newData = {type: tp, dataPoints: dp}
        //var newLine = {id: num_line, data:newData}
        dt.push(newData)
        dt_dict[num_line] = newData
        tp = 'line'
        dp = []
        chart.render();
        for (var j = 0; j <= num_line; j++) {
            selectLines.options[j]=new Option(String(j));
        }
        num_line++;
    }


    // Para que lo veas mas claro el () => {} "equivale" a function() {}, es una forma que tiene js de declarar una funcion anonima. Y como en js se pueden meter funciones en varibles se aprovecha el meterlas en un const.
    const printNewPoint = () => {
        // Se estaba cogiendo el valor bien, pero se necesitaba parsear el valor a un entero, parece que el array solo acepta enteros. Antes se cogia "4" y con el parse a int ya coge 4
        const xVal = parseInt(this.document.getElementById('xVal').value);
        const yVal = parseInt(this.document.getElementById('yVal').value);
        dp.push({
            x: xVal,
            y: yVal,
            indexLabel: String(num_point)
        });
        //changeComboPoints()
        if (num_line == 0) {
            for (var i = 0; i <= num_point; i++) {
                selectPoints.options[i]=new Option(String(i));
            }
        }
        num_point++;
        //chart.render();

    }

    const changeComboPoints = () => {
        var selectedLine = dt_dict[selectLines.value]
        for (var i = 0; i < selectedLine.dataPoints.length; i++) {
            selectPoints.options[i]=new Option(String(selectedLine.dataPoints[i].indexLabel));
        }
    }

    const modifyPoint = () => {
        var selectedLine = selectLines.value
        var selectedPoint = selectPoints.value
        var TempDataPoints = dt_dict[selectedLine].dataPoints
        for (var i = 0; i < TempDataPoints.length; i++){
            if (TempDataPoints[i].indexLabel == selectedPoint){
                this.document.getElementById('xVal').value = String(TempDataPoints[i].xVal);
                this.document.getElementById('yVal').value = String(TempDataPoints[i].yVal);
                break
            }
        }

    }

    this.document.getElementById('addPoint').addEventListener('click', printNewPoint);
    this.document.getElementById('addLine').addEventListener('click', addNewLine);
    this.document.getElementById('ModPoint').addEventListener('click', modifyPoint);
    selectLines.addEventListener("change", changeComboPoints);

}
