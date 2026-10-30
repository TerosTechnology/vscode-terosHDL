const vscode = acquireVsCodeApi();

let last_embed_svg;
let pan_zoom;
let last_svg = '';
let last_nets = {};

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
            last_nets = message.nets || {};
            set_svg(message.result);
            break;
    }
});

function set_svg(svg) {
    init();
    //Create SVG element
    let embed_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    embed_svg.setAttribute('style', 'width: 100%; height: 100%');
    embed_svg.setAttribute('type', 'image/svg+xml');
    embed_svg.id = "svg_yosys";
    last_svg = svg;
    //Add to container

    const iframe = document.getElementById('netlist_container_iframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    const contenidoIframe = `
    <div id="netlist_container"></div>
    <p id="wave">&nbsp;</p>
    `;

    iframeDocument.open();
    iframeDocument.write(contenidoIframe);
    iframeDocument.close();

    const netlist_container = iframeDocument.getElementById('netlist_container');

    netlist_container.innerHTML = '';
    netlist_container.appendChild(embed_svg);

    embed_svg.innerHTML = svg;

    last_embed_svg = embed_svg;
    set_line_width();
    enhance_svg(embed_svg);

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
function set_line_width() {
    let lines = last_embed_svg.querySelectorAll('line');
    for (let i = 0; i < lines.length; i++) {
        lines[i].style = "stroke:#000000;stroke-width:2";
    }
}

////////////////////////////////////////////////////////////////////////////////
// Net labels and interaction
////////////////////////////////////////////////////////////////////////////////

// The renderer names the net lines of the SVG with the bit ids of the net:
// class="net_<bit ids> width_<num bits>". Return the bit ids of a class.
function get_net_bits(class_attr) {
    if (class_attr === null || class_attr === undefined) {
        return null;
    }
    const tokens = class_attr.split(/\s+/);
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].startsWith('net_')) {
            return tokens[i].substring(4);
        }
    }
    return null;
}

function get_inner_svg(embed_svg) {
    const inner_svg = embed_svg.querySelector('svg');
    return inner_svg === null ? embed_svg : inner_svg;
}

function enhance_svg(embed_svg) {
    const inner_svg = get_inner_svg(embed_svg);
    const owner_document = inner_svg.ownerDocument;

    // Styles for the net labels and the invisible hit areas of the nets
    const style = owner_document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `
.hitarea {
    stroke: transparent;
    stroke-width: 10;
    fill: none;
    pointer-events: stroke;
    cursor: pointer;
}
.hitarea:hover {
    stroke: rgba(132, 218, 0, 0.4);
}
.netlabel text {
    fill: #1a5fb4;
    stroke: none;
}
.netlabel rect {
    fill: #ffffff;
    stroke: none;
    opacity: 0.85;
}
`;
    inner_svg.appendChild(style);

    // Group the segments of every net
    const segments_by_net = {};
    const lines = inner_svg.querySelectorAll('line');
    for (let i = 0; i < lines.length; i++) {
        const bits = get_net_bits(lines[i].getAttribute('class'));
        if (bits === null) {
            continue;
        }
        if (segments_by_net[bits] === undefined) {
            segments_by_net[bits] = [];
        }
        segments_by_net[bits].push(lines[i]);
    }

    // Invisible wide lines to make the nets easy to click
    for (const bits of Object.keys(segments_by_net)) {
        const segments = segments_by_net[bits];
        for (let i = 0; i < segments.length; i++) {
            add_hitarea_line(inner_svg, segments[i]);
        }
    }

    // Name label on the longest segment of every known net
    for (const bits of Object.keys(segments_by_net)) {
        const net_info = last_nets[bits];
        if (net_info !== undefined) {
            add_net_label(inner_svg, segments_by_net[bits], bits, net_info);
        }
    }

    inner_svg.addEventListener('click', on_net_click);
}

function add_hitarea_line(parent, segment) {
    const hit_line = parent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "line");
    hit_line.setAttribute('x1', segment.getAttribute('x1'));
    hit_line.setAttribute('y1', segment.getAttribute('y1'));
    hit_line.setAttribute('x2', segment.getAttribute('x2'));
    hit_line.setAttribute('y2', segment.getAttribute('y2'));
    hit_line.setAttribute('class', segment.getAttribute('class') + ' hitarea');
    parent.appendChild(hit_line);
}

function segment_length(segment) {
    const x1 = parseFloat(segment.getAttribute('x1'));
    const y1 = parseFloat(segment.getAttribute('y1'));
    const x2 = parseFloat(segment.getAttribute('x2'));
    const y2 = parseFloat(segment.getAttribute('y2'));
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function add_net_label(parent, segments, bits, net_info) {
    // Label the longest segment of the net
    let longest = segments[0];
    let longest_length = -1;
    for (let i = 0; i < segments.length; i++) {
        const length = segment_length(segments[i]);
        if (length > longest_length) {
            longest_length = length;
            longest = segments[i];
        }
    }

    const x1 = parseFloat(longest.getAttribute('x1'));
    const y1 = parseFloat(longest.getAttribute('y1'));
    const x2 = parseFloat(longest.getAttribute('x2'));
    const y2 = parseFloat(longest.getAttribute('y2'));
    const middle_x = (x1 + x2) / 2;
    const middle_y = (y1 + y2) / 2;
    const horizontal = Math.abs(x2 - x1) >= Math.abs(y2 - y1);

    const name = net_info.name || bits;
    const label = parent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g");
    label.setAttribute('class', 'netlabel net_' + bits);

    let title_text = name;
    if (net_info.file && net_info.line > 0) {
        const file_name = net_info.file.split(/[\\/]/).pop();
        title_text += ` (${file_name}:${net_info.line})`;
    }
    const title = parent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = title_text;
    label.appendChild(title);

    // Courier New 10px bold: 6px per character
    const text_width = name.length * 6 + 4;
    const text_height = 11;
    let text_x, text_y, text_anchor, rect_x, rect_y;
    if (horizontal) {
        text_x = middle_x;
        text_y = middle_y - 4;
        text_anchor = 'middle';
        rect_x = middle_x - text_width / 2;
        rect_y = middle_y - text_height - 3;
    }
    else {
        text_x = middle_x + 5;
        text_y = middle_y + 3;
        text_anchor = 'start';
        rect_x = middle_x + 3;
        rect_y = middle_y - text_height / 2;
    }

    const background = parent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute('x', rect_x);
    background.setAttribute('y', rect_y);
    background.setAttribute('width', text_width);
    background.setAttribute('height', text_height);
    label.appendChild(background);

    const text = parent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', text_x);
    text.setAttribute('y', text_y);
    text.setAttribute('text-anchor', text_anchor);
    text.textContent = name;
    label.appendChild(text);

    parent.appendChild(label);
}

function on_net_click(event) {
    const bits = find_net_bits(event.target);
    if (bits === null) {
        return;
    }
    select_net(bits);
    const net_info = last_nets[bits];
    if (net_info !== undefined) {
        vscode.postMessage({
            command: 'go_to_net',
            file: net_info.file || '',
            line: net_info.line || 0,
            name: net_info.name || ''
        });
    }
}

function find_net_bits(element) {
    let current = element;
    while (current !== null && current !== last_embed_svg) {
        if (current.nodeType === 1) {
            const bits = get_net_bits(current.getAttribute('class'));
            if (bits !== null) {
                return bits;
            }
        }
        current = current.parentNode;
    }
    return null;
}

function select_net(bits) {
    const net_token = 'net_' + bits;
    const hit_token = 'hitarea';
    const elements = last_embed_svg.querySelectorAll('line, circle');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const tokens = (element.getAttribute('class') || '').split(/\s+/);
        const is_hit = tokens.indexOf(hit_token) !== -1;
        if (is_hit) {
            continue;
        }
        if (element.tagName === 'line' && tokens.indexOf(net_token) !== -1) {
            element.style = "stroke:#84da00;stroke-width:3";
        }
        else if (element.tagName === 'line') {
            element.style = "stroke:#000000;stroke-width:2";
        }
    }
}
