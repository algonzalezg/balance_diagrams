window.onload = function () {

//	var dps = [{x: 1, y: 10}, {x: 2, y: 13}, {x: 3, y: 18}, {x: 4, y: 20}, {x: 5, y: 17},{x: 6, y: 10}, {x: 7, y: 13}, {x: 8, y: 18}, {x: 9, y: 20}, {x: 10, y: 17}];

    var dps = [{y: 10}, {y: 13}, {y: 18}, {y: 20}];

	var chart = new CanvasJS.Chart("chartContainer", {
		title: {
			text: "Adding & Updating dataPoints"
		},
		data: [
		{
			type: "spline",
			dataPoints: [
				{ y: 10 },
				{ y:  4 },
				{ y: 18 },
				{ y:  8 }
			]
		}
		]
	});
	chart.render();

	$("#addDataPoint").click(function () {

	var length = chart.options.data[0].dataPoints.length;
	chart.options.title.text = "New DataPoint Added at the end";
	chart.options.data[0].dataPoints.push({ y: 25 - Math.random() * 10});
	chart.render();

	});

	$("#updateDataPoint").click(function () {

	var length = chart.options.data[0].dataPoints.length;
	chart.options.title.text = "Last DataPoint Updated";
	chart.options.data[0].dataPoints[length-1].y = 15 - Math.random() * 10;
	chart.render();

	});
}
