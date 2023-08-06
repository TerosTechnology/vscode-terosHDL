"use strict";
// default
const vscode = acquireVsCodeApi();
let last_svg = "";

document.getElementById("export-as-image").onclick = function() {export_message("image")};

function export_message(message) {
    console.log(last_svg.outerHTML)
    vscode.postMessage({
        command: 'export',
        text: last_svg.outerHTML
    });
}

// Handle the message inside the webview
window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sen
    switch (message.command) {
        case 'update':
            update_graph(message.message);
            break;
        case 'clear':
            clear();
            break;
    }
});

var graph = null;
function update_graph(dot) {
    let viz = new Viz();
    viz.renderSVGElement(dot)
        .then(function (element) {
            const container = document.getElementById("container");
            if (graph !== null) {
                container.removeChild(graph);
            }
            element.setAttribute('style', 'width: 100vw; height: 100%;');

            container.appendChild(element);
            graph = element;
            last_svg = element;

            panZoom = svgPanZoom(element, panConfig);
            panZoom.zoom(0.8);
            panZoom.center();
            panZoom.resize();
            trimZoomBtns();
        });
}
function clear() {
    if (graph !== null) {
        document.body.removeChild(graph);
        graph = null;
    }
}
function trimZoomBtns() {
    $('#svg-pan-zoom-zoom-in rect.svg-pan-zoom-control-background').attr('rx', 300);
    $('#svg-pan-zoom-zoom-out rect.svg-pan-zoom-control-background').attr('rx', 300);
    $('#svg-pan-zoom-reset-pan-zoom rect.svg-pan-zoom-control-background').attr('rx', 13);
}
let panConfig = {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
};
let panZoom;

