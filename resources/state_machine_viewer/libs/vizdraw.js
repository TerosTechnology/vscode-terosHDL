"use strict";
// default
const vscode = acquireVsCodeApi();

// document.getElementById("add-source").onclick = function () { send_command("add_source"); };
// document.getElementById("clear-graph").onclick = function () { send_command("clear_graph"); };
// document.getElementById("generate-documentation-markdown").onclick = function () { send_command("generate_documentation_markdown"); };
// document.getElementById("generate-documentation-html").onclick = function () { send_command("generate_documentation_html"); };

// document.body.onclick = function (event) {
//     console.log(event.target.textContent);
//     console.log(event.target.parentElement);
//     console.log(event.target.title);

// };

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

let graph = [];
let div = [];

function update_graph(state_machines) {
    delete_graph();
    if (state_machines === undefined) {
        return;
    }
    for (let i = 0; i < state_machines.length; ++i) {
        create_graph(state_machines[i].svg, `svg_${i}`);
    }
}

function create_graph(svg, name) {
    console.log("entraaa")
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
    div.push(elem);

    document.body.appendChild(elem);

    //Add svg
    elem.appendChild(embed);

    let pan_zoom = svgPanZoom(`#${name}`, pan_config);
    // pan_zoom.zoom(0.5);
    pan_zoom.center();
    pan_zoom.resize();
    graph.push(embed);
}

function delete_graph() {
    if (graph === undefined) {
        return;
    }
    for (let i = 0; i < graph.length; ++i) {
        svgPanZoom(graph[i]).destroy();
        if (div[i].parentNode !== null) {
            div[i].parentNode.removeChild(div[i]);
        }
    }
}

let pan_config = {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
};