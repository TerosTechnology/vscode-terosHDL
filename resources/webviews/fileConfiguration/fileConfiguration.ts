// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of TerosHDL
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import {
    provideVSCodeDesignSystem,
    vsCodeButton,
    vsCodeDivider,
    vsCodeDropdown,
    vsCodeOption,
    vsCodeBadge,
} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(
    vsCodeButton(),
    vsCodeDivider(),
    vsCodeDropdown(),
    vsCodeOption(),
    vsCodeBadge()
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Common
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let fileName = "";
let logicalName = "";
let projectName = "";

declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

const fileTypeDropDown = <HTMLElement>document.getElementById('file-type');
const fileVersionDropDown = <HTMLElement>document.getElementById('file-version');
const sourceTypeDropDown = <HTMLElement>document.getElementById('source-type');

const labelFileName = <HTMLElement>document.getElementById('file-name');

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'setFileTypeList':
            setNameAndLogicalName(message.name, message.logical_name);
            createFileTypeList(message.fileTypeList);
            createFileVersionDropdown(message.currentFileType);
            createSourceTypeDropdown(message.sourceTypeList);

            setDefaultValues(message.currentFileType, message.currentFileVersion, message.currentSourceType);
            fileName = message.name;
            logicalName = message.logical_name;
            projectName = message.projectName;
            break;
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Header
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setNameAndLogicalName(name: string, logical_name: string) {
    const completeName = logical_name === "" ? name : `${name} (${logical_name})`;
    labelFileName.innerHTML = completeName;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// File Version Dropdown
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createFileVersionDropdown(currentFileType: string) {
    let optionList = ["none"];
    if (currentFileType === "vhdlSource") {
        optionList = ["2008", "2000", "93"];
    }
    else if (currentFileType === "verilogSource" || currentFileType === "systemVerilogSource") {
        optionList = ["2005", "2000"];
    }

    // Delete all child of the dropdown
    while (fileVersionDropDown?.firstChild) {
        fileVersionDropDown.removeChild(fileVersionDropDown.firstChild);
    }

    for (const option of optionList) {
        const optionInst = document.createElement('vscode-option');
        optionInst.innerHTML = option;
        fileVersionDropDown?.appendChild(optionInst);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// File Type Dropdown
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
fileTypeDropDown.addEventListener('change', (event: any) => {
    const currentFileType = event.detail._currentValue;
    createFileVersionDropdown(currentFileType);
});

function createFileTypeList(fileTypeList: string[]) {
    for (const fileType of fileTypeList) {
        const optionInst = document.createElement('vscode-option');
        optionInst.innerHTML = fileType;
        fileTypeDropDown?.appendChild(optionInst);
    }
}

function setDefaultValues(fileType: string, fileVersion: string, sourceType: string) {
    fileTypeDropDown.setAttribute("value", fileType);

    const correctFileVersion = fileVersion === undefined ? "none" : fileVersion;
    fileVersionDropDown.setAttribute("value", correctFileVersion);
    
    console.log(sourceType);
    sourceTypeDropDown.setAttribute("value", sourceType);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// File Version Dropdown
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createSourceTypeDropdown(sourceTypeList: string[]) {
    for (const option of sourceTypeList) {
        const optionInst = document.createElement('vscode-option');
        optionInst.innerHTML = option;
        sourceTypeDropDown?.appendChild(optionInst);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Save configuration
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const applyButton = <HTMLElement>document.getElementById('apply-button');
applyButton.addEventListener('click', () => {
    sendConfigToVsCode();
});

function sendConfigToVsCode() {
    console.log(fileTypeDropDown)
    const fileType = fileTypeDropDown.getAttribute("current-value");
    const fileVersion = fileVersionDropDown.getAttribute("current-value");
    const sourceType = sourceTypeDropDown.getAttribute("current-value");
    
    vscode.postMessage({
        command: 'saveConfig',
        fileType: fileType,
        fileVersion: fileVersion === "none" ? undefined : fileVersion,
        sourceType: sourceType,
        fileName: fileName,
        logicalName: logicalName,
        projectName: projectName
    });
}