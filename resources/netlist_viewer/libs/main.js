const vscode = acquireVsCodeApi();

let last_embed_svg;
let pan_zoom;
let last_svg = '';

////////////////////////////////////////////////////////////////////////////////
// Export SVG
////////////////////////////////////////////////////////////////////////////////
function init() {
    document.getElementById("export-as-image").onclick = function() { export_message("svg"); };
}

function export_message(type) {
    vscode.postMessage({
        command: 'export',
        type: type,
        svg: last_svg
    });
}

////////////////////////////////////////////////////////////////////////////////
// SVG creator
////////////////////////////////////////////////////////////////////////////////
window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'update':
            set_svg(message.result);
            break;
    }
});

function set_svg(svg) {
    let w = document.getElementById('wave');
    w.innerHTML = '';

    init();
    //Create SVG element
    let embed_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    embed_svg.setAttribute('style', 'width: 100%; height: 100%');
    embed_svg.setAttribute('type', 'image/svg+xml');
    embed_svg.id = "svg_yosys";
    last_svg = svg;
    //Add to container
    netlist_container = document.getElementById('netlist_container');

    netlist_container.innerHTML = '';
    netlist_container.appendChild(embed_svg);

    embed_svg.innerHTML = svg;
    set_svg_click(embed_svg);

    last_embed_svg = embed_svg;
    set_line_width();

    netlist_container.setAttribute('style', 'width: 100%; height: 100%');
    let pan_config = {
        zoomEnabled: true,
        controlIconsEnabled: true,
        maxZoom: 50,
        fit: true,
        center: true
    };
    pan_zoom = svgPanZoom(embed_svg, pan_config);
    pan_zoom.center();
    pan_zoom.resize();

    let main = document.getElementById('main');
    main.setAttribute('style', 'width: 100%; height: 100%');

}

////////////////////////////////////////////////////////////////////////////////
// SVG functions
////////////////////////////////////////////////////////////////////////////////
function set_svg_click(svg) {
    let countries = svg.childNodes;
    for (let i = 0; i < countries.length; i++) {
        countries[i].addEventListener('click', e => {
            let element = e.target;

            if (element.tagName === 'line') {
                let class_name = element.getAttribute("class");
                select_net(class_name);
            }
        });
    }
}

function select_net(class_name) {
    search_in_tree(last_embed_svg, 'line', class_name);
}

function search_in_tree(element, tag_name, class_name) {
    let match = undefined;

    function recursive_searchTree(element, tag_name) {
        let type = element.tagName;
        let class_name_i = undefined;
        try {
            class_name_i = element.getAttribute("class");
        } catch {
            class_name_i = '';
        }

        if (type === tag_name && class_name_i === class_name) {
            element.style = "stroke:#84da00;stroke-width:3";
            match = element;
        } else if (type === tag_name && class_name_i !== class_name) {
            element.style = "stroke:#000000;stroke-width:2";
        } else if (element !== null) {
            let i;
            let result = null;
            let childs = element.childNodes;
            for (i = 0; result === null && i < childs.length; i++) {
                result = recursive_searchTree(childs[i], tag_name, class_name);
                if (result !== null) {
                    break;
                }
            }
            return result;
        }
        return null;
    }
    recursive_searchTree(element, tag_name, class_name);
    return match;
}

function set_line_width() {
    let tag_name = 'line';
    let element = last_embed_svg;
    let width = 2;
    let match = undefined;

    function recursive_searchTree(element, tag_name) {
        let type = element.tagName;
        if (type === tag_name) {
            element.style = `stroke:#000000;stroke-width:${width}`;
            match = element;
        } else if (element !== null) {
            let i;
            let result = null;
            let childs = element.childNodes;
            for (i = 0; result === null && i < childs.length; i++) {
                result = recursive_searchTree(childs[i], tag_name);
                if (result !== null) {
                    break;
                }
            }
            return result;
        }
        return null;
    }
    recursive_searchTree(element, tag_name);
    return match;
}