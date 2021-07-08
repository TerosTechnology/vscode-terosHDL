import * as vscode from "vscode";
const fs = require("fs");
const path_lib = require("path");

export function get_icon_light(full_path){
    let path_icon = get_icon(full_path, 'light');
    return path_icon;
}
  
export function get_icon_dark(full_path){
    let path_icon = get_icon(full_path, 'dark');
    return path_icon;
}

function get_icon(full_path: string, mode: string){
    let file_extension = path_lib.extname(full_path);
    let filename = path_lib.basename(full_path);
    let lang = get_file_lang(full_path);

    let path_icon = path_lib.join(__filename, "..", "..", "..", "..", "resources", mode, "file.svg");
    // Python file
    if (lang === 'vhdl' || lang === 'verilog'){
        path_icon = path_lib.join(__filename, "..", "..", "..", "..", "resources", mode, "verilog.svg");
    }
    else if (file_extension === '.py'){
        path_icon = path_lib.join(__filename, "..", "..", "..", "..", "resources", mode, "python.svg");
    }
    else if(filename === 'Makefile'){
        path_icon = path_lib.join(__filename, "..", "..", "..", "..", "resources", mode, "makefile.svg");  
    }
    return path_icon;
}

export async function open_file(path) {
    //Check if file exists
    if (fs.existsSync(path) !== true) {
        let msg = "File doesn't exist. ";
        show_message(msg,'project_manager');
        return;
    }
    try {
        if (fs.lstatSync(path).isDirectory()){
            let uri = vscode.Uri.file(path);
            let success = await vscode.commands.executeCommand('revealFileInOS', uri);
            return;
        }
        let pos_1 = new vscode.Position(0, 0);
        let pos_2 = new vscode.Position(0, 0);
        vscode.workspace.openTextDocument(path).then((doc) => {
        vscode.window.showTextDocument(doc, vscode.ViewColumn.One).then((editor) => {
            // Line added - by having a selection at the same position twice, the cursor jumps there
            editor.selections = [new vscode.Selection(pos_1, pos_2)];

            // And the visible range jumps there too
            var range = new vscode.Range(pos_1, pos_2);
            editor.revealRange(range);
        });
      });
    } catch (e) {}
}

export function show_message(msg:string, info_web='') {
    if (info_web === 'project_manager'){
        msg +=  'Check [TerosHDL documentation.](https://terostechnology.github.io/terosHDLdoc/features/project_manager.html)';
    }
    vscode.window.showInformationMessage(msg);
}

export function get_file_lang(filepath : string | undefined){
    if (filepath === undefined){
        return '';
    }
    const jsteros = require('jsteros');
    const utils = jsteros.Utils;
    let lang = utils.get_file_lang(filepath);
    return lang;
}

export async function get_toplevel_from_path(filepath : string| undefined){
    if (filepath === undefined){
        return '';
    }
    const jsteros = require('jsteros');
    const utils = jsteros.Utils;
    let toplevel = await utils.get_toplevel_from_path(filepath);
    return toplevel;
}