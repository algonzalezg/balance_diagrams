window.onload = () => {
    var num_line = 0
    var num_point = 0
    var newLine = true
    var dt = []
    var lines = []
    var selectedPoint = {}
    var text = ''
    //const linesMap = new MyMap()
    //var selectPoints = document.getElementById("arr2");
    //var selectLines = document.getElementById("arr");
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


    const onClick = (e) => {
        let indexDt = 0
        let indexDp = 0
        let indexLine = 0
        for (let i = 0; i < dt.length; i++) {
            for (let j=0; j < dt[i].dataPoints.length; j++){
                if (chart.data[i].dataPoints[j].indexLabel == e.dataPoint.indexLabel){
                    indexDt = i
                    indexDp = j
                    break
                }
            }
        }
        for (let i = 0; i < lines.length; i++){
            if (lines[i].x == e.dataPoint.x && lines[i].y == e.dataPoint.y && lines[i].linea == indexDt){
                indexLine = i
            }
        }
        this.document.getElementById('xVal').value = e.dataPoint.x;
        this.document.getElementById('yVal').value = e.dataPoint.y;
        selectedPoint = {indexDt: indexDt, indexDp: indexDp, indexLine:indexLine};
        selectPointInLine = e.dataPoint.indexLabel;
        chart.render();
	}


    const addNewLine = () => {
        newLine = true
        num_line++;
    }


    // Para que lo veas mas claro el () => {} "equivale" a function() {}, es una forma que tiene js de declarar una funcion anonima. Y como en js se pueden meter funciones en varibles se aprovecha el meterlas en un const.
    const printNewPoint = () => {
        const xVal = parseInt(this.document.getElementById('xVal').value);
        const yVal = parseInt(this.document.getElementById('yVal').value);
        if (newLine) {
            dp = []
            dp.push({
                x: xVal,
                y: yVal,
                indexLabel: num_point
            });
            let newData = {type: tp, click: onClick, dataPoints:dp}
            dt.push(newData)
            lines.push({
                x: xVal,
                y: yVal,
                linea: num_line
            })
            newLine = false
        } else {
            dt[dt.length - 1].dataPoints.push({
                x: xVal,
                y: yVal,
                indexLabel: num_point
            })
            lines.push({
                x: xVal,
                y: yVal,
                linea: num_line
            })
        }
        num_point++;
        chart.render();

    }

    const saveText = () => {
        text = this.document.getElementById('enunciado').value
    }


    const modifyPoint = () => {
        if (selectedPoint == {}){
        let msg = "No ha seleccionado ningún punto a modificar"
        }else{
            const xVal = parseInt(this.document.getElementById('xVal').value);
            const yVal = parseInt(this.document.getElementById('yVal').value);
            chart.options.data[selectedPoint['indexDt']].dataPoints[selectedPoint['indexDp']].x = xVal
            chart.options.data[selectedPoint['indexDt']].dataPoints[selectedPoint['indexDp']].y = yVal
            lines[selectedPoint['indexLine']].x = xVal
            lines[selectedPoint['indexLine']].y = yVal
            chart.render()
        }

    }

    const removePoint = () => {
        if (selectedPoint == {}){
        let msg = "No ha seleccionado ningún punto a modificar"
        }else{
            lines.splice(selectedPoint['indexLine'],1)
            dt[selectedPoint['indexDt']].dataPoints.splice(selectedPoint['indexDp'], 1)
            //chart.data[selectedPoint['indexDt']].dataPoints[selectedPoint['indexDp']].remove()
            chart.render()
        }

    }

    const submit = () => {
            $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:5000/addDiagram",
            data: JSON.stringify({'enunciado': text, 'lineas': lines}),
            success: function (data) {
            console.log(data.title);
            console.log(data.article);
            },
            dataType: "json"
        });


    }


    this.document.getElementById('addPoint').addEventListener('click', printNewPoint);
    this.document.getElementById('addLine').addEventListener('click', addNewLine);
    this.document.getElementById('modPoint').addEventListener('click', modifyPoint);
    this.document.getElementById('removePoint').addEventListener('click', removePoint);
    this.document.getElementById('saveText').addEventListener('click', saveText);
    this.document.getElementById('submit').addEventListener('click', submit);

    //selectLines.addEventListener("change", changeComboPoints);

}
