"use strict";
const vscode = acquireVsCodeApi();

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
    const el = document.querySelector('body');
    // get scroll position in px
    let last_scroll_left = el.scrollLeft;
    let last_scroll_top = el.scrollTop;

    delete_graph();
    if (state_machines === undefined) {
        return;
    }
    for (let i = 0; i < state_machines.length; ++i) {
        create_graph(state_machines[i].svg, `svg_${i}`, i);
    }

    // set scroll position in px
    el.scrollLeft = last_scroll_left;
    el.scrollTop = last_scroll_top;
}

function create_graph(svg, name, index) {
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

    console.log("pasa0");
    let countries = embed.childNodes;
    for (let i = 0; i < countries.length; i++) {
        countries[i].addEventListener('click', e => {
            let parent_target = e.target.parentNode;
            let childs = parent_target.childNodes;
            for (let i = 0; i < childs.length; ++i) {
                let child = childs[i];
                if (child.tagName === 'title') {
                    let state_name = child.textContent;
                    let state_machine_index_i = index;
                    for (let j = 0; j < childs.length; ++j) {
                        let child_0 = childs[j];
                        if (child_0.tagName === 'polygon') {
                            uncheck_all();
                            child_0.style = "fill:#d0fdf7";
                        }
                    }
                    go_to_code_state(state_machine_index_i, state_name);
                }
            }
        });
    }
    graph.push(embed);
}

function uncheck_all() {
    for (let i = 0; i < graph.length; i++) {
        search_in_tree(graph[i], 'polygon');
    }
}

function search_in_tree(element, matchingTitle) {
    let match = undefined;
    function recursive_searchTree(element, matchingTitle) {
        let type = element.tagName;
        if (type === matchingTitle) {
            console.log(element.style.fill);
            if (element.style !== undefined && element.style.fill === 'rgb(208, 253, 247)') {
                element.style = "fill:transparent";
            }
            match = element;
        } else if (element !== null) {
            let i;
            let result = null;
            let childs = element.childNodes;
            for (i = 0; result === null && i < childs.length; i++) {
                result = recursive_searchTree(childs[i], matchingTitle);
                if (result !== null) {
                    break;
                }
            }
            return result;
        }
        return null;
    }
    recursive_searchTree(element, matchingTitle);
    return match;
}


function go_to_code_state(stm_index, state) {
    vscode.postMessage({
        command: 'go_to_state',
        stm_index: stm_index,
        state: state
    });
}

// function click_svg(e) {
//     let pepe = e.target;

//     let parent_target = pepe.parentNode;
//     let childs = parent_target.childNodes;
//     for (let i = 0; i < childs.length; ++i) {
//         let child = childs[i];
//         if (child.tagName === 'title') {
//             console.log("pasa0");
//             console.log(child.textContent);
//             console.log(child);
//             console.log(child.text);
//             console.log("pasa1");
//         }
//     }

//     // let parent_target = pepe.parentNode;
//     // console.log("pasa2");
//     // console.log(parent_target.title);
//     // console.log("pasa3");

//     alert("hola!");
// }


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

document.getElementById("export-as-svg").onclick = function () { export_message("svg"); };
function export_message(message) {
    vscode.postMessage({
        command: 'export',
        text: message
    });
}