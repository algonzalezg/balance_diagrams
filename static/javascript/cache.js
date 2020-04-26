window.onload = () => {
    const statements = [
        {
            statement: 'Ejercico 1 \n Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius veritatis explicabo hic in numquam quis vero necessitatibus ducimus! Excepturi itaque quia quidem perferendis aperiam molestiae optio rem recusandae aspernatur voluptatem?',
            lines: [
                {
                    y: 1,
                    x: 2
                },
                {
                    y: 4,
                    x: 8
                }
            ]
        },
        {
            statement: 'Ejercico 2',
            lines: [
                {
                    y: 1,
                    x: 2
                },
                {
                    y: 4,
                    x: 8
                }
            ]
        },
        {
            statement: 'Ejercico 3',
            lines: [
                {
                    y: 1,
                    x: 2
                },
                {
                    y: 4,
                    x: 8
                }
            ]
        }
    ];
    let chart = '';
    const main = document.getElementById('slotMain');
    let container = undefined;
    let statement = undefined;
    let descriptionStatement = undefined;
    let btnGoToExercise = undefined;
    let divDropDown = undefined;
    let spanVertical = undefined;
    let spanHorizontal = undefined;
    let dataPoints = Object.assign([], JSON.parse(localStorage.getItem('Exercise1')) || []);

    const renderStatements = () => {
        statements.forEach((statementObj, i) => {
            container = document.createElement('div');
            statement = document.createElement('div');
            descriptionStatement = document.createElement('p');
            btnGoToExercise = document.createElement('button');
            divDropDown = document.createElement('div');
            spanVertical = document.createElement('span');
            spanHorizontal = document.createElement('span');

            container.className = 'container less';
            container.id = `container${i}`;
            statement.className = 'statement';
            btnGoToExercise.id = `goExercice${i}`;
            divDropDown.className = 'drop-down';
            divDropDown.id = `btnDropDown${i}`;
            spanVertical.className = 'vertical-more';
            spanHorizontal.className = 'horizontal';

            descriptionStatement.innerText = statementObj.statement;
            btnGoToExercise.innerText = `Ir al Ejercicio ${i + 1}`;
            btnGoToExercise.addEventListener('click', renderCanvasView);
            divDropDown.addEventListener('click', handlebtnDropDown);

            statement.append(descriptionStatement);
            statement.append(btnGoToExercise);
            divDropDown.append(spanVertical);
            divDropDown.append(spanHorizontal);
            container.append(statement);
            container.append(divDropDown);
            main.append(container);
        });
    }

    const renderCanvasView = (e) => {
        console.log(e);
        const btnId = e.currentTarget.id;
        const numberOfExercise = btnId.slice(-1);
        updateState(numberOfExercise);
        console.log(numberOfExercise);
        container = document.createElement('div');
        statement = document.createElement('div');
        descriptionStatement = document.createElement('p');
        const chartContainer = document.createElement('div');
        const labelX = document.createElement('label');
        const inputX = document.createElement('input');
        const labelY = document.createElement('label');
        const inputY = document.createElement('input');
        const btnAddPoint = document.createElement('button');

        container.className = 'container more';
        container.id = `container${btnId}`;
        statement.className = 'statement';
        descriptionStatement.innerText = history.state.statement;
        chartContainer.id = 'chartContainer';
        chartContainer.className = 'chartContainer';
        labelX.htmlFor = 'xVal';
        labelX.innerText = 'Eje X:';
        inputX.type = 'text';
        inputX.id = 'xVal';
        inputX.name = 'xVal';
        labelY.htmlFor = 'yVal';
        labelY.innerText = 'Eje Y:';
        inputY.type = 'text';
        inputY.id = 'yVal';
        inputY.name = 'yVal';
        btnAddPoint.id = 'addPoint';
        btnAddPoint.innerText = 'Añadir punto';
        btnAddPoint.addEventListener('click', printNewPoint);

        deleteMainNodes();

        statement.append(descriptionStatement);
        container.append(statement);
        main.append(container);
        main.append(chartContainer);
        main.append(labelX);
        main.append(inputX);
        main.append(labelY);
        main.append(inputY);
        main.append(btnAddPoint);

        printPoints();
    }

    const deleteMainNodes = () => {
        const nodesLength = main.childNodes.length;
        for (let index = 0; index < nodesLength; index++) {
            const node = main.childNodes[0];
            main.removeChild(node);
        }
    }

    const updateState = (index) => {
        const selectedExercise = statements[index];
        history.replaceState(selectedExercise, 'Mi Ejercicio', `/Ejercicio${index + 1}`);
    }

    const printPoints = () => {
        dataPoints = Object.assign(dataPoints, history.state.lines);
        chart = new CanvasJS.Chart("chartContainer", {
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
                dataPoints
            }]
        });

        chart.render();
    }

    const handlebtnDropDown = (eve) => {
        const divVertical = eve.currentTarget.childNodes[1];
        const nameStyle = divVertical.className;
        const index = eve.currentTarget.id.slice(-1);
        const isCurrentMore = nameStyle.indexOf('more') !== -1;
        const containerToEdid = document.getElementById(`container${index}`);
        if (isCurrentMore) {
            divVertical.className = 'vertical-less';
            containerToEdid.className = 'container more';
        } else {
            divVertical.className = 'vertical-more';
            containerToEdid.className = 'container less';
        }
        console.log(divVertical, nameStyle);
    }

    const printNewPoint = () => {
        // Se estaba cogiendo el valor bien, pero se necesitaba parsear el valor a un entero, parece que el array solo acepta enteros. Antes se cogia "4" y con el parse a int ya coge 4
        const xVal = parseInt(this.document.getElementById('xVal').value);
        const yVal = parseInt(this.document.getElementById('yVal').value);
        dataPoints.push({
            x: xVal,
            y: yVal
        });

        savePointsIntoCache();

        chart.render();
    }

    const savePointsIntoCache = () => {
        localStorage.setItem('Exercise1', JSON.stringify(dataPoints));
    }

    renderStatements();
}
