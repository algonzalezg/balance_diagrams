window.onload = () => {
    var enunciados = JSON.parse(document.getElementById('mydiv').dataset.diagrams);
    var diagramSelect = document.getElementById("diagramSelect");


    this.document.getElementById('submitSelection').addEventListener('click', submitSelection);

}
