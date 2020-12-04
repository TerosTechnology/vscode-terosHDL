"use strict";
// default
const vscode = acquireVsCodeApi();

document.getElementById("add-source").onclick = function () { send_command("add_source"); };
document.getElementById("clear-graph").onclick = function () { send_command("clear_graph"); };
document.getElementById("generate-documentation-markdown").onclick = function () { send_command("generate_documentation_markdown"); };
document.getElementById("generate-documentation-html").onclick = function () { send_command("generate_documentation_html"); };


document.body.onclick = function (event) {
    console.log(event.target.textContent);
    console.log(event.target.parentElement);
    console.log(event.target.title);

};



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
            update_graph(message.state_machines);
            break;
        case 'clear':
            clear();
            break;
    }
});

// function update_graph(state_machines) {
//     let svg = state_machines[0].svg;

//     if (graph !== undefined) {
//         svgPanZoom(graph).destroy();
//         document.getElementById('container').removeChild(graph);
//     }
//     let embed = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     embed.setAttribute('style', 'width: 100%; height: 720px;');
//     embed.setAttribute('type', 'image/svg+xml');
//     embed.innerHTML = svg;
//     document.getElementById('container').appendChild(embed);

//     let pan_zoom = svgPanZoom(embed, pan_config);
//     pan_zoom.zoom(0.5);
//     pan_zoom.center();
//     pan_zoom.resize();
//     graph = embed;
// }

let graph = [];

function update_graph(state_machines) {
    delete_graph();
    for (let i = 0; i < state_machines.length; ++i) {
        create_graph(state_machines[i].svg, `svg_${i}`);
    }
}

function create_graph(svg, name) {
    let embed = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    embed.setAttribute('style', 'width: 100%; height: 720px;');
    embed.setAttribute('type', 'image/svg+xml');
    embed.innerHTML = svg;
    embed.id = name;

    //Add div
    var elem = document.createElement('div');
    elem.style.width = "100%";
    elem.style.heigh = "500px";
    elem.style.border = "1px solid black";

    document.body.appendChild(elem);

    //Add svg
    elem.appendChild(embed);

    let pan_zoom = svgPanZoom(`#${name}`, pan_config);
    // pan_zoom.zoom(0.5);
    pan_zoom.center();
    pan_zoom.resize();
    let graph_tmp = embed;
    graph.push(graph_tmp);
}

function delete_graph() {
    for (let i = 0; i < graph.length; ++i) {
        svgPanZoom(graph[i]).destroy();
        document.getElementById('container').removeChild(graph[i]);
    }
}


let pan_config = {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
};


// var graph = null;
// function update_graph(state_machines) {
//     let dot = state_machines[0].svg;

//     let viz = new Viz();
//     viz.renderSVGElement(dot)
//         .then(function (element) {
//             if (graph !== null) {
//                 document.body.removeChild(graph);
//             }
//             document.body.appendChild(element);
//             graph = element;

//             panZoom = svgPanZoom(element, panConfig);
//             panZoom.zoom(0.8);
//             panZoom.center();
//             panZoom.resize();
//             trimZoomBtns();
//         });
// }
// function clear() {
//     if (graph !== null) {
//         document.body.removeChild(graph);
//         graph = null;
//     }
// }
// function trimZoomBtns() {
//     $('#svg-pan-zoom-zoom-in rect.svg-pan-zoom-control-background').attr('rx', 300);
//     $('#svg-pan-zoom-zoom-out rect.svg-pan-zoom-control-background').attr('rx', 300);
//     $('#svg-pan-zoom-reset-pan-zoom rect.svg-pan-zoom-control-background').attr('rx', 13);
// }
// let panConfig = {
//     zoomEnabled: true,
//     controlIconsEnabled: true,
//     fit: true,
//     center: true,
// };
// let panZoom;

