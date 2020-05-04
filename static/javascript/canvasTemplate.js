
window.onload = () => {
    var num_line = 0
    var num_point = 0
    var dt_dict = {}
    var points = Object.assign([], JSON.parse(localStorage.getItem('points')) || []);
    var dt = [{type:'line', dataPoints:[]}]
    var lines = Object.assign([], JSON.parse(localStorage.getItem('lines')) || []);
    var dp = []
    var actual_line = 0
    var pointsChecked = false
    var newLine = true
    const btnDropDown = document.getElementById('btnDropDown');
    const statement = document.getElementById('container');
    //var geocode = JSON.parse(document.getElementById("mydiv").dataset.geocode);
    var actual_diagram = 0
    var diagrams = JSON.parse(document.getElementById('mydiv').dataset.diagrams);
    var diagrams_points = diagrams[actual_diagram].lineas
    var dataBackup = Object.assign([], JSON.parse(localStorage.getItem('dataBackup')) || []);
    //var myval = {{myval}}
    //const linesMap = new MyMap()
    var selectPoints = document.getElementById("arr2");
    var selectLines = document.getElementById("arr");
    var selectedPoint = -1
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

    const updateChartFromCache = () => {
        if (lines.length > 0){

        }
    }

//    const cleanLines = () => {
//        let length_aux = 0
//        if (num_point > 0){
//            length_aux = dt.length
//        }
//        for (let i = 0; i < dataBackup.length; i++) {
//            let newData = {type: dataBackup[i].type, click: dataBackup[i].click, dataPoints: dataBackup[i].dataPoints}
//            dt.push(newData)
//        }
//        for (let j = 0; j < length_aux; j++) {
//            lines.pop()
//            chart.data[0].remove()
//        }
//        setTimeout(chart.render(), 2000)
//        newLine = true
//    }

    const onClick = (e) => {
        let index = 0
        for (let i = 0; i < dt.length; i++) {
           if (chart.data[i].dataPoints[0].indexLabel == e.dataPoint.indexLabel){
               index = i
               break
           }
        }
        if (pointsChecked){
            //delete dt[index]
            //chart.data[index].remove()
            if (newLine) {
                dp = []
                dp.push({
                    x: e.dataPoint.x,
                    y: e.dataPoint.y,
                    indexLabel: e.dataPoint.indexLabel
                });
                let newData = {type: tp, click: onClickLine, dataPoints: dp}
                dt.push(newData)
                let line_aux = []
                line_aux.push({
                    x: e.dataPoint.x,
                    y: e.dataPoint.y
                })
                lines.push(line_aux)
                num_line++;
                newLine = false
            } else {
                dt[dt.length - 1].dataPoints.push({
                    x: e.dataPoint.x,
                    y: e.dataPoint.y,
                    indexLabel: e.dataPoint.indexLabel
                })
                lines[lines.length -1].push({
                    x: e.dataPoint.x,
                    y: e.dataPoint.y
                })
            }
            chart.data[index].remove()
		    chart.render();
		}
		else{
		    this.document.getElementById('xVal').value = e.dataPoint.x;
            this.document.getElementById('yVal').value = e.dataPoint.y;
            selectedPoint = index
            chart.render();
		}
		//line.push()
		//refreshChart()
		//alert(  e.dataSeries.type + ", dataPoint { x:" + e.dataPoint.indexLabel + ", y: "+ e.dataPoint.y + " }" );
	}


    const cleanLines = () => {
        let length_aux = dt.length
        for (let i = 0; i < dataBackup.length; i++) {
            let newData = {type: tp, click: onClick, dataPoints: [{x:dataBackup[i].x, y:dataBackup[i].y, indexLabel:dataBackup[i].indexLabel}]}
            dt.push(newData)
        }
        for (let j = 0; j < length_aux; j++) {
            lines.pop()
            chart.data[0].remove()
        }
        setTimeout(chart.render(), 2000)
        newLine = true
    }

    if (dataBackup.length > 0){
        //updateChartFromCache()
        pointsChecked = true
        cleanLines();
    }

    const getLines = () => {
        let diagrams_lines = []
        let num_line_aux = 0
        let line_aux = []
        for (var i = 0; i < diagrams_points.length; i++) {
            if (diagrams_points[i].linea == num_line_aux){
                delete diagrams_points[i]['linea']
                line_aux.push(diagrams_points[i])
            } else {
                delete diagrams_points[i]['linea']
                diagrams_lines.push(line_aux)
                line_aux = []
                line_aux.push(diagrams_points[i])
                num_line_aux++
            }
        }
        diagrams_lines.push(line_aux)
        return diagrams_lines
    }

    var diagramsLines = getLines()

    const onClickLine = (e) => {
        alert(  e.dataSeries.type+ ", dataPoint { x:" + e.dataPoint.x + ", y: "+ e.dataPoint.y + " }" );
    }

    const savePointsIntoCache = () => {
        localStorage.setItem('dataBackup', JSON.stringify(points));
    }

    const addNewLine = () => {
        newLine = true
    }

    // Para que lo veas mas claro el () => {} "equivale" a function() {}, es una forma que tiene js de declarar una funcion anonima. Y como en js se pueden meter funciones en varibles se aprovecha el meterlas en un const.
    const printNewPoint = () => {
        const xVal = parseInt(this.document.getElementById('xVal').value);
        const yVal = parseInt(this.document.getElementById('yVal').value);
        dp = []
        dp.push({
            x: xVal,
            y: yVal,
            indexLabel: String(num_point)
        });
        tp = 'line'
        let newData = {type: tp, click: onClick, dataPoints: dp}
        dt.push(newData)
        //dt_dict[num_point] = newData
        points = points.concat(dp)
        //savePointsIntoCache()
        dp = []
        if (num_point == 0){
            chart.data[0].remove()
        }
        num_point++;
        chart.render();
    }

    const checkPoints = () => {
        if (!pointsChecked){
            let diagramsPoints_aux = Object.assign([], diagrams_points)
            for (let i = 0; i < points.length; i++) {
                pointsChecked = false
                for (let j = 0; j < diagramsPoints_aux.length; j++) {
                    if ((points[i].x == diagramsPoints_aux[j].x) && (points[i].y == diagramsPoints_aux[j].y)){
                        diagramsPoints_aux.splice(j,1)
                        pointsChecked = true
                    }
                }
                if (!pointsChecked){
                    alert( "El punto x:"+ String(points[i].x) + ", y:"+ String(points[i].y) + " no es correcto" )
                    diagramsPoints_aux = diagrams[actual_diagram].lineas
                    break;
                }
            }
            if (pointsChecked && diagramsPoints_aux.length > 0){
                alert( "Faltan puntos por introducir." )
                diagramsPoints_aux = diagrams[actual_diagram].lineas
            } else if (pointsChecked){
                alert( "Todos los puntos añadidos son correctos. Añada las lineas." )
            }
            dataBackup = Object.assign([],dt)
            savePointsIntoCache()
        }else{
            alert("Los puntos ya han sido validados.")
        }
    }

    function objectEquals(x, y) {
        'use strict';
        if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
        if (x.constructor !== y.constructor) { return false; }
        if (x instanceof Function) { return x === y; }
        if (x instanceof RegExp) { return x === y; }
        if (x === y || x.valueOf() === y.valueOf()) { return true; }
        if (Array.isArray(x) && x.length !== y.length) { return false; }
        if (x instanceof Date) { return false; }
        if (!(x instanceof Object)) { return false; }
        if (!(y instanceof Object)) { return false; }
        var p = Object.keys(x);
        return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
        p.every(function (i) { return objectEquals(x[i], y[i]); });

    }

    const cleanCache = () => {
        localStorage.setItem('dataBackup', JSON.stringify([]))
    }

    const checkLines = () => {
        let diagramsLines_aux = Object.assign([], diagramsLines)
        let linesChecked = false
        let msg = ""
        if (lines.length == diagramsLines_aux.length){
            for (let i = 0; i < lines.length; i++) {
                linesChecked = false
                for (let j = 0; j < diagramsLines_aux.length; j++) {
                    if (objectEquals(lines[i],diagramsLines_aux[j]) || objectEquals(lines[i],diagramsLines_aux[j].reverse())){
                        diagramsLines_aux.splice(j,1)
                        linesChecked = true
                    }
                }
                if (!linesChecked){
                    msg = "La linea "+ String(i) +" no es correcta"
                    break;
                }
            }
        }else{
            msg = "El número de lineas no es correcto"
        }
        if (linesChecked && diagramsLines_aux.length > 0){
            msg = "Faltan lineas por introducir."
        } else if (linesChecked){
           msg = "Todos las lineas son correctas. Enhorabuena."
        }
        alert(msg)
    }


    const changeComboPoints = () => {
        while (selectPoints.options.length > 0) {
            selectPoints.remove(0);
        }

        let selectedLine = dt[selectLines.value]
        for (let i = 0; i < selectedLine.dataPoints.length; i++) {
            selectPoints.options[i]=new Option(String(selectedLine.dataPoints[i].indexLabel));
        }
    }

    const modifyPoint = () => {
        if (selectedPoint == -1){
        let msg = "No ha seleccionado ningún punto a modificar"
        }else{
            const xVal = parseInt(this.document.getElementById('xVal').value);
            const yVal = parseInt(this.document.getElementById('yVal').value);
            chart.options.data[selectedPoint].dataPoints[0].x = xVal
            chart.options.data[selectedPoint].dataPoints[0].y = yVal
            chart.render()
        }
    }


    btnDropDown.addEventListener('click', () => {
        const divVertical = btnDropDown.childNodes[1];
        const nameStyle = divVertical.className;
        const isCurrentMore = nameStyle.indexOf('more') !== -1;
        if (isCurrentMore) {
            divVertical.className = 'vertical-less';
            statement.className = 'container more';
        } else {
            divVertical.className = 'vertical-more';
            statement.className = 'container less';
        }
        console.log(divVertical, nameStyle);
    })


    this.document.getElementById('addPoint').addEventListener('click', printNewPoint);
    this.document.getElementById('checkPoints').addEventListener('click', checkPoints);
    this.document.getElementById('addLine').addEventListener('click', addNewLine);
    this.document.getElementById('cleanLines').addEventListener('click', cleanLines);
    this.document.getElementById('checkLines').addEventListener('click', checkLines);
    this.document.getElementById('ModPoint').addEventListener('click', modifyPoint);
    this.document.getElementById('BorrarCache').addEventListener('click', cleanCache);
    //selectLines.addEventListener("change", changeComboPoints);

}
