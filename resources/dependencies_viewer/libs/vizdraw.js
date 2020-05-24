"use strict";
// default
const vscode = acquireVsCodeApi();

document.getElementById("add-source").onclick = function() {send_command("add_source");};
document.getElementById("clear-graph").onclick = function() {send_command("clear_graph");};
document.getElementById("generate-documentation").onclick = function() {send_command("generate_documentation");};

function send_command(command) {
    vscode.postMessage({
        command: command,
        text: "message"
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
function update_graph(dot){
    let viz = new Viz();
    viz.renderSVGElement(dot)
        .then(function (element) {
            if (graph !== null){
                document.body.removeChild(graph);
            }
            document.body.appendChild(element);
            graph = element;
            
        panZoom = svgPanZoom(element, panConfig);
        panZoom.zoom(0.8);
        panZoom.center();
        panZoom.resize();
        trimZoomBtns();
    });
}
function clear(){
    if (graph !== null){
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
let lastTheme = CodeTheme.Unknown;
function checkIfThemeChange() {
    setInterval(() => {
        let curTheme = getTheme();
        if (lastTheme !== CodeTheme.Unknown &&
            lastTheme !== curTheme) {
            renderFsm(targetFsm);
        }
        lastTheme = curTheme;
    }, 250);
}
