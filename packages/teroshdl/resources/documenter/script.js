window.addEventListener("load", () => {
    const vscode = acquireVsCodeApi();

    document.getElementById("export-as-markdown").onclick = function () {
        export_message("markdown");
    };

    document.getElementById("export-as-html").onclick = function () {
        export_message("html");
    };

    document.getElementById("export-as-image").onclick = function () {
        export_message("image");
    };

    function export_message(message) {
        vscode.postMessage({
            command: 'export',
            text: message
        });
    }
});