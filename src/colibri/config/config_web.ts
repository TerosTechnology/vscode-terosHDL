/* eslint-disable max-len */
// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
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

export const WEB_CONFIG = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src {{cspSource}}; style-src 'unsafe-inline' {{cspSource}}; script-src 'unsafe-inline' {{cspSource}};">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="{{css_codicons}}" rel="stylesheet">
    <title>Settings</title>

<style>

/* VSCode Settings Style */
body {
    font-family: -apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,system-ui,Ubuntu,Droid Sans,sans-serif;
    font-size: 13px;
    line-height: 1.4em;
    color: var(--vscode-foreground);
    background-color: var(--vscode-editor-background);
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
}

.settings-editor {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.settings-header {
    height: 35px;
    border-bottom: 1px solid var(--vscode-settings-headerBorder);
    background-color: var(--vscode-settings-headerBackground);
    display: flex;
    align-items: center;
    padding: 0 20px;
}

.settings-header-controls {
    display: flex;
    align-items: center;
    width: 100%;
}

.settings-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--vscode-settings-headerForeground);
}

.settings-body {
    flex: 1;
    display: flex;
    height: calc(100vh - 35px);
    overflow: hidden;
}

.settings-tree-container {
    width: 300px;
    background-color: var(--vscode-sideBar-background);
    border-right: 1px solid var(--vscode-sideBar-border);
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;
    height: 100%;
}

.settings-editor-tree {
    flex: 1;
    background-color: var(--vscode-editor-background);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
    max-height: calc(100vh - 35px);
    scroll-behavior: smooth;
}

/* Sidebar Tree Styles */
.settings-toc-container {
    padding: 8px 0;
    height: 100%;
}

.settings-toc-entry {
    color: var(--vscode-settings-dropdownListBorder);
    position: relative;
}

.settings-toc-entry .settings-toc-entry-label {
    display: flex;
    align-items: center;
    padding: 4px 22px 4px 8px;
    cursor: pointer;
    user-select: none;
    line-height: 20px;
    color: var(--vscode-sideBarTitle-foreground);
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: background-color 0.1s ease;
    border-radius: 2px;
}

.settings-toc-entry .settings-toc-entry-label:hover {
    background-color: var(--vscode-list-hoverBackground);
}

.settings-toc-entry .settings-toc-entry-label.selected {
    background-color: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
}

.settings-toc-entry .codicon {
    margin-right: 6px;
    /* Remove transition since collapse functionality is disabled */
}

/* Remove collapsed class references */

.settings-toc-children {
    margin-left: 8px;
    display: block;
    /* Remove transition and collapsed functionality */
}

.settings-toc-entry .settings-toc-child {
    padding: 2px 8px 2px 24px;
    cursor: pointer;
    line-height: 20px;
    color: var(--vscode-sideBar-foreground);
    font-size: 13px;
    transition: background-color 0.1s ease;
    border-radius: 2px;
    margin: 1px 4px;
}

.settings-toc-entry .settings-toc-child:hover {
    background-color: var(--vscode-list-hoverBackground);
}

.settings-toc-entry .settings-toc-child.selected {
    background-color: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
}

/* Settings Content Styles */
.settings-group-title-label {
    font-size: 20px;
    font-weight: 600;
    color: var(--vscode-settings-headerForeground);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
}

.settings-group-description {
    font-size: 13px;
    color: var(--vscode-descriptionForeground);
    margin-bottom: 20px;
    line-height: 1.5;
}

.setting-item {
    margin-bottom: 24px;
    padding: 12px 0;
}

.setting-item-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--vscode-settings-textInputForeground);
    margin-bottom: 4px;
    line-height: 1.3;
}

.setting-item-description {
    font-size: 12px;
    color: var(--vscode-descriptionForeground);
    margin-bottom: 8px;
    line-height: 1.4;
}

/* Form Controls */
.setting-input-box {
    width: 320px;
    height: 26px;
    padding: 4px 8px;
    border: 1px solid var(--vscode-settings-textInputBorder);
    background-color: var(--vscode-settings-textInputBackground);
    color: var(--vscode-settings-textInputForeground);
    font-family: inherit;
    font-size: 13px;
    border-radius: 2px;
    transition: border-color 0.2s ease;
}

.setting-input-box:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
}

.setting-input-box:hover {
    border-color: var(--vscode-focusBorder);
}

.setting-select-box {
    width: 320px;
    height: 26px;
    padding: 2px 8px;
    border: 1px solid var(--vscode-settings-dropdownBorder);
    background-color: var(--vscode-settings-dropdownBackground);
    color: var(--vscode-settings-dropdownForeground);
    font-family: inherit;
    font-size: 13px;
    border-radius: 2px;
    appearance: none;
    padding-right: 32px;
    transition: border-color 0.2s ease;
    background-image: none;
}

.setting-select-box:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
}

.setting-select-box:hover {
    border-color: var(--vscode-focusBorder);
}

/* Container for select to position the arrow */
.select-container {
    position: relative;
    display: inline-block;
    width: 320px;
}

/* Custom dropdown arrow using CSS - more visible fallback */
.select-container::after {
    content: '⌄'; /* Downward-pointing chevron */
    font-family: system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--vscode-settings-dropdownForeground);
    pointer-events: none;
    font-size: 14px;
    line-height: 1;
    font-weight: bold;
    opacity: 0.8;
}

/* Alternative approach with background-image for better visibility */
.select-container .setting-select-box {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 12px;
}

/* Ensure the arrow is visible on hover and focus states */
.select-container .setting-select-box:hover,
.select-container .setting-select-box:focus {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23007acc' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
}

.setting-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.setting-checkbox input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
    border: 1px solid var(--vscode-settings-checkboxBorder);
    background-color: var(--vscode-settings-checkboxBackground);
    border-radius: 2px;
    appearance: none;
    cursor: pointer;
    position: relative;
}

.setting-checkbox input[type="checkbox"]:checked {
    background-color: var(--vscode-checkbox-background);
    border-color: var(--vscode-checkbox-border);
}

.setting-checkbox input[type="checkbox"]:checked::after {
    content: "✓";
    position: absolute;
    left: 2px;
    top: -1px;
    color: var(--vscode-checkbox-foreground);
    font-size: 12px;
    font-weight: bold;
}

.setting-checkbox input[type="checkbox"]:focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
}

.setting-checkbox:hover input[type="checkbox"] {
    border-color: var(--vscode-focusBorder);
    transition: border-color 0.2s ease;
}

.setting-checkbox-label {
    font-size: 13px;
    color: var(--vscode-settings-textInputForeground);
    cursor: pointer;
}

/* Number input */
.setting-number-input {
    width: 100px;
    height: 26px;
    padding: 4px 8px;
    border: 1px solid var(--vscode-settings-numberInputBorder);
    background-color: var(--vscode-settings-numberInputBackground);
    color: var(--vscode-settings-numberInputForeground);
    font-family: inherit;
    font-size: 13px;
    border-radius: 2px;
    transition: border-color 0.2s ease;
}

.setting-number-input:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
}

.setting-number-input:hover {
    border-color: var(--vscode-focusBorder);
}

/* Divider */
.setting-divider {
    border: none;
    border-top: 1px solid var(--vscode-settings-headerBorder);
    margin: 20px 0;
}

.setting-divider-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--vscode-settings-headerForeground);
    margin: 16px 0 8px 0;
}

/* Buttons */
.settings-buttons {
    position: fixed;
    bottom: 0;
    right: 0;
    background-color: var(--vscode-editor-background);
    border-top: 1px solid var(--vscode-settings-headerBorder);
    padding: 12px 20px;
    display: flex;
    gap: 8px;
}

.setting-button {
    height: 26px;
    padding: 4px 14px;
    border: 1px solid var(--vscode-button-border);
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    font-family: inherit;
    font-size: 13px;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.1s ease, border-color 0.1s ease;
}

.setting-button:hover {
    background-color: var(--vscode-button-hoverBackground) !important;
    border-color: var(--vscode-button-hoverBackground) !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.setting-button:focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
}

.setting-button.primary {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
}

.setting-button.primary:hover {
    background-color: var(--vscode-button-hoverBackground);
}

.setting-button.secondary {
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    border-color: var(--vscode-button-secondaryBorder);
}

.setting-button.secondary:hover {
    background-color: var(--vscode-button-secondaryHoverBackground) !important;
    border-color: var(--vscode-button-secondaryHoverBackground) !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.setting-button.danger {
    background-color: var(--vscode-inputValidation-errorBackground);
    color: var(--vscode-inputValidation-errorForeground);
    border-color: var(--vscode-inputValidation-errorBorder);
}

.setting-button.danger:hover {
    background-color: var(--vscode-errorForeground);
    border-color: var(--vscode-errorForeground);
}

/* Help icon button with codicon */
.help-icon-button {
    margin-left: 8px;
    cursor: pointer;
    color: var(--vscode-descriptionForeground);
    font-size: 16px;
    transition: color 0.2s ease;
}

.help-icon-button:hover {
    color: var(--vscode-foreground);
}

.help-icon-button:active {
    color: var(--vscode-focusBorder);
}

.help-icon {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    opacity: 0.8;
    cursor: pointer;
}

.help-icon:hover {
    opacity: 1;
}

/* Badge for markConfig */
.markConfig {
    display: inline-block;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    background-color: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
    border-radius: 2px;
    margin-left: 8px;
}

.help-icon {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    opacity: 0.8;
    cursor: pointer;
}

.help-icon:hover {
    opacity: 1;
}

/* Show/hide sections */
.settings-section {
    display: none;
}

.settings-section.active {
    display: block;
}

/* Fallback colors for older VSCode versions */
:root {
    --vscode-foreground: #cccccc;
    --vscode-editor-background: #1e1e1e;
    --vscode-sideBar-background: #252526;
    --vscode-sideBar-border: #2b2b2b;
    --vscode-sideBar-foreground: #cccccc;
    --vscode-sideBarTitle-foreground: #cccccc;
    --vscode-list-hoverBackground: #2a2d2e;
    --vscode-list-activeSelectionBackground: #094771;
    --vscode-list-activeSelectionForeground: #ffffff;
    --vscode-settings-headerBackground: #252526;
    --vscode-settings-headerBorder: #2b2b2b;
    --vscode-settings-headerForeground: #cccccc;
    --vscode-settings-textInputBackground: #3c3c3c;
    --vscode-settings-textInputForeground: #cccccc;
    --vscode-settings-textInputBorder: #3c3c3c;
    --vscode-settings-dropdownBackground: #3c3c3c;
    --vscode-settings-dropdownForeground: #cccccc;
    --vscode-settings-dropdownBorder: #3c3c3c;
    --vscode-settings-dropdownListBorder: #555555;
    --vscode-settings-checkboxBackground: #3c3c3c;
    --vscode-settings-checkboxBorder: #3c3c3c;
    --vscode-settings-numberInputBackground: #3c3c3c;
    --vscode-settings-numberInputForeground: #cccccc;
    --vscode-settings-numberInputBorder: #3c3c3c;
    --vscode-checkbox-background: #0e639c;
    --vscode-checkbox-border: #0e639c;
    --vscode-checkbox-foreground: #ffffff;
    --vscode-button-background: #0e639c;
    --vscode-button-foreground: #ffffff;
    --vscode-button-hoverBackground: #1177bb;
    --vscode-button-border: transparent;
    --vscode-button-secondaryBackground: #3c3c3c;
    --vscode-button-secondaryForeground: #cccccc;
    --vscode-button-secondaryHoverBackground: #4a4a4a;
    --vscode-button-secondaryBorder: #3c3c3c;
    --vscode-inputValidation-errorBackground: #5a1d1d;
    --vscode-inputValidation-errorForeground: #ffffff;
    --vscode-inputValidation-errorBorder: #be1100;
    --vscode-errorForeground: #f44747;
    --vscode-badge-background: #4d4d4d;
    --vscode-badge-foreground: #ffffff;
    --vscode-focusBorder: #007acc;
    --vscode-descriptionForeground: #9d9d9d;
    --vscode-input-background: #3c3c3c;
    --vscode-dropdown-background: #3c3c3c;
    --vscode-inputOption-activeBorder: #007acc;
}

/* Dark theme adjustments */
body.vscode-dark {
    --vscode-foreground: #cccccc;
    --vscode-editor-background: #1e1e1e;
}

/* Light theme adjustments */
body.vscode-light {
    --vscode-foreground: #333333;
    --vscode-editor-background: #ffffff;
    --vscode-sideBar-background: #f3f3f3;
    --vscode-sideBar-border: #e7e7e7;
    --vscode-sideBar-foreground: #333333;
    --vscode-sideBarTitle-foreground: #333333;
    --vscode-list-hoverBackground: #e8e8e8;
    --vscode-list-activeSelectionBackground: #0078d4;
    --vscode-list-activeSelectionForeground: #ffffff;
    --vscode-settings-headerBackground: #f3f3f3;
    --vscode-settings-headerBorder: #e7e7e7;
    --vscode-settings-headerForeground: #333333;
    --vscode-settings-textInputBackground: #ffffff;
    --vscode-settings-textInputForeground: #333333;
    --vscode-settings-textInputBorder: #cecece;
    --vscode-settings-dropdownBackground: #ffffff;
    --vscode-settings-dropdownForeground: #333333;
    --vscode-settings-dropdownBorder: #cecece;
    --vscode-settings-dropdownListBorder: #cecece;
    --vscode-settings-checkboxBackground: #ffffff;
    --vscode-settings-checkboxBorder: #cecece;
    --vscode-settings-numberInputBackground: #ffffff;
    --vscode-settings-numberInputForeground: #333333;
    --vscode-settings-numberInputBorder: #cecece;
    --vscode-checkbox-background: #0078d4;
    --vscode-checkbox-border: #0078d4;
    --vscode-checkbox-foreground: #ffffff;
    --vscode-button-background: #0078d4;
    --vscode-button-foreground: #ffffff;
    --vscode-button-hoverBackground: #106ebe;
    --vscode-button-border: transparent;
    --vscode-button-secondaryBackground: #e1e1e1;
    --vscode-button-secondaryForeground: #333333;
    --vscode-button-secondaryHoverBackground: #d0d0d0;
    --vscode-button-secondaryBorder: #e1e1e1;
    --vscode-inputValidation-errorBackground: #f2dede;
    --vscode-inputValidation-errorForeground: #a94442;
    --vscode-inputValidation-errorBorder: #a94442;
    --vscode-errorForeground: #e51400;
    --vscode-badge-background: #c4c4c4;
    --vscode-badge-foreground: #333333;
    --vscode-focusBorder: #0078d4;
    --vscode-descriptionForeground: #717171;
    --vscode-input-background: #ffffff;
    --vscode-dropdown-background: #ffffff;
    --vscode-inputOption-activeBorder: #0078d4;
}

/* High contrast theme adjustments */
body.vscode-high-contrast {
    --vscode-foreground: #ffffff;
    --vscode-editor-background: #000000;
    --vscode-sideBar-background: #000000;
    --vscode-sideBar-border: #6fc3df;
    --vscode-sideBar-foreground: #ffffff;
    --vscode-sideBarTitle-foreground: #ffffff;
    --vscode-list-hoverBackground: #2d2d30;
    --vscode-list-activeSelectionBackground: #ffffff;
    --vscode-list-activeSelectionForeground: #000000;
    --vscode-settings-headerBackground: #000000;
    --vscode-settings-headerBorder: #6fc3df;
    --vscode-settings-headerForeground: #ffffff;
    --vscode-settings-textInputBackground: #000000;
    --vscode-settings-textInputForeground: #ffffff;
    --vscode-settings-textInputBorder: #6fc3df;
    --vscode-settings-dropdownBackground: #000000;
    --vscode-settings-dropdownForeground: #ffffff;
    --vscode-settings-dropdownBorder: #6fc3df;
    --vscode-settings-dropdownListBorder: #6fc3df;
    --vscode-settings-checkboxBackground: #000000;
    --vscode-settings-checkboxBorder: #6fc3df;
    --vscode-settings-numberInputBackground: #000000;
    --vscode-settings-numberInputForeground: #ffffff;
    --vscode-settings-numberInputBorder: #6fc3df;
    --vscode-checkbox-background: #ffffff;
    --vscode-checkbox-border: #ffffff;
    --vscode-checkbox-foreground: #000000;
    --vscode-button-background: #ffffff;
    --vscode-button-foreground: #000000;
    --vscode-button-hoverBackground: #6fc3df;
    --vscode-button-border: #ffffff;
    --vscode-button-secondaryBackground: #000000;
    --vscode-button-secondaryForeground: #ffffff;
    --vscode-inputValidation-errorBackground: #5a1d1d;
    --vscode-inputValidation-errorForeground: #ffffff;
    --vscode-inputValidation-errorBorder: #be1100;
    --vscode-badge-background: #ffffff;
    --vscode-badge-foreground: #000000;
    --vscode-focusBorder: #f38518;
    --vscode-descriptionForeground: #ffffff;
    --vscode-input-background: #000000;
    --vscode-dropdown-background: #000000;
    --vscode-inputOption-activeBorder: #f38518;
}

/* Enhanced hover effects for form elements */
.setting-input-box:hover {
    border-color: var(--vscode-inputOption-activeBorder);
    background-color: var(--vscode-input-background);
}

.setting-select-box:hover {
    border-color: var(--vscode-inputOption-activeBorder);
    background-color: var(--vscode-dropdown-background);
}

.setting-number-input:hover {
    border-color: var(--vscode-inputOption-activeBorder);
    background-color: var(--vscode-input-background);
}

.setting-checkbox:hover input[type="checkbox"] {
    border-color: var(--vscode-inputOption-activeBorder);
}

/* Smooth scrolling for better UX */
.settings-tree-container {
    scroll-behavior: smooth;
}

.settings-editor-tree {
    scroll-behavior: smooth;
}

</style>
</head>
<body>
    <div class="settings-editor">
        <div class="settings-header">
            <div class="settings-header-controls">
                <div class="settings-title" id="configTitle">Global Configuration</div>
            </div>
        </div>
        
        <div class="settings-body">
            <div class="settings-tree-container">
                <div class="settings-toc-container">
                    <div class="settings-toc-entry" id="toc-general">
                        <div class="settings-toc-entry-label" id="btn-general-general">
                            General
                        </div>
                    </div>
                    <div class="settings-toc-entry" id="toc-documentation">
                        <div class="settings-toc-entry-label" id="btn-documentation-general">
                            Documentation
                        </div>
                    </div>
                    <div class="settings-toc-entry" id="toc-editor">
                        <div class="settings-toc-entry-label" id="btn-editor-general">
                            Editor
                        </div>
                    </div>
                    <div class="settings-toc-entry" id="toc-formatter">
                        <div class="settings-toc-entry-label" id="btn-formatter-general">
                            <i class="codicon codicon-chevron-down"></i>
                            Formatter
                        </div>
                        <div class="settings-toc-children" id="children-formatter">
                            <div class="settings-toc-child" id="btn-formatter-istyle">
                                iStyle
                            </div>
                            <div class="settings-toc-child" id="btn-formatter-s3sv">
                                s3sv
                            </div>
                            <div class="settings-toc-child" id="btn-formatter-verible">
                                Verible
                            </div>
                            <div class="settings-toc-child" id="btn-formatter-standalone">
                                VHDL standalone
                            </div>
                            <div class="settings-toc-child" id="btn-formatter-vsg">
                                VHDL VSG
                            </div>
                        </div>
                    </div>
                    <div class="settings-toc-entry" id="toc-linter">
                        <div class="settings-toc-entry-label" id="btn-linter-general">
                            <i class="codicon codicon-chevron-down"></i>
                            Linter settings
                        </div>
                        <div class="settings-toc-children" id="children-linter">
                            <div class="settings-toc-child" id="btn-linter-vhdlls">
                                VHDL-LS linter
                            </div>
                            <div class="settings-toc-child" id="btn-linter-ghdl">
                                GHDL linter
                            </div>
                            <div class="settings-toc-child" id="btn-linter-icarus">
                                Icarus linter
                            </div>
                            <div class="settings-toc-child" id="btn-linter-modelsim">
                                ModelSim linter
                            </div>
                            <div class="settings-toc-child" id="btn-linter-verible">
                                Verible linter
                            </div>
                            <div class="settings-toc-child" id="btn-linter-verilator">
                                Verilator linter
                            </div>
                            <div class="settings-toc-child" id="btn-linter-vivado">
                                Vivado linter
                            </div>
                            <div class="settings-toc-child" id="btn-linter-vsg">
                                VSG linter
                            </div>
                        </div>
                    </div>
                    <div class="settings-toc-entry" id="toc-schematic">
                        <div class="settings-toc-entry-label" id="btn-schematic-general">
                            Schematic viewer
                        </div>
                    </div>
                    <div class="settings-toc-entry" id="toc-templates">
                        <div class="settings-toc-entry-label" id="btn-templates-general">
                            Templates
                        </div>
                    </div>
                    <div class="settings-toc-entry" id="toc-tools">
                        <div class="settings-toc-entry-label" id="btn-tools-general">
                            <i class="codicon codicon-chevron-down"></i>
                            Tools
                        </div>
                        <div class="settings-toc-children" id="children-tools">
                            <div class="settings-toc-child" id="btn-tools-quartus">
                                Intel@ Quartus@ Prime
                            </div>
                            <div class="settings-toc-child" id="btn-tools-vsg">
                                VSG
                            </div>
                            <div class="settings-toc-child" id="btn-tools-osvvm">
                                OSVVM
                            </div>
                            <div class="settings-toc-child" id="btn-tools-ascenlint">
                                Ascenlint
                            </div>
                            <div class="settings-toc-child" id="btn-tools-cocotb">
                                Cocotb
                            </div>
                            <div class="settings-toc-child" id="btn-tools-diamond">
                                Diamond
                            </div>
                            <div class="settings-toc-child" id="btn-tools-ghdl">
                                GHDL
                            </div>
                            <div class="settings-toc-child" id="btn-tools-icarus">
                                Icarus
                            </div>
                            <div class="settings-toc-child" id="btn-tools-icestorm">
                                Icestorm
                            </div>
                            <div class="settings-toc-child" id="btn-tools-ise">
                                ISE
                            </div>
                            <div class="settings-toc-child" id="btn-tools-isem">
                                ISIM
                            </div>
                            <div class="settings-toc-child" id="btn-tools-modelsim">
                                ModelSim
                            </div>
                            <div class="settings-toc-child" id="btn-tools-morty">
                                Morty
                            </div>
                            <div class="settings-toc-child" id="btn-tools-radiant">
                                Radiant
                            </div>
                            <div class="settings-toc-child" id="btn-tools-rivierapro">
                                Rivierapro
                            </div>
                            <div class="settings-toc-child" id="btn-tools-siliconcompiler">
                                SiliconCompiler
                            </div>
                            <div class="settings-toc-child" id="btn-tools-spyglass">
                                Spyglass
                            </div>
                            <div class="settings-toc-child" id="btn-tools-symbiyosys">
                                SymbiYosys
                            </div>
                            <div class="settings-toc-child" id="btn-tools-symbiflow">
                                Symbiflow
                            </div>
                            <div class="settings-toc-child" id="btn-tools-trellis">
                                Trellis
                            </div>
                            <div class="settings-toc-child" id="btn-tools-vcs">
                                VCS
                            </div>
                            <div class="settings-toc-child" id="btn-tools-verible">
                                Verible
                            </div>
                            <div class="settings-toc-child" id="btn-tools-verilator">
                                Verilator
                            </div>
                            <div class="settings-toc-child" id="btn-tools-vivado">
                                Vivado
                            </div>
                            <div class="settings-toc-child" id="btn-tools-vunit">
                                VUnit
                            </div>
                            <div class="settings-toc-child" id="btn-tools-xcelium">
                                Xcelium
                            </div>
                            <div class="settings-toc-child" id="btn-tools-xsim">
                                XSIM
                            </div>
                            <div class="settings-toc-child" id="btn-tools-yosys">
                                Yosys
                            </div>
                            <div class="settings-toc-child" id="btn-tools-openfpga">
                                OpenFPGA
                            </div>
                            <div class="settings-toc-child" id="btn-tools-activehdl">
                                Active-HDL
                            </div>
                            <div class="settings-toc-child" id="btn-tools-questa">
                                Questa Advanced Simulator
                            </div>
                            <div class="settings-toc-child" id="btn-tools-raptor">
                                Raptor Design Suite
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="settings-editor-tree">

            <div class="settings-section" id="general-general">
                <div class="settings-group-title-label">
                    General
                    <i class="codicon codicon-question help-icon-button" onclick="window.open('https://terostechnology.github.io/terosHDLdoc/docs/installation_checklist/installation', '_blank')" title="Go To Documentation"></i>
                </div>
                <div class="settings-group-description"></div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Python3 binary path (e.g.: /usr/bin/python3). Empty if you want to use the system path. <strong>Install teroshdl. E.g: pip3 install teroshdl</strong> <a href=https://terostechnology.github.io/terosHDLdoc/docs/installation_checklist/installation#2-python3>https://terostechnology.github.io/terosHDLdoc/docs/installation_checklist/installation#2-python3</a>
                            <span class="markConfig" id="mark_general-general-pypath"></span>
                        </div>
                            <input class="setting-input-box" id="general-general-pypath" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Make binary directory (e.g.: /usr/bin). Empty if you want to use the system path.
                            <span class="markConfig" id="mark_general-general-makepath"></span>
                        </div>
                            <input class="setting-input-box" id="general-general-makepath" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="general-general-go_to_definition_vhdl">
                            <label class="setting-checkbox-label" for="general-general-go_to_definition_vhdl">
                                Activate go to definition feature for VHDL (you need to restart VSCode).
                                <span class="markConfig" id="mark_general-general-go_to_definition_vhdl"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="general-general-go_to_definition_verilog">
                            <label class="setting-checkbox-label" for="general-general-go_to_definition_verilog">
                                Activate go to definition feature for Verilog/SV (you need to restart VSCode).
                                <span class="markConfig" id="mark_general-general-go_to_definition_verilog"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="general-general-developer_mode">
                            <label class="setting-checkbox-label" for="general-general-developer_mode">
                                Developer mode: be careful!!
                                <span class="markConfig" id="mark_general-general-developer_mode"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="documentation-general">
                <div class="settings-group-title-label">
                    Documentation
                    <i class="codicon codicon-question help-icon-button" onclick="window.open('https://terostechnology.github.io/terosHDLdoc/docs/category/auto-documentation', '_blank')" title="Go To Documentation"></i>
                </div>
                <div class="settings-group-description"></div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Documentation language:
                            <span class="markConfig" id="mark_documentation-general-language"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-language">
                                      <option value='english'>English</option>
                                      <option value='russian'>Russian</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Special VHDL symbol at the begin of the comment to extract documentation. Example: <code>--! Code comment</code>
                            <span class="markConfig" id="mark_documentation-general-symbol_vhdl"></span>
                        </div>
                            <input class="setting-input-box" id="documentation-general-symbol_vhdl" value="!">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Special Verilog symbol at the begin of the comment to extract documentation. Example: <code>//! Code comment</code>
                            <span class="markConfig" id="mark_documentation-general-symbol_verilog"></span>
                        </div>
                            <input class="setting-input-box" id="documentation-general-symbol_verilog" value="!">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="documentation-general-dependency_graph">
                            <label class="setting-checkbox-label" for="documentation-general-dependency_graph">
                                Include dependency graph:
                                <span class="markConfig" id="mark_documentation-general-dependency_graph"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="documentation-general-self_contained">
                            <label class="setting-checkbox-label" for="documentation-general-self_contained">
                                HTML documentation self contained:
                                <span class="markConfig" id="mark_documentation-general-self_contained"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="documentation-general-fsm">
                            <label class="setting-checkbox-label" for="documentation-general-fsm">
                                Include FSM:
                                <span class="markConfig" id="mark_documentation-general-fsm"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include ports:
                            <span class="markConfig" id="mark_documentation-general-ports"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-ports">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include generics:
                            <span class="markConfig" id="mark_documentation-general-generics"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-generics">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include instantiations:
                            <span class="markConfig" id="mark_documentation-general-instantiations"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-instantiations">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include signals:
                            <span class="markConfig" id="mark_documentation-general-signals"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-signals">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include consants:
                            <span class="markConfig" id="mark_documentation-general-constants"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-constants">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include types:
                            <span class="markConfig" id="mark_documentation-general-types"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-types">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include always/processes:
                            <span class="markConfig" id="mark_documentation-general-process"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-process">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include functions:
                            <span class="markConfig" id="mark_documentation-general-functions"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-functions">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Include tasks:
                            <span class="markConfig" id="mark_documentation-general-tasks"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="documentation-general-tasks">
                                      <option value='all'>All</option>
                                      <option value='only_commented'>Only commented</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Magic config file path
                            <span class="markConfig" id="mark_documentation-general-magic_config_path"></span>
                        </div>
                            <input class="setting-input-box" id="documentation-general-magic_config_path" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="editor-general">
                <div class="settings-group-title-label">
                    Editor
                    <i class="codicon codicon-question help-icon-button" onclick="window.open('https://terostechnology.github.io/terosHDLdoc/docs/category/editor', '_blank')" title="Go To Documentation"></i>
                </div>
                <div class="settings-group-description"></div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="editor-general-stutter_comment_shortcuts">
                            <label class="setting-checkbox-label" for="editor-general-stutter_comment_shortcuts">
                                Stutter mode: an enter keypress at the end of a line that contains a non-empty comment will continue the comment on the next line. This can be cancelled by pressing enter again. You must also set <code>"editor.formatOnType": true"</code>
                                <span class="markConfig" id="mark_editor-general-stutter_comment_shortcuts"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Width of block comment elements inserted by stutter completions
                            <span class="markConfig" id="mark_editor-general-stutter_block_width"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="editor-general-stutter_block_width">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Max width of block comment elements inserted by stutter completions. Set to zero to disable.
                            <span class="markConfig" id="mark_editor-general-stutter_max_width"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="editor-general-stutter_max_width">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="editor-general-stutter_delimiters">
                            <label class="setting-checkbox-label" for="editor-general-stutter_delimiters">
                                Stutter mode: enable Delimiter Shortcuts
                                <span class="markConfig" id="mark_editor-general-stutter_delimiters"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="editor-general-stutter_bracket_shortcuts">
                            <label class="setting-checkbox-label" for="editor-general-stutter_bracket_shortcuts">
                                Stutter mode: enable Bracket Shortcuts
                                <span class="markConfig" id="mark_editor-general-stutter_bracket_shortcuts"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="formatter-general">
                <div class="settings-group-title-label">
                    Formatter
                    <i class="codicon codicon-question help-icon-button" onclick="window.open('https://terostechnology.github.io/terosHDLdoc/docs/guides/formatter', '_blank')" title="Go To Documentation"></i>
                </div>
                <div class="settings-group-description"></div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Verilog/SV formatter:
                            <span class="markConfig" id="mark_formatter-general-formatter_verilog"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-general-formatter_verilog">
                                      <option value='istyle'>iStyle</option>
                                      <option value='s3sv'>s3sv</option>
                                      <option value='verible'>Verible</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VHDL formatter:
                            <span class="markConfig" id="mark_formatter-general-formatter_vhdl"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-general-formatter_vhdl">
                                      <option value='standalone'>Standalone</option>
                                      <option value='vsg'>VSG</option>
                            </select>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="formatter-istyle">
                <div class="settings-group-title-label">
                    Formatter: iStyle
                </div>
                <div class="settings-group-description">Verilog/SV iStyle formatter</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Predefined Styling options.
                            <span class="markConfig" id="mark_formatter-istyle-style"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-istyle-style">
                                      <option value='ansi'>ANSI</option>
                                      <option value='kr'>Kernighan&Ritchie</option>
                                      <option value='gnu'>GNU</option>
                                      <option value='indent_only'>Indent only</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Indentation size in number of characters.
                            <span class="markConfig" id="mark_formatter-istyle-indentation_size"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="formatter-istyle-indentation_size">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="formatter-s3sv">
                <div class="settings-group-title-label">
                    Formatter: s3sv
                </div>
                <div class="settings-group-description">Verilog/SV S3SV formatter</div>
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="formatter-s3sv-one_bind_per_line">
                            <label class="setting-checkbox-label" for="formatter-s3sv-one_bind_per_line">
                                Force one binding per line in instanciations statements.
                                <span class="markConfig" id="mark_formatter-s3sv-one_bind_per_line"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="formatter-s3sv-one_declaration_per_line">
                            <label class="setting-checkbox-label" for="formatter-s3sv-one_declaration_per_line">
                                Force one declaration per line.
                                <span class="markConfig" id="mark_formatter-s3sv-one_declaration_per_line"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="formatter-s3sv-use_tabs">
                            <label class="setting-checkbox-label" for="formatter-s3sv-use_tabs">
                                Use tabs instead of spaces for indentation.
                                <span class="markConfig" id="mark_formatter-s3sv-use_tabs"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Indentation size in number of characters.
                            <span class="markConfig" id="mark_formatter-s3sv-indentation_size"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="formatter-s3sv-indentation_size">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="formatter-verible">
                <div class="settings-group-title-label">
                    Formatter: Verible
                </div>
                <div class="settings-group-description">Verilog/SV Verible formatter</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Extra command line arguments passed to the Verible tool
                            <span class="markConfig" id="mark_formatter-verible-format_args"></span>
                        </div>
                            <input class="setting-input-box" id="formatter-verible-format_args" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="formatter-standalone">
                <div class="settings-group-title-label">
                    Formatter: VHDL standalone
                </div>
                <div class="settings-group-description">VHDL standalone formatter</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Keyword case. e.g. begin, case, when 
                            <span class="markConfig" id="mark_formatter-standalone-keyword_case"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-standalone-keyword_case">
                                      <option value='lowercase'>LowerCase</option>
                                      <option value='uppercase'>UpperCase</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Type name case. e.g. boolean, natural, string 
                            <span class="markConfig" id="mark_formatter-standalone-name_case"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-standalone-name_case">
                                      <option value='lowercase'>LowerCase</option>
                                      <option value='uppercase'>UpperCase</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Indentation.
                            <span class="markConfig" id="mark_formatter-standalone-indentation"></span>
                        </div>
                            <input class="setting-input-box" id="formatter-standalone-indentation" value="  ">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="formatter-standalone-align_port_generic">
                            <label class="setting-checkbox-label" for="formatter-standalone-align_port_generic">
                                Align signs in ports and generics.
                                <span class="markConfig" id="mark_formatter-standalone-align_port_generic"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="formatter-standalone-align_comment">
                            <label class="setting-checkbox-label" for="formatter-standalone-align_comment">
                                Align comments.
                                <span class="markConfig" id="mark_formatter-standalone-align_comment"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="formatter-standalone-remove_comments">
                            <label class="setting-checkbox-label" for="formatter-standalone-remove_comments">
                                Remove comments.
                                <span class="markConfig" id="mark_formatter-standalone-remove_comments"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="formatter-standalone-remove_reports">
                            <label class="setting-checkbox-label" for="formatter-standalone-remove_reports">
                                Remove reports.
                                <span class="markConfig" id="mark_formatter-standalone-remove_reports"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="formatter-standalone-check_alias">
                            <label class="setting-checkbox-label" for="formatter-standalone-check_alias">
                                All long names will be replaced by ALIAS names.
                                <span class="markConfig" id="mark_formatter-standalone-check_alias"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            New line after THEN.
                            <span class="markConfig" id="mark_formatter-standalone-new_line_after_then"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-standalone-new_line_after_then">
                                      <option value='new_line'>New line</option>
                                      <option value='no_new_line'>No new line</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            New line after semicolon ';'.
                            <span class="markConfig" id="mark_formatter-standalone-new_line_after_semicolon"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-standalone-new_line_after_semicolon">
                                      <option value='new_line'>New line</option>
                                      <option value='no_new_line'>No new line</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            New line after ELSE.
                            <span class="markConfig" id="mark_formatter-standalone-new_line_after_else"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-standalone-new_line_after_else">
                                      <option value='new_line'>New line</option>
                                      <option value='no_new_line'>No new line</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            New line after PORT | PORT MAP.
                            <span class="markConfig" id="mark_formatter-standalone-new_line_after_port"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-standalone-new_line_after_port">
                                      <option value='new_line'>New line</option>
                                      <option value='no_new_line'>No new line</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            New line after GENERIC.
                            <span class="markConfig" id="mark_formatter-standalone-new_line_after_generic"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="formatter-standalone-new_line_after_generic">
                                      <option value='new_line'>New line</option>
                                      <option value='no_new_line'>No new line</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="formatter-vsg">
                <div class="settings-group-title-label">
                    Formatter: VHDL VSG
                </div>
                <div class="settings-group-description">Configure VSG in the tool section: tools -> VSG</div>
                  
                  
            </div>
            <div class="settings-section" id="linter-general">
                <div class="settings-group-title-label">
                    Linter settings
                    <i class="codicon codicon-question help-icon-button" onclick="window.open('https://terostechnology.github.io/terosHDLdoc/docs/guides/linter', '_blank')" title="Go To Documentation"></i>
                </div>
                <div class="settings-group-description"></div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VHDL linter: disable VHDL-LS needs restart VSCode.
                            <span class="markConfig" id="mark_linter-general-linter_vhdl"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="linter-general-linter_vhdl">
                                      <option value='disabled'>Disabled</option>
                                      <option value='ghdl'>GHDL</option>
                                      <option value='modelsim'>Modelsim</option>
                                      <option value='vivado'>Vivado (xvhdl)</option>
                                      <option value='none'>VHDL-LS</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Verilog/SV linter:
                            <span class="markConfig" id="mark_linter-general-linter_verilog"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="linter-general-linter_verilog">
                                      <option value='disabled'>Disabled</option>
                                      <option value='icarus'>Icarus</option>
                                      <option value='modelsim'>Modelsim</option>
                                      <option value='verilator'>Verilator</option>
                                      <option value='vivado'>Vivado (xvlog)</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Verilog/SV style checker:
                            <span class="markConfig" id="mark_linter-general-lstyle_verilog"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="linter-general-lstyle_verilog">
                                      <option value='verible'>Verible</option>
                                      <option value='disabled'>Disabled</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VHDL style checker:
                            <span class="markConfig" id="mark_linter-general-lstyle_vhdl"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="linter-general-lstyle_vhdl">
                                      <option value='vsg'>VSG</option>
                                      <option value='disabled'>Disabled</option>
                            </select>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="linter-vhdlls">
                <div class="settings-group-title-label">
                    Linter settings: VHDL-LS linter
                </div>
                <div class="settings-group-description">Fast VHDL language server and analysis library written in Rust.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Define the VHDL revision to use for parsing and analysis with the standard key. The expected value is the year associated the VHDL standard. Defining the standard feature is a relatively new feature (since april 2024). Anything but the 2008 standard will not change much at the moment.
                            <span class="markConfig" id="mark_linter-vhdlls-standard"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="linter-vhdlls-standard">
                                      <option value='v1993'>1993</option>
                                      <option value='v2008'>2008</option>
                                      <option value='v2019'>2019</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="linter-vhdlls-ignoreVunit">
                            <label class="setting-checkbox-label" for="linter-vhdlls-ignoreVunit">
                                It will ignore the VUnit library in vunit_lib.
                                <span class="markConfig" id="mark_linter-vhdlls-ignoreVunit"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Path to the VUnit files. Example: '/home/myuser/.venvs/default/lib/python3.12/site-packages/vunit/vhdl/**/*.vhd'
                            <span class="markConfig" id="mark_linter-vhdlls-vunitPath"></span>
                        </div>
                            <input class="setting-input-box" id="linter-vhdlls-vunitPath" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="linter-ghdl">
                <div class="settings-group-title-label">
                    Linter settings: GHDL linter
                </div>
                <div class="settings-group-description"></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Arguments.
                            <span class="markConfig" id="mark_linter-ghdl-arguments"></span>
                        </div>
                            <input class="setting-input-box" id="linter-ghdl-arguments" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="linter-icarus">
                <div class="settings-group-title-label">
                    Linter settings: Icarus linter
                </div>
                <div class="settings-group-description"></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Arguments.
                            <span class="markConfig" id="mark_linter-icarus-arguments"></span>
                        </div>
                            <input class="setting-input-box" id="linter-icarus-arguments" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="linter-modelsim">
                <div class="settings-group-title-label">
                    Linter settings: ModelSim linter
                </div>
                <div class="settings-group-description"></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VHDL linter arguments.
                            <span class="markConfig" id="mark_linter-modelsim-vhdl_arguments"></span>
                        </div>
                            <input class="setting-input-box" id="linter-modelsim-vhdl_arguments" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Verilog/SV linter arguments.
                            <span class="markConfig" id="mark_linter-modelsim-verilog_arguments"></span>
                        </div>
                            <input class="setting-input-box" id="linter-modelsim-verilog_arguments" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="linter-verible">
                <div class="settings-group-title-label">
                    Linter settings: Verible linter
                </div>
                <div class="settings-group-description"></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Arguments.
                            <span class="markConfig" id="mark_linter-verible-arguments"></span>
                        </div>
                            <input class="setting-input-box" id="linter-verible-arguments" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="linter-verilator">
                <div class="settings-group-title-label">
                    Linter settings: Verilator linter
                </div>
                <div class="settings-group-description"></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Arguments.
                            <span class="markConfig" id="mark_linter-verilator-arguments"></span>
                        </div>
                            <input class="setting-input-box" id="linter-verilator-arguments" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="linter-vivado">
                <div class="settings-group-title-label">
                    Linter settings: Vivado linter
                </div>
                <div class="settings-group-description"></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VHDL linter arguments.
                            <span class="markConfig" id="mark_linter-vivado-vhdl_arguments"></span>
                        </div>
                            <input class="setting-input-box" id="linter-vivado-vhdl_arguments" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Verilog/SV linter arguments.
                            <span class="markConfig" id="mark_linter-vivado-verilog_arguments"></span>
                        </div>
                            <input class="setting-input-box" id="linter-vivado-verilog_arguments" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="linter-vsg">
                <div class="settings-group-title-label">
                    Linter settings: VSG linter
                </div>
                <div class="settings-group-description">Configure VSG in the tool section: tools -> VSG</div>
                  
                  
            </div>
            <div class="settings-section" id="schematic-general">
                <div class="settings-group-title-label">
                    Schematic viewer
                    <i class="codicon codicon-question help-icon-button" onclick="window.open('https://terostechnology.github.io/terosHDLdoc/docs/guides/schematic_viewer/installation', '_blank')" title="Go To Documentation"></i>
                </div>
                <div class="settings-group-description"></div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Select the backend:
                            <span class="markConfig" id="mark_schematic-general-backend"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="schematic-general-backend">
                                      <option value='yowasp'>YoWASP (Only Verilog/SV)</option>
                                      <option value='yosys'>Yosys (Only Verilog/SV)</option>
                                      <option value='yosys_ghdl'>GHDL + Yosys (VHDL+Verilog/SV)</option>
                                      <option value='standalone'>Standalone (Verilog/SV)</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Extra options passed before to run yowasp-yosys or yosys. Eg: 'conda activate base & ' or 'C:/OSS-CAD-SUITE/oss-cad-suite/start.bat & '
                            <span class="markConfig" id="mark_schematic-general-extra"></span>
                        </div>
                            <input class="setting-input-box" id="schematic-general-extra" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Arguments passed to Yosys
                            <span class="markConfig" id="mark_schematic-general-args"></span>
                        </div>
                            <input class="setting-input-box" id="schematic-general-args" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Arguments passed to GHDL
                            <span class="markConfig" id="mark_schematic-general-args_ghdl"></span>
                        </div>
                            <input class="setting-input-box" id="schematic-general-args_ghdl" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="templates-general">
                <div class="settings-group-title-label">
                    Templates
                    <i class="codicon codicon-question help-icon-button" onclick="window.open('https://terostechnology.github.io/terosHDLdoc/docs/guides/templates', '_blank')" title="Go To Documentation"></i>
                </div>
                <div class="settings-group-description"></div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            File path with your configurable header. E.g. your company license. It will be inserted at the beginning of the template
                            <span class="markConfig" id="mark_templates-general-header_file_path"></span>
                        </div>
                            <input class="setting-input-box" id="templates-general-header_file_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Indent
                            <span class="markConfig" id="mark_templates-general-indent"></span>
                        </div>
                            <input class="setting-input-box" id="templates-general-indent" value="  ">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Clock generation style:
                            <span class="markConfig" id="mark_templates-general-clock_generation_style"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="templates-general-clock_generation_style">
                                      <option value='inline'>Inline</option>
                                      <option value='ifelse'>if/else</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Instantiation style:
                            <span class="markConfig" id="mark_templates-general-instance_style"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="templates-general-instance_style">
                                      <option value='inline'>Inline</option>
                                      <option value='separate'>Separate</option>
                            </select>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-general">
                <div class="settings-group-title-label">
                    Tools
                </div>
                <div class="settings-group-description"></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Select a tool, framework, simulator...
                            <span class="markConfig" id="mark_tools-general-select_tool"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-general-select_tool">
                                      <option value='osvvm'>OSVVM</option>
                                      <option value='vunit'>VUnit</option>
                                      <option value='ghdl'>GHDL</option>
                                      <option value='cocotb'>cocotb</option>
                                      <option value='icarus'>Icarus</option>
                                      <option value='icestorm'>Icestorm</option>
                                      <option value='ise'>ISE</option>
                                      <option value='isim'>ISIM</option>
                                      <option value='modelsim'>ModelSim</option>
                                      <option value='openfpga'>OpenFPGA</option>
                                      <option value='quartus'>Quartus</option>
                                      <option value='rivierapro'>Riviera-PRO</option>
                                      <option value='spyglass'>SpyGlass</option>
                                      <option value='trellis'>Trellis</option>
                                      <option value='vcs'>VCS</option>
                                      <option value='verilator'>Verilator</option>
                                      <option value='vivado'>Vivado</option>
                                      <option value='xcelium'>Xcelium</option>
                                      <option value='xsim'>XSIM</option>
                                      <option value='raptor'>Raptor Design Suite</option>
                                      <option value='radiant'>Radiant</option>
                                      <option value='sandpiper'>SandPiper</option>
                                      <option value='yosys'>Yosys</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Path to the file with the manual compilation order.
                            <span class="markConfig" id="mark_tools-general-manual_compilation_order"></span>
                        </div>
                            <input class="setting-input-box" id="tools-general-manual_compilation_order" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Select the execution mode.
                            <span class="markConfig" id="mark_tools-general-execution_mode"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-general-execution_mode">
                                      <option value='gui'>GUI</option>
                                      <option value='cmd'>Command line</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Select the waveform viewer. For GTKWave you need to install it.
                            <span class="markConfig" id="mark_tools-general-waveform_viewer"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-general-waveform_viewer">
                                      <option value='tool'>Simulator's built-in waveform viewer</option>
                                      <option value='vaporView'>VaporView</option>
                                      <option value='gtkwave'>GTKWave</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            GTKWave installation directory.
                            <span class="markConfig" id="mark_tools-general-gtkwave_installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-general-gtkwave_installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Extra arguments passed to GTKwave. E.g: --script=script.tcl
                            <span class="markConfig" id="mark_tools-general-gtkwave_extra_arguments"></span>
                        </div>
                            <input class="setting-input-box" id="tools-general-gtkwave_extra_arguments" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-quartus">
                <div class="settings-group-title-label">
                    Tools: Intel@ Quartus@ Prime
                </div>
                <div class="settings-group-description">The intuitive high-performance design environment. From design entry and synthesis to optimization, verification, and simulation, Intel® Quartus® Prime Design Software unlocks increased capabilities on devices with multi-million logic elements, providing designers with the ideal platform to meet next-generation design opportunities.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-quartus-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-quartus-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA family (e.g. Cyclone V).
                            <span class="markConfig" id="mark_tools-quartus-family"></span>
                        </div>
                            <input class="setting-input-box" id="tools-quartus-family" value="" disabled>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA device (e.g. 5CSXFC6D6F31C8ES).
                            <span class="markConfig" id="mark_tools-quartus-device"></span>
                        </div>
                            <input class="setting-input-box" id="tools-quartus-device" value="" disabled>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Specifies your overall optimization focus for implementation of your synthesized logic. By default, the Compiler uses a balanced mode respecting the design's timing constraints. Use alternate modes to specify a different optimization focus. High effort modes enable additional optimizations that increase compilation time. Aggressive modes may increase compilation time and may also be detrimental to other optimizations.
                            <span class="markConfig" id="mark_tools-quartus-optimization_mode"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-quartus-optimization_mode">
                                      <option value='BALANCED'>Balanced (normal flow)</option>
                                      <option value='HIGH_PERFORMANCE_EFFORT'>High Performance Effort</option>
                                      <option value='HIGH_PERFORMANCE_EFFORT_WITH_MAXIMUM_PLACEMENT_EFFORT'>High Performance with Maximum Placement Effort</option>
                                      <option value='HIGH_PERFORMANCE_WITH_AGGRESSIVE_POWER_EFFORT'>High Performance with Aggressive Power Effort</option>
                                      <option value='SUPERIOR_PERFORMANCE'>Superior Performance (adds synthesis optimization for speed)</option>
                                      <option value='SUPERIOR_PERFORMANCE_WITH_MAXIMUM_PLACEMENT_EFFORT'>Superior Performance with Maximum Placement Effort</option>
                                      <option value='AGGRESSIVE_AREA'>Aggressive Area (reduces performance)</option>
                                      <option value='HIGH_PLACEMENT_ROUTABILITY_EFFORT'>High Placement Routability Effort</option>
                                      <option value='HIGH_PACKING_ROUTABILITY_EFFORT'>High Packing Routability Effort</option>
                                      <option value='OPTIMIZE_NETLIST_FOR_ROUTABILITY'>Optimize Netlist for Routability</option>
                                      <option value='AGGRESSIVE_POWER'>Aggressive Power (reduces performance)</option>
                                      <option value='AGGRESSIVE_COMPILE_TIME'>Agressive Compile Time (reduces performance)</option>
                                      <option value='FAST_FUNCTIONAL_TEST'>Fast Functional Test (reduces performance)</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-quartus-allow_register_retiming">
                            <label class="setting-checkbox-label" for="tools-quartus-allow_register_retiming">
                                Allow Register Retiming.
                                <span class="markConfig" id="mark_tools-quartus-allow_register_retiming"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Custom waves file path for simulations:
                            <span class="markConfig" id="mark_tools-quartus-wave_file_questa"></span>
                        </div>
                            <input class="setting-input-box" id="tools-quartus-wave_file_questa" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-vsg">
                <div class="settings-group-title-label">
                    Tools: VSG
                </div>
                <div class="settings-group-description">VHDL Style Guide.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path. E.g. /home/myuser/.venvs/default/bin/
                            <span class="markConfig" id="mark_tools-vsg-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vsg-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Path JSON or YAML configuration file.
                            <span class="markConfig" id="mark_tools-vsg-style_config"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vsg-style_config" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Number of parallel jobs to use, default is the number of cpu cores.
                            <span class="markConfig" id="mark_tools-vsg-core_number"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="tools-vsg-core_number">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional arguments to pass to the VSG command.
                            <span class="markConfig" id="mark_tools-vsg-aditional_arguments"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vsg-aditional_arguments" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-osvvm">
                <div class="settings-group-title-label">
                    Tools: OSVVM
                </div>
                <div class="settings-group-description">OSVVM is an advanced verification methodology that defines a VHDL verification framework, verification utility library, verification component library, and a scripting flow that simplifies your FPGA or ASIC verification project from start to finish. Using these libraries you can create a simple, readable, and powerful testbench that is suitable for either a simple FPGA block or a complex ASIC.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-osvvm-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-osvvm-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            tclsh binary path. E.g: /usr/bin/tclsh8.6
                            <span class="markConfig" id="mark_tools-osvvm-tclsh_binary"></span>
                        </div>
                            <input class="setting-input-box" id="tools-osvvm-tclsh_binary" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Selects which simulator to use.
                            <span class="markConfig" id="mark_tools-osvvm-simulator_name"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-osvvm-simulator_name">
                                      <option value='activehdl'>Aldec Active-HDL</option>
                                      <option value='ghdl'>GHDL</option>
                                      <option value='nvc'>NVC</option>
                                      <option value='rivierapro'>Aldec Riviera-PRO</option>
                                      <option value='questa'>Mentor/Siemens EDA Questa</option>
                                      <option value='modelsim'>Mentor/Siemens EDA ModelSim</option>
                                      <option value='vcs'>VCS</option>
                                      <option value='xsim'>XSIM</option>
                                      <option value='xcelium'>Xcelium</option>
                            </select>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-ascenlint">
                <div class="settings-group-title-label">
                    Tools: Ascenlint
                </div>
                <div class="settings-group-description">Ascent Lint performs static source code analysis on HDL code and checks for common coding errors or coding style violations.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-ascenlint-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ascenlint-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional run options for ascentlint.
                            <span class="markConfig" id="mark_tools-ascenlint-ascentlint_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ascenlint-ascentlint_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-cocotb">
                <div class="settings-group-title-label">
                    Tools: Cocotb
                </div>
                <div class="settings-group-description"></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-cocotb-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-cocotb-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Selects which simulator Makefile to use. Attempts to include a simulator specific makefile from cocotb/share/makefiles/simulators/makefile.$(SIM)
                            <span class="markConfig" id="mark_tools-cocotb-simulator_name"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-cocotb-simulator_name">
                                      <option value='icarus'>icarus</option>
                                      <option value='verilator'>Verilator</option>
                                      <option value='vcs'>Synopsys VCS</option>
                                      <option value='riviera'>Aldec Riviera-PRO</option>
                                      <option value='activehdl'>Aldec Active-HDL</option>
                                      <option value='questa'>Mentor/Siemens EDA Questa</option>
                                      <option value='modelsim'>Mentor/Siemens EDA ModelSim</option>
                                      <option value='ius'>Cadence Incisive</option>
                                      <option value='xcelium'>Cadence Xcelium</option>
                                      <option value='ghdl'>GHDL</option>
                                      <option value='cvc'>Tachyon DA CVC</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Any arguments or flags to pass to the compile stage of the simulation.
                            <span class="markConfig" id="mark_tools-cocotb-compile_args"></span>
                        </div>
                            <input class="setting-input-box" id="tools-cocotb-compile_args" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Any argument to be passed to the “first” invocation of a simulator that runs via a TCL script. One motivating usage is to pass -noautoldlibpath to Questa to prevent it from loading the out-of-date libraries it ships with. Used by Aldec Riviera-PRO and Mentor Graphics Questa simulator.
                            <span class="markConfig" id="mark_tools-cocotb-run_args"></span>
                        </div>
                            <input class="setting-input-box" id="tools-cocotb-run_args" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            They are options that are starting with a plus (+) sign. They are passed to the simulator and are also available within cocotb as cocotb.plusargs. In the simulator, they can be read by the Verilog/SystemVerilog system functions $test$plusargs and $value$plusargs. The special plusargs +ntb_random_seed and +seed, if present, are evaluated to set the random seed value if RANDOM_SEED is not set. If both +ntb_random_seed and +seed are set, +ntb_random_seed is used.
                            <span class="markConfig" id="mark_tools-cocotb-plusargs"></span>
                        </div>
                            <input class="setting-input-box" id="tools-cocotb-plusargs" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-diamond">
                <div class="settings-group-title-label">
                    Tools: Diamond
                </div>
                <div class="settings-group-description">Backend for Lattice Diamond.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-diamond-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-diamond-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA part number (e.g. LFE5U-45F-6BG381C).
                            <span class="markConfig" id="mark_tools-diamond-part"></span>
                        </div>
                            <input class="setting-input-box" id="tools-diamond-part" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-ghdl">
                <div class="settings-group-title-label">
                    Tools: GHDL
                </div>
                <div class="settings-group-description">GHDL is an open source VHDL simulator, which fully supports IEEE 1076-1987, IEEE 1076-1993, IEE 1076-2002 and partially the 1076-2008 version of VHDL.</div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Basic GHDL Configuration</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-ghdl-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-installation_path" value="">
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">VHDL Language Settings</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Force specific VHDL standard version (overrides file-detected standard):
                            <span class="markConfig" id="mark_tools-ghdl-vhdl_standard"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-vhdl_standard">
                                      <option value='auto'>Auto-detect from file</option>
                                      <option value='vhdl87'>Force VHDL-87</option>
                                      <option value='vhdl93'>Force VHDL-93</option>
                                      <option value='vhdl02'>Force VHDL-2002</option>
                                      <option value='vhdl08'>Force VHDL-2008</option>
                                      <option value='vhdl19'>Force VHDL-2019</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            IEEE library to use:
                            <span class="markConfig" id="mark_tools-ghdl-ieee_library"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-ieee_library">
                                      <option value='standard'>Standard IEEE</option>
                                      <option value='synopsys'>Synopsys IEEE</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-relaxed_parsing">
                            <label class="setting-checkbox-label" for="tools-ghdl-relaxed_parsing">
                                Enable relaxed VHDL parsing rules:
                                <span class="markConfig" id="mark_tools-ghdl-relaxed_parsing"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-unicode_support">
                            <label class="setting-checkbox-label" for="tools-ghdl-unicode_support">
                                Enable Unicode identifiers support:
                                <span class="markConfig" id="mark_tools-ghdl-unicode_support"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-psl_enabled">
                            <label class="setting-checkbox-label" for="tools-ghdl-psl_enabled">
                                Enable PSL (Property Specification Language) support:
                                <span class="markConfig" id="mark_tools-ghdl-psl_enabled"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Library Management</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Default work library name:
                            <span class="markConfig" id="mark_tools-ghdl-work_library"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-work_library" value="work">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional library search paths:
                            <span class="markConfig" id="mark_tools-ghdl-library_paths"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-library_paths">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Stage-Specific Options</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Check syntax options. Extra options used for GHDL syntax check (ghdl -s).
                            <span class="markConfig" id="mark_tools-ghdl-check_syntax_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-check_syntax_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Analyze options. Extra options used for the GHDL analyze stage (ghdl -a).
                            <span class="markConfig" id="mark_tools-ghdl-analyze_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-analyze_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Elaborate options. Extra options used for the GHDL elaborate stage (ghdl -e).
                            <span class="markConfig" id="mark_tools-ghdl-elaborate_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-elaborate_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Run options. Extra options used when running GHDL simulations (ghdl -r).
                            <span class="markConfig" id="mark_tools-ghdl-run_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-run_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Synthesis options for GHDL synthesis (ghdl --synth):
                            <span class="markConfig" id="mark_tools-ghdl-synthesis_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-synthesis_options">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Custom Configuration</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional custom flags for all GHDL commands:
                            <span class="markConfig" id="mark_tools-ghdl-extra_flags"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-extra_flags">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Elaboration and Binding</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-relaxed_rules">
                            <label class="setting-checkbox-label" for="tools-ghdl-relaxed_rules">
                                Enable relaxed elaboration rules (--mb-comments):
                                <span class="markConfig" id="mark_tools-ghdl-relaxed_rules"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-bind_checks">
                            <label class="setting-checkbox-label" for="tools-ghdl-bind_checks">
                                Enable binding checks during elaboration:
                                <span class="markConfig" id="mark_tools-ghdl-bind_checks"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-vital_checks">
                            <label class="setting-checkbox-label" for="tools-ghdl-vital_checks">
                                Enable VITAL compliance checks:
                                <span class="markConfig" id="mark_tools-ghdl-vital_checks"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Simulation Settings</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Simulation time limit (e.g., 1us, 100ns, 1ms). Leave empty for no limit.
                            <span class="markConfig" id="mark_tools-ghdl-simulation_time"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-simulation_time" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Time resolution limit (e.g., 1ps, 1ns, 1us):
                            <span class="markConfig" id="mark_tools-ghdl-resolution_limit"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-resolution_limit" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Stack size for simulation (e.g., 1MB, 16MB, 64MB). Leave empty for default.
                            <span class="markConfig" id="mark_tools-ghdl-stack_size"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-stack_size" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Stop simulation after N delta cycles (--stop-delta):
                            <span class="markConfig" id="mark_tools-ghdl-stop_delta_cycles"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="tools-ghdl-stop_delta_cycles">
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Waveform Output</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-waveform_enabled">
                            <label class="setting-checkbox-label" for="tools-ghdl-waveform_enabled">
                                Enable waveform generation during simulation:
                                <span class="markConfig" id="mark_tools-ghdl-waveform_enabled"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Waveform output format:
                            <span class="markConfig" id="mark_tools-ghdl-waveform_format"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-waveform_format">
                                      <option value='vcd'>VCD</option>
                                      <option value='ghw'>GHW</option>
                                      <option value='fst'>FST</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional waveform generation options (e.g., --vcd-4states, --wave-start-time=0ns):
                            <span class="markConfig" id="mark_tools-ghdl-waveform_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-waveform_options">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Waveform Advanced Options</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Start time for waveform recording (e.g., 0ns, 10us):
                            <span class="markConfig" id="mark_tools-ghdl-wave_start_time"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-wave_start_time" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-vcd_4states">
                            <label class="setting-checkbox-label" for="tools-ghdl-vcd_4states">
                                Use 4-state VCD format (--vcd-4states):
                                <span class="markConfig" id="mark_tools-ghdl-vcd_4states"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-vcd_nodate">
                            <label class="setting-checkbox-label" for="tools-ghdl-vcd_nodate">
                                Do not write date in VCD file (--vcd-nodate):
                                <span class="markConfig" id="mark_tools-ghdl-vcd_nodate"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Wave option file for signal filtering (--read-wave-opt):
                            <span class="markConfig" id="mark_tools-ghdl-read_wave_opt"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-read_wave_opt" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Create wave option file with all signals (--write-wave-opt):
                            <span class="markConfig" id="mark_tools-ghdl-write_wave_opt"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-write_wave_opt" value="">
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Debug and Analysis</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Debug information level:
                            <span class="markConfig" id="mark_tools-ghdl-debug_level"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-debug_level">
                                      <option value='none'>No debug info</option>
                                      <option value='minimal'>Minimal debug info</option>
                                      <option value='full'>Full debug info</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-verbose">
                            <label class="setting-checkbox-label" for="tools-ghdl-verbose">
                                Enable verbose output for all GHDL commands:
                                <span class="markConfig" id="mark_tools-ghdl-verbose"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Error and Warning Handling</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-warnings_as_errors">
                            <label class="setting-checkbox-label" for="tools-ghdl-warnings_as_errors">
                                Treat warnings as errors:
                                <span class="markConfig" id="mark_tools-ghdl-warnings_as_errors"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Warning types to suppress (e.g., binding, elaboration, runtime):
                            <span class="markConfig" id="mark_tools-ghdl-suppress_warnings"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-suppress_warnings">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Assertions and Verification</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Assertion severity level:
                            <span class="markConfig" id="mark_tools-ghdl-assert_level"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-assert_level">
                                      <option value='note'>Note level</option>
                                      <option value='warning'>Warning level</option>
                                      <option value='error'>Error level</option>
                                      <option value='failure'>Failure level</option>
                                      <option value='none'>Disable assertions</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Time and Display Options</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-display_time">
                            <label class="setting-checkbox-label" for="tools-ghdl-display_time">
                                Display time and delta cycle number (--disp-time):
                                <span class="markConfig" id="mark_tools-ghdl-display_time"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-unbuffered_output">
                            <label class="setting-checkbox-label" for="tools-ghdl-unbuffered_output">
                                Disable buffering on stdout (--unbuffered):
                                <span class="markConfig" id="mark_tools-ghdl-unbuffered_output"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Maximum stack allocation size in KB (--max-stack-alloc, 0 to disable):
                            <span class="markConfig" id="mark_tools-ghdl-max_stack_alloc"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="tools-ghdl-max_stack_alloc">
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Backtrace and Debugging</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Minimum severity level for backtrace on assert/report:
                            <span class="markConfig" id="mark_tools-ghdl-backtrace_severity"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-backtrace_severity">
                                      <option value='note'>Note level</option>
                                      <option value='warning'>Warning level</option>
                                      <option value='error'>Error level</option>
                                      <option value='failure'>Failure level</option>
                                      <option value='none'>Disable backtrace</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">IEEE Standards Compliance</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Control IEEE assertion handling:
                            <span class="markConfig" id="mark_tools-ghdl-ieee_asserts"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-ieee_asserts">
                                      <option value='enable'>Enable IEEE assertions</option>
                                      <option value='disable'>Disable IEEE assertions</option>
                                      <option value='disable-at-0'>Disable at time 0</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Policy for handling assertions:
                            <span class="markConfig" id="mark_tools-ghdl-asserts_policy"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-asserts_policy">
                                      <option value='enable'>Enable assertions</option>
                                      <option value='disable'>Disable assertions</option>
                                      <option value='disable-at-0'>Disable at time 0</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">File I/O and External Interfaces</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            SDF file for timing annotation (--sdf):
                            <span class="markConfig" id="mark_tools-ghdl-sdf_file"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-sdf_file" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VPI modules to load (--vpi):
                            <span class="markConfig" id="mark_tools-ghdl-vpi_modules"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-vpi_modules">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VHPI modules to load (--vhpi):
                            <span class="markConfig" id="mark_tools-ghdl-vhpi_modules"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-ghdl-vhpi_modules">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VPI trace output file (--vpi-trace):
                            <span class="markConfig" id="mark_tools-ghdl-vpi_trace_file"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-vpi_trace_file" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VHPI trace output file (--vhpi-trace):
                            <span class="markConfig" id="mark_tools-ghdl-vhpi_trace_file"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-vhpi_trace_file" value="">
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">PSL and Hierarchy Display</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            PSL report output file (--psl-report):
                            <span class="markConfig" id="mark_tools-ghdl-psl_report_file"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ghdl-psl_report_file" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-psl_report_uncovered">
                            <label class="setting-checkbox-label" for="tools-ghdl-psl_report_uncovered">
                                Report uncovered PSL cover points (--psl-report-uncovered):
                                <span class="markConfig" id="mark_tools-ghdl-psl_report_uncovered"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Display design hierarchy (--disp-tree):
                            <span class="markConfig" id="mark_tools-ghdl-disp_tree"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-ghdl-disp_tree">
                                      <option value='none'>No hierarchy display</option>
                                      <option value='inst'>Display instances</option>
                                      <option value='proc'>Display processes</option>
                                      <option value='port'>Display ports and signals</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Execution Control</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-ghdl-no_run">
                            <label class="setting-checkbox-label" for="tools-ghdl-no_run">
                                Elaborate but do not run simulation:
                                <span class="markConfig" id="mark_tools-ghdl-no_run"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-icarus">
                <div class="settings-group-title-label">
                    Tools: Icarus
                </div>
                <div class="settings-group-description">Icarus Verilog is a Verilog simulation and synthesis tool. It operates as a compiler, compiling source code written in Verilog (IEEE-1364) into some target format.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-icarus-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-icarus-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Default timescale.
                            <span class="markConfig" id="mark_tools-icarus-timescale"></span>
                        </div>
                            <input class="setting-input-box" id="tools-icarus-timescale" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for iverilog.
                            <span class="markConfig" id="mark_tools-icarus-iverilog_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-icarus-iverilog_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-icestorm">
                <div class="settings-group-title-label">
                    Tools: Icestorm
                </div>
                <div class="settings-group-description">Open source toolchain for Lattice iCE40 FPGAs. Uses yosys for synthesis and arachne-pnr or nextpnr for Place & Route.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-icestorm-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-icestorm-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Select P&R tool. Valid values are arachne and next. Default is arachne.
                            <span class="markConfig" id="mark_tools-icestorm-pnr"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-icestorm-pnr">
                                      <option value='arachne'>Arachne-pnr</option>
                                      <option value='next'>nextpnr</option>
                                      <option value='none'>Only perform synthesis</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Target architecture.
                            <span class="markConfig" id="mark_tools-icestorm-arch"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-icestorm-arch">
                                      <option value='xilinx'>Xilinx</option>
                                      <option value='ice40'>ICE40</option>
                                      <option value='ecp5'>ECP5</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Output file format.
                            <span class="markConfig" id="mark_tools-icestorm-output_format"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-icestorm-output_format">
                                      <option value='json'>JSON</option>
                                      <option value='edif'>EDIF</option>
                                      <option value='blif'>BLIF</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-icestorm-yosys_as_subtool">
                            <label class="setting-checkbox-label" for="tools-icestorm-yosys_as_subtool">
                                Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.
                                <span class="markConfig" id="mark_tools-icestorm-yosys_as_subtool"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Generated makefile name, defaults to $name.mk
                            <span class="markConfig" id="mark_tools-icestorm-makefile_name"></span>
                        </div>
                            <input class="setting-input-box" id="tools-icestorm-makefile_name" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for ArachnePNR Place & Route.
                            <span class="markConfig" id="mark_tools-icestorm-arachne_pnr_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-icestorm-arachne_pnr_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for NextPNR Place & Route.
                            <span class="markConfig" id="mark_tools-icestorm-nextpnr_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-icestorm-nextpnr_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for the synth_ice40 command.
                            <span class="markConfig" id="mark_tools-icestorm-yosys_synth_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-icestorm-yosys_synth_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-ise">
                <div class="settings-group-title-label">
                    Tools: ISE
                </div>
                <div class="settings-group-description">Xilinx ISE Design Suite.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-ise-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ise-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA family (e.g. spartan6).
                            <span class="markConfig" id="mark_tools-ise-family"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ise-family" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA device (e.g. xc6slx45).
                            <span class="markConfig" id="mark_tools-ise-device"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ise-device" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA package (e.g. csg324).
                            <span class="markConfig" id="mark_tools-ise-package"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ise-package" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA speed grade (e.g. -2).
                            <span class="markConfig" id="mark_tools-ise-speed"></span>
                        </div>
                            <input class="setting-input-box" id="tools-ise-speed" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-isem">
                <div class="settings-group-title-label">
                    Tools: ISIM
                </div>
                <div class="settings-group-description">Xilinx ISim simulator from ISE design suite.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-isem-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-isem-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for compilation with FUSE.
                            <span class="markConfig" id="mark_tools-isem-fuse_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-isem-fuse_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional run options for ISim.
                            <span class="markConfig" id="mark_tools-isem-isim_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-isem-isim_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-modelsim">
                <div class="settings-group-title-label">
                    Tools: ModelSim
                </div>
                <div class="settings-group-description">ModelSim simulator from Mentor Graphics.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-modelsim-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-modelsim-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for compilation with vcom.
                            <span class="markConfig" id="mark_tools-modelsim-vcom_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-modelsim-vcom_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for compilation with vlog.
                            <span class="markConfig" id="mark_tools-modelsim-vlog_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-modelsim-vlog_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional run options for vsim.
                            <span class="markConfig" id="mark_tools-modelsim-vsim_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-modelsim-vsim_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-morty">
                <div class="settings-group-title-label">
                    Tools: Morty
                </div>
                <div class="settings-group-description">Run the (System-) Verilog pickle tool called morty.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-morty-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-morty-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Run-time options passed to morty..
                            <span class="markConfig" id="mark_tools-morty-morty_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-morty-morty_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-radiant">
                <div class="settings-group-title-label">
                    Tools: Radiant
                </div>
                <div class="settings-group-description">Backend for Lattice Radiant.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-radiant-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-radiant-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA part number (e.g. LIFCL-40-9BG400C).
                            <span class="markConfig" id="mark_tools-radiant-part"></span>
                        </div>
                            <input class="setting-input-box" id="tools-radiant-part" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-rivierapro">
                <div class="settings-group-title-label">
                    Tools: Rivierapro
                </div>
                <div class="settings-group-description">Riviera Pro simulator from Aldec.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-rivierapro-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-rivierapro-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Common or separate compilation, sep - for separate compilation, common - for common compilation.
                            <span class="markConfig" id="mark_tools-rivierapro-compilation_mode"></span>
                        </div>
                            <input class="setting-input-box" id="tools-rivierapro-compilation_mode" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for compilation with vlog.
                            <span class="markConfig" id="mark_tools-rivierapro-vlog_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-rivierapro-vlog_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional run options for vsim.
                            <span class="markConfig" id="mark_tools-rivierapro-vsim_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-rivierapro-vsim_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-siliconcompiler">
                <div class="settings-group-title-label">
                    Tools: SiliconCompiler
                </div>
                <div class="settings-group-description">SiliconCompiler is an open source compiler framework that automates translation from source code to silicon. Check the project documentation: <a href="https://docs.siliconcompiler.com/en/latest/">https://docs.siliconcompiler.com/en/latest/</a></div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            
                            <span class="markConfig" id="mark_tools-siliconcompiler-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-siliconcompiler-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Compilation target separated by a single underscore, specified as '<process>_<edaflow>' for ASIC compilation and '<partname>_<edaflow>'' for FPGA compilation. The process, edaflow, partname fields must be alphanumeric and cannot contain underscores. E.g: asicflow_freepdk45
                            <span class="markConfig" id="mark_tools-siliconcompiler-target"></span>
                        </div>
                            <input class="setting-input-box" id="tools-siliconcompiler-target" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-siliconcompiler-server_enable">
                            <label class="setting-checkbox-label" for="tools-siliconcompiler-server_enable">
                                Enable remote server.
                                <span class="markConfig" id="mark_tools-siliconcompiler-server_enable"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Remote server address (e.g: https://server.siliconcompiler.com):
                            <span class="markConfig" id="mark_tools-siliconcompiler-server_address"></span>
                        </div>
                            <input class="setting-input-box" id="tools-siliconcompiler-server_address" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Remote server user:
                            <span class="markConfig" id="mark_tools-siliconcompiler-server_username"></span>
                        </div>
                            <input class="setting-input-box" id="tools-siliconcompiler-server_username" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Remote server password:
                            <span class="markConfig" id="mark_tools-siliconcompiler-server_password"></span>
                        </div>
                            <input class="setting-input-box" id="tools-siliconcompiler-server_password" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-spyglass">
                <div class="settings-group-title-label">
                    Tools: Spyglass
                </div>
                <div class="settings-group-description">Synopsys (formerly Atrenta) Spyglass Backend. Spyglass performs static source code analysis on HDL code and checks for common coding errors or coding style violations.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-spyglass-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-spyglass-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Methodology
                            <span class="markConfig" id="mark_tools-spyglass-methodology"></span>
                        </div>
                            <input class="setting-input-box" id="tools-spyglass-methodology" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Goals
                            <span class="markConfig" id="mark_tools-spyglass-goals"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-spyglass-goals">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Spyglass Options
                            <span class="markConfig" id="mark_tools-spyglass-spyglass_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-spyglass-spyglass_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Rule Parameters
                            <span class="markConfig" id="mark_tools-spyglass-rule_parameters"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-spyglass-rule_parameters">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-symbiyosys">
                <div class="settings-group-title-label">
                    Tools: SymbiYosys
                </div>
                <div class="settings-group-description">SymbiYosys formal verification wrapper for Yosys.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-symbiyosys-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-symbiyosys-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            A list of the .sby file’s tasks to run. Passed on the sby command line..
                            <span class="markConfig" id="mark_tools-symbiyosys-tasknames"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-symbiyosys-tasknames">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-symbiflow">
                <div class="settings-group-title-label">
                    Tools: Symbiflow
                </div>
                <div class="settings-group-description">VHDL Style Guide. Analyzes VHDL files for style guide violations.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-symbiflow-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-symbiflow-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA chip package (e.g. clg400-1).
                            <span class="markConfig" id="mark_tools-symbiflow-package"></span>
                        </div>
                            <input class="setting-input-box" id="tools-symbiflow-package" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA part type (e.g. xc7a50t).
                            <span class="markConfig" id="mark_tools-symbiflow-part"></span>
                        </div>
                            <input class="setting-input-box" id="tools-symbiflow-part" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Target architecture. Currently only “xilinx” is supported.
                            <span class="markConfig" id="mark_tools-symbiflow-vendor"></span>
                        </div>
                            <input class="setting-input-box" id="tools-symbiflow-vendor" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Place and Route tool. Currently only “vpr” is supported.
                            <span class="markConfig" id="mark_tools-symbiflow-pnr"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-symbiflow-pnr">
                                      <option value='vpr'>VPR</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional vpr tool options. If not used, default options for the tool will be used.
                            <span class="markConfig" id="mark_tools-symbiflow-vpr_options"></span>
                        </div>
                            <input class="setting-input-box" id="tools-symbiflow-vpr_options" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Optional bash script that will be sourced before each build step..
                            <span class="markConfig" id="mark_tools-symbiflow-environment_script"></span>
                        </div>
                            <input class="setting-input-box" id="tools-symbiflow-environment_script" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-trellis">
                <div class="settings-group-title-label">
                    Tools: Trellis
                </div>
                <div class="settings-group-description">Project Trellis enables a fully open-source flow for ECP5 FPGAs using Yosys for Verilog synthesis and nextpnr for place and route.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-trellis-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-trellis-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Target architecture.
                            <span class="markConfig" id="mark_tools-trellis-arch"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-trellis-arch">
                                      <option value='xilinx'>Xilinx</option>
                                      <option value='ice40'>ICE40</option>
                                      <option value='ecp5'>ECP5</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Output file format.
                            <span class="markConfig" id="mark_tools-trellis-output_format"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-trellis-output_format">
                                      <option value='json'>JSON</option>
                                      <option value='edif'>EDIF</option>
                                      <option value='blif'>BLIF</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-trellis-yosys_as_subtool">
                            <label class="setting-checkbox-label" for="tools-trellis-yosys_as_subtool">
                                Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.
                                <span class="markConfig" id="mark_tools-trellis-yosys_as_subtool"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Generated makefile name, defaults to $name.mk
                            <span class="markConfig" id="mark_tools-trellis-makefile_name"></span>
                        </div>
                            <input class="setting-input-box" id="tools-trellis-makefile_name" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Generated tcl script filename, defaults to $name.mk
                            <span class="markConfig" id="mark_tools-trellis-script_name"></span>
                        </div>
                            <input class="setting-input-box" id="tools-trellis-script_name" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for NextPNR Place & Route.
                            <span class="markConfig" id="mark_tools-trellis-nextpnr_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-trellis-nextpnr_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for the synth_ice40 command.
                            <span class="markConfig" id="mark_tools-trellis-yosys_synth_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-trellis-yosys_synth_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-vcs">
                <div class="settings-group-title-label">
                    Tools: VCS
                </div>
                <div class="settings-group-description">Synopsys VCS Backend</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-vcs-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vcs-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Compile time options passed to vcs
                            <span class="markConfig" id="mark_tools-vcs-vcs_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-vcs-vcs_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Runtime options passed to the simulation
                            <span class="markConfig" id="mark_tools-vcs-run_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-vcs-run_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-verible">
                <div class="settings-group-title-label">
                    Tools: Verible
                </div>
                <div class="settings-group-description">Verible.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-verible-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-verible-installation_path" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-verilator">
                <div class="settings-group-title-label">
                    Tools: Verilator
                </div>
                <div class="settings-group-description">Verilator is the fastest free Verilog HDL simulator, and beats many commercial simulators.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-verilator-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-verilator-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Select compilation mode. Legal values are cc for C++ testbenches, sc for SystemC testbenches or lint-only to only perform linting on the Verilog code.
                            <span class="markConfig" id="mark_tools-verilator-mode"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-verilator-mode">
                                      <option value='cc'>cc</option>
                                      <option value='sc'>sc</option>
                                      <option value='lint-only'>lint-only</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Extra libraries for the verilated model to link against.
                            <span class="markConfig" id="mark_tools-verilator-libs"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-verilator-libs">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for verilator.
                            <span class="markConfig" id="mark_tools-verilator-verilator_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-verilator-verilator_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional arguments passed to make when compiling the simulation. This is commonly used to set OPT/OPT_FAST/OPT_SLOW.
                            <span class="markConfig" id="mark_tools-verilator-make_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-verilator-make_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional arguments directly passed to the verilated model.
                            <span class="markConfig" id="mark_tools-verilator-run_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-verilator-run_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-vivado">
                <div class="settings-group-title-label">
                    Tools: Vivado
                </div>
                <div class="settings-group-description">The Vivado backend executes Xilinx Vivado to build systems and program the FPGA.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-vivado-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vivado-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Part. Device identifier. e.g. xc7a35tcsg324-1.
                            <span class="markConfig" id="mark_tools-vivado-part"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vivado-part" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Synthesis tool. Allowed values are vivado (default) and yosys..
                            <span class="markConfig" id="mark_tools-vivado-synth"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-vivado-synth">
                                      <option value='vivado'>Vivado</option>
                                      <option value='yosys'>Yosys</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Choose only synthesis or place and route and bitstream generation:
                            <span class="markConfig" id="mark_tools-vivado-pnr"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-vivado-pnr">
                                      <option value='vivado'>Place and route</option>
                                      <option value='none'>Only synthesis</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            The frequency for jtag communication.
                            <span class="markConfig" id="mark_tools-vivado-jtag_freq"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="tools-vivado-jtag_freq">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Board identifier (e.g. */xilinx_tcf/Digilent/123456789123A.
                            <span class="markConfig" id="mark_tools-vivado-hw_target"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vivado-hw_target" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-vunit">
                <div class="settings-group-title-label">
                    Tools: VUnit
                </div>
                <div class="settings-group-description">VUnit testing framework.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-vunit-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vunit-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VUnit simulator:
                            <span class="markConfig" id="mark_tools-vunit-simulator_name"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-vunit-simulator_name">
                                      <option value='rivierapro'>Aldec Riviera-PRO</option>
                                      <option value='activehdl'>Aldec Active-HDL</option>
                                      <option value='ghdl'>GHDL</option>
                                      <option value='modelsim'>Mentor Graphics ModelSim/Questa</option>
                                      <option value='xsim'>XSIM (Not supported in official VUnit)</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            runpy mode:
                            <span class="markConfig" id="mark_tools-vunit-runpy_mode"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-vunit-runpy_mode">
                                      <option value='standalone'>Standalone</option>
                                      <option value='creation'>Creation</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VUnit options. Extra options for the VUnit test runner.
                            <span class="markConfig" id="mark_tools-vunit-extra_options"></span>
                        </div>
                            <input class="setting-input-box" id="tools-vunit-extra_options" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-vunit-enable_array_util_lib">
                            <label class="setting-checkbox-label" for="tools-vunit-enable_array_util_lib">
                                Enable array util library in non standalone mode.
                                <span class="markConfig" id="mark_tools-vunit-enable_array_util_lib"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-vunit-enable_com_lib">
                            <label class="setting-checkbox-label" for="tools-vunit-enable_com_lib">
                                Enable com library in non standalone mode.
                                <span class="markConfig" id="mark_tools-vunit-enable_com_lib"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-vunit-enable_json4vhdl_lib">
                            <label class="setting-checkbox-label" for="tools-vunit-enable_json4vhdl_lib">
                                Enable json4vhdl library in non standalone mode.
                                <span class="markConfig" id="mark_tools-vunit-enable_json4vhdl_lib"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-vunit-enable_osvvm_lib">
                            <label class="setting-checkbox-label" for="tools-vunit-enable_osvvm_lib">
                                Enable OSVVM library in non standalone mode.
                                <span class="markConfig" id="mark_tools-vunit-enable_osvvm_lib"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-vunit-enable_random_lib">
                            <label class="setting-checkbox-label" for="tools-vunit-enable_random_lib">
                                Enable random library in non standalone mode.
                                <span class="markConfig" id="mark_tools-vunit-enable_random_lib"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-vunit-enable_verification_components_lib">
                            <label class="setting-checkbox-label" for="tools-vunit-enable_verification_components_lib">
                                Enable verification components library in non standalone mode.
                                <span class="markConfig" id="mark_tools-vunit-enable_verification_components_lib"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-xcelium">
                <div class="settings-group-title-label">
                    Tools: Xcelium
                </div>
                <div class="settings-group-description">Xcelium simulator from Cadence Design Systems.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-xcelium-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-xcelium-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for compilation with xmvhdl.
                            <span class="markConfig" id="mark_tools-xcelium-xmvhdl_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-xcelium-xmvhdl_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for compilation with xmvlog.
                            <span class="markConfig" id="mark_tools-xcelium-xmvlog_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-xcelium-xmvlog_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional run options for xmsim.
                            <span class="markConfig" id="mark_tools-xcelium-xmsim_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-xcelium-xmsim_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional run options for xrun.
                            <span class="markConfig" id="mark_tools-xcelium-xrun_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-xcelium-xrun_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-xsim">
                <div class="settings-group-title-label">
                    Tools: XSIM
                </div>
                <div class="settings-group-description">XSim simulator from the Xilinx Vivado suite.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-xsim-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-xsim-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional options for compilation with xelab.
                            <span class="markConfig" id="mark_tools-xsim-xelab_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-xsim-xelab_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional run options for XSim.
                            <span class="markConfig" id="mark_tools-xsim-xsim_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-xsim-xsim_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-yosys">
                <div class="settings-group-title-label">
                    Tools: Yosys
                </div>
                <div class="settings-group-description">Open source synthesis tool targeting many different FPGAs.</div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Basic Yosys Configuration</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-yosys-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-installation_path" value="">
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">File Settings</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for read_verilog command:
                            <span class="markConfig" id="mark_tools-yosys-read_verilog_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-read_verilog_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for read_verilog -sv command (SystemVerilog files):
                            <span class="markConfig" id="mark_tools-yosys-read_systemverilog_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-read_systemverilog_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for read_liberty command (technology library files):
                            <span class="markConfig" id="mark_tools-yosys-read_liberty_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-read_liberty_options">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Hierarchy Settings</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for hierarchy command:
                            <span class="markConfig" id="mark_tools-yosys-hierarchy_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-hierarchy_options">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Elaborate: Optimizations</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for proc command (process conversion):
                            <span class="markConfig" id="mark_tools-yosys-proc_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-proc_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for opt command (optimization):
                            <span class="markConfig" id="mark_tools-yosys-opt_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-opt_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-flatten_enabled">
                            <label class="setting-checkbox-label" for="tools-yosys-flatten_enabled">
                                Enable flatten command during elaboration:
                                <span class="markConfig" id="mark_tools-yosys-flatten_enabled"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for flatten command:
                            <span class="markConfig" id="mark_tools-yosys-flatten_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-flatten_options">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Elaborate: Memory and FSM Settings</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for memory command:
                            <span class="markConfig" id="mark_tools-yosys-memory_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-memory_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-fsm_enabled">
                            <label class="setting-checkbox-label" for="tools-yosys-fsm_enabled">
                                Enable FSM extraction and optimization:
                                <span class="markConfig" id="mark_tools-yosys-fsm_enabled"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for fsm command:
                            <span class="markConfig" id="mark_tools-yosys-fsm_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-fsm_options">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Elaborate: Technology Mapping</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-techmap_enabled">
                            <label class="setting-checkbox-label" for="tools-yosys-techmap_enabled">
                                Enable technology mapping:
                                <span class="markConfig" id="mark_tools-yosys-techmap_enabled"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for techmap command:
                            <span class="markConfig" id="mark_tools-yosys-techmap_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-techmap_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-abc_enabled">
                            <label class="setting-checkbox-label" for="tools-yosys-abc_enabled">
                                Enable ABC optimization:
                                <span class="markConfig" id="mark_tools-yosys-abc_enabled"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for abc command:
                            <span class="markConfig" id="mark_tools-yosys-abc_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-abc_options">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Synthesis: General</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Synthesis target FPGA:
                            <span class="markConfig" id="mark_tools-yosys-synthesis_target"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-yosys-synthesis_target">
                                      <option value='ice40'>iCE40 (Lattice)</option>
                                      <option value='ecp5'>ECP5 (Lattice)</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Synthesis: iCE40</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            iCE40 device type:
                            <span class="markConfig" id="mark_tools-yosys-ice40_device"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-yosys-ice40_device">
                                      <option value='hx'>HX series</option>
                                      <option value='lp'>LP series</option>
                                      <option value='u'>Ultra series</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Top module (leave empty to auto-detect):
                            <span class="markConfig" id="mark_tools-yosys-ice40_top_module"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-ice40_top_module" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Output BLIF file path (leave empty to skip):
                            <span class="markConfig" id="mark_tools-yosys-ice40_output_blif"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-ice40_output_blif" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Output EDIF file path (leave empty to skip):
                            <span class="markConfig" id="mark_tools-yosys-ice40_output_edif"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-ice40_output_edif" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Output JSON file path (leave empty to skip):
                            <span class="markConfig" id="mark_tools-yosys-ice40_output_json"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-ice40_output_json" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_noflatten">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_noflatten">
                                Do not flatten design before synthesis:
                                <span class="markConfig" id="mark_tools-yosys-ice40_noflatten"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_dff">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_dff">
                                Run ABC with -dff option:
                                <span class="markConfig" id="mark_tools-yosys-ice40_dff"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_retime">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_retime">
                                Run ABC with retiming (-dff -D 1):
                                <span class="markConfig" id="mark_tools-yosys-ice40_retime"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_nocarry">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_nocarry">
                                Do not use SB_CARRY cells:
                                <span class="markConfig" id="mark_tools-yosys-ice40_nocarry"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_nodffe">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_nodffe">
                                Do not use SB_DFFE* cells:
                                <span class="markConfig" id="mark_tools-yosys-ice40_nodffe"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Min CE use for SB_DFFE* cells (0 = disabled):
                            <span class="markConfig" id="mark_tools-yosys-ice40_dffe_min_ce_use"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="tools-yosys-ice40_dffe_min_ce_use">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_nobram">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_nobram">
                                Do not use SB_RAM40_4K* cells:
                                <span class="markConfig" id="mark_tools-yosys-ice40_nobram"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_spram">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_spram">
                                Enable automatic inference of SB_SPRAM256KA:
                                <span class="markConfig" id="mark_tools-yosys-ice40_spram"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_dsp">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_dsp">
                                Use iCE40 UltraPlus DSP cells:
                                <span class="markConfig" id="mark_tools-yosys-ice40_dsp"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_noabc">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_noabc">
                                Use built-in Yosys LUT techmapping instead of ABC:
                                <span class="markConfig" id="mark_tools-yosys-ice40_noabc"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_abc2">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_abc2">
                                Run two passes of ABC:
                                <span class="markConfig" id="mark_tools-yosys-ice40_abc2"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_vpr">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_vpr">
                                Generate VPR-suitable output (experimental):
                                <span class="markConfig" id="mark_tools-yosys-ice40_vpr"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_noabc9">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_noabc9">
                                Disable use of new ABC9 flow:
                                <span class="markConfig" id="mark_tools-yosys-ice40_noabc9"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_flowmap">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_flowmap">
                                Use FlowMap LUT techmapping (experimental):
                                <span class="markConfig" id="mark_tools-yosys-ice40_flowmap"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ice40_no_rw_check">
                            <label class="setting-checkbox-label" for="tools-yosys-ice40_no_rw_check">
                                Mark all read ports as return don't-care on collision:
                                <span class="markConfig" id="mark_tools-yosys-ice40_no_rw_check"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Synthesis: ECP5</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Top module (leave empty to auto-detect):
                            <span class="markConfig" id="mark_tools-yosys-ecp5_top_module"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-ecp5_top_module" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Output BLIF file path (leave empty to skip):
                            <span class="markConfig" id="mark_tools-yosys-ecp5_output_blif"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-ecp5_output_blif" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Output EDIF file path (leave empty to skip):
                            <span class="markConfig" id="mark_tools-yosys-ecp5_output_edif"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-ecp5_output_edif" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Output JSON file path (leave empty to skip):
                            <span class="markConfig" id="mark_tools-yosys-ecp5_output_json"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-ecp5_output_json" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_noflatten">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_noflatten">
                                Do not flatten design before synthesis:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_noflatten"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_dff">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_dff">
                                Run ABC with -dff option:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_dff"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_retime">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_retime">
                                Run ABC with retiming (-dff -D 1):
                                <span class="markConfig" id="mark_tools-yosys-ecp5_retime"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_noccu2">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_noccu2">
                                Do not use CCU2 cells:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_noccu2"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_nodffe">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_nodffe">
                                Do not use flipflops with CE:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_nodffe"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_nobram">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_nobram">
                                Do not use block RAM cells:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_nobram"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_nolutram">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_nolutram">
                                Do not use LUT RAM cells:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_nolutram"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_nowidelut">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_nowidelut">
                                Do not use PFU muxes for LUTs larger than LUT4s:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_nowidelut"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_asyncprld">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_asyncprld">
                                Use async PRLD mode (experimental):
                                <span class="markConfig" id="mark_tools-yosys-ecp5_asyncprld"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_abc2">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_abc2">
                                Run two passes of ABC:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_abc2"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_noabc9">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_noabc9">
                                Disable use of new ABC9 flow:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_noabc9"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_vpr">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_vpr">
                                Generate VPR-suitable output (experimental):
                                <span class="markConfig" id="mark_tools-yosys-ecp5_vpr"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_iopad">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_iopad">
                                Insert IO buffers:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_iopad"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_nodsp">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_nodsp">
                                Do not map multipliers to MULT18X18D:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_nodsp"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-ecp5_no_rw_check">
                            <label class="setting-checkbox-label" for="tools-yosys-ecp5_no_rw_check">
                                Mark all read ports as return don't-care on collision:
                                <span class="markConfig" id="mark_tools-yosys-ecp5_no_rw_check"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Debug and Logging</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-verbose">
                            <label class="setting-checkbox-label" for="tools-yosys-verbose">
                                Enable verbose output:
                                <span class="markConfig" id="mark_tools-yosys-verbose"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Debug level:
                            <span class="markConfig" id="mark_tools-yosys-debug_level"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-yosys-debug_level">
                                      <option value='none'>No debug</option>
                                      <option value='basic'>Basic debug</option>
                                      <option value='detailed'>Detailed debug</option>
                                      <option value='verbose'>Verbose debug</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Log file path (leave empty for stdout):
                            <span class="markConfig" id="mark_tools-yosys-log_file"></span>
                        </div>
                            <input class="setting-input-box" id="tools-yosys-log_file" value="">
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Legacy Configuration</div>
                    <hr class="setting-divider">
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Custom Commands</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Custom commands to run after loading files:
                            <span class="markConfig" id="mark_tools-yosys-custom_load_commands"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-custom_load_commands">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Custom commands to run during analysis:
                            <span class="markConfig" id="mark_tools-yosys-custom_analyze_commands"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-custom_analyze_commands">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Custom commands to run during elaboration:
                            <span class="markConfig" id="mark_tools-yosys-custom_elaborate_commands"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-custom_elaborate_commands">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Additional custom flags for Yosys commands:
                            <span class="markConfig" id="mark_tools-yosys-extra_flags"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-extra_flags">
                    </div>
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Advanced Settings</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-check_enabled">
                            <label class="setting-checkbox-label" for="tools-yosys-check_enabled">
                                Enable design rule checks:
                                <span class="markConfig" id="mark_tools-yosys-check_enabled"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for check command:
                            <span class="markConfig" id="mark_tools-yosys-check_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-check_options">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-yosys-stat_enabled">
                            <label class="setting-checkbox-label" for="tools-yosys-stat_enabled">
                                Enable statistics reporting:
                                <span class="markConfig" id="mark_tools-yosys-stat_enabled"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Options for stat command:
                            <span class="markConfig" id="mark_tools-yosys-stat_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-yosys-stat_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-openfpga">
                <div class="settings-group-title-label">
                    Tools: OpenFPGA
                </div>
                <div class="settings-group-description">The award-winning OpenFPGA framework is the first open-source FPGA IP generator with silicon proofs supporting highly-customizable FPGA architectures.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-openfpga-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-openfpga-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FPGA architecture e.g. sofa-hd, sofa-chd, sofa-qlhd and sofa-plus-hd
                            <span class="markConfig" id="mark_tools-openfpga-arch"></span>
                        </div>
                            <input class="setting-input-box" id="tools-openfpga-arch" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Extra options for running the task simulation with OpenFPGA framework (see the OpenFPGA documentation).
                            <span class="markConfig" id="mark_tools-openfpga-task_options"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-openfpga-task_options">
                    </div>
                  
                  
            </div>
            <div class="settings-section" id="tools-activehdl">
                <div class="settings-group-title-label">
                    Tools: Active-HDL
                </div>
                <div class="settings-group-description">Active-HDL™ is a Windows based, integrated FPGA Design Creation and Simulation solution for team-based environments.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-activehdl-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-activehdl-installation_path" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-questa">
                <div class="settings-group-title-label">
                    Tools: Questa Advanced Simulator
                </div>
                <div class="settings-group-description">The Questa advanced simulator is the core simulation and debug engine of the Questa verification solution.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-questa-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-questa-installation_path" value="">
                    </div>
                  
                  
                  
            </div>
            <div class="settings-section" id="tools-raptor">
                <div class="settings-group-title-label">
                    Tools: Raptor Design Suite
                </div>
                <div class="settings-group-description">Raptor Design Suite.</div>
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Installation path:
                            <span class="markConfig" id="mark_tools-raptor-installation_path"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-installation_path" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Target device
                            <span class="markConfig" id="mark_tools-raptor-target_device"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-target_device" value="1GE100">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            VHDL version
                            <span class="markConfig" id="mark_tools-raptor-vhdl_version"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-vhdl_version">
                                      <option value='VHDL_1987'>1987</option>
                                      <option value='VHDL_1993'>1993</option>
                                      <option value='VHDL_2000'>2000</option>
                                      <option value='VHDL_2008'>2008</option>
                                      <option value='VHDL_2019'>2019</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Verilog version
                            <span class="markConfig" id="mark_tools-raptor-verilog_version"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-verilog_version">
                                      <option value='V_1995'>1995</option>
                                      <option value='V_2001'>2001</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            SV version
                            <span class="markConfig" id="mark_tools-raptor-sv_version"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-sv_version">
                                      <option value='SV_2005'>2005</option>
                                      <option value='SV_2009'>2009</option>
                                      <option value='SV_2012'>2012</option>
                                      <option value='SV_2017'>2017</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Synthesis</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Optimization
                            <span class="markConfig" id="mark_tools-raptor-optimization"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-optimization">
                                      <option value='area'>Area</option>
                                      <option value='delay'>Delay</option>
                                      <option value='mixed'>Mixed</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Effort
                            <span class="markConfig" id="mark_tools-raptor-effort"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-effort">
                                      <option value='high'>High</option>
                                      <option value='medium'>Medium</option>
                                      <option value='low'>Low</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            FSM encoding
                            <span class="markConfig" id="mark_tools-raptor-fsm_encoding"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-fsm_encoding">
                                      <option value='binary'>Binary</option>
                                      <option value='onehot'>One Hot</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Carry
                            <span class="markConfig" id="mark_tools-raptor-carry"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-carry">
                                      <option value='auto'>Auto</option>
                                      <option value='all'>All</option>
                                      <option value='none'>None</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Pnr netlist language
                            <span class="markConfig" id="mark_tools-raptor-pnr_netlist_language"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-pnr_netlist_language">
                                      <option value='blif'>Blif</option>
                                      <option value='edif'>edif</option>
                                      <option value='verilog'>Verilog</option>
                                      <option value='vhdl'>VHDL</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            DSP limit
                            <span class="markConfig" id="mark_tools-raptor-dsp_limit"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="tools-raptor-dsp_limit">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Block RAM limit
                            <span class="markConfig" id="mark_tools-raptor-block_ram_limit"></span>
                        </div>
                        <input type="number" class="setting-number-input" id="tools-raptor-block_ram_limit">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-raptor-fast_synthesis">
                            <label class="setting-checkbox-label" for="tools-raptor-fast_synthesis">
                                Fast Synthesis
                                <span class="markConfig" id="mark_tools-raptor-fast_synthesis"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <hr class="setting-divider">
                    <div class="setting-divider-title">Simulation</div>
                    <hr class="setting-divider">
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Simulation top level path:
                            <span class="markConfig" id="mark_tools-raptor-top_level"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-top_level" value="">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Other simulation sources (comma separed):
                            <span class="markConfig" id="mark_tools-raptor-sim_source_list"></span>
                        </div>
                        <div class="setting-item-description">Comma separated values</div>
                        <input class="setting-input-box" id="tools-raptor-sim_source_list">
                    </div>
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-raptor-simulate_rtl">
                            <label class="setting-checkbox-label" for="tools-raptor-simulate_rtl">
                                Simulate RTL
                                <span class="markConfig" id="mark_tools-raptor-simulate_rtl"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            RTL waveform simulation
                            <span class="markConfig" id="mark_tools-raptor-waveform_rtl"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-waveform_rtl" value="syn_tb_rtl.fst">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            RTL Simulator
                            <span class="markConfig" id="mark_tools-raptor-simulator_rtl"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-simulator_rtl">
                                      <option value='verilator'>Verilator</option>
                                      <option value='ghdl'>GHDL</option>
                                      <option value='icarus'>Icarus</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Simulation options
                            <span class="markConfig" id="mark_tools-raptor-simulation_options_rtl"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-simulation_options_rtl" value="--stop-time=1000ns">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-raptor-simulate_gate">
                            <label class="setting-checkbox-label" for="tools-raptor-simulate_gate">
                                Simulate Gate
                                <span class="markConfig" id="mark_tools-raptor-simulate_gate"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Gate waveform simulation
                            <span class="markConfig" id="mark_tools-raptor-waveform_gate"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-waveform_gate" value="syn_tb_gate.fst">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Gate Simulator
                            <span class="markConfig" id="mark_tools-raptor-simulator_gate"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-simulator_gate">
                                      <option value='verilator'>Verilator</option>
                                      <option value='ghdl'>GHDL</option>
                                      <option value='icarus'>Icarus</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Simulation options
                            <span class="markConfig" id="mark_tools-raptor-simulation_options_gate"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-simulation_options_gate" value="--stop-time=1000ns">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-checkbox">
                            <input type="checkbox" id="tools-raptor-simulate_pnr">
                            <label class="setting-checkbox-label" for="tools-raptor-simulate_pnr">
                                Simulate PNR
                                <span class="markConfig" id="mark_tools-raptor-simulate_pnr"></span>
                            </label>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            PNR waveform simulation
                            <span class="markConfig" id="mark_tools-raptor-waveform_pnr"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-waveform_pnr" value="sim_pnr.fst">
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            PNR Simulator
                            <span class="markConfig" id="mark_tools-raptor-simulator_pnr"></span>
                        </div>
                        <div class="select-container">
                            <select class="setting-select-box" id="tools-raptor-simulator_pnr">
                                      <option value='verilator'>Verilator</option>
                                      <option value='ghdl'>GHDL</option>
                                      <option value='icarus'>Icarus</option>
                            </select>
                        </div>
                    </div>
                  
                  
                    <div class="setting-item">
                        <div class="setting-item-label">
                            Simulation options
                            <span class="markConfig" id="mark_tools-raptor-simulation_options_pnr"></span>
                        </div>
                            <input class="setting-input-box" id="tools-raptor-simulation_options_pnr" value="--stop-time=1000ns">
                    </div>
                  
                  
                  
            </div>

<div class="settings-buttons">
    <button type="button" class="setting-button danger" onclick="close_panel(event)">
        <i class="codicon codicon-close"></i>
        Close
    </button>
    <button type="button" class="setting-button secondary" onclick="send_config(event)">
        <i class="codicon codicon-check"></i>
        Apply
    </button>
    <button type="button" class="setting-button primary" onclick="send_config_and_close(event)">
        <i class="codicon codicon-check-all"></i>
        Apply and Close
    </button>
</div>
            </div>
        </div>
    </div>

<script>
  // VSCode Settings Style JavaScript
  
  function enable_tab(tp0, tp1){
    // Hide all sections
    document.getElementById("general-general").classList.remove('active');
    document.getElementById("documentation-general").classList.remove('active');
    document.getElementById("editor-general").classList.remove('active');
    document.getElementById("formatter-general").classList.remove('active');
    document.getElementById("formatter-istyle").classList.remove('active');
    document.getElementById("formatter-s3sv").classList.remove('active');
    document.getElementById("formatter-verible").classList.remove('active');
    document.getElementById("formatter-standalone").classList.remove('active');
    document.getElementById("formatter-vsg").classList.remove('active');
    document.getElementById("linter-general").classList.remove('active');
    document.getElementById("linter-vhdlls").classList.remove('active');
    document.getElementById("linter-ghdl").classList.remove('active');
    document.getElementById("linter-icarus").classList.remove('active');
    document.getElementById("linter-modelsim").classList.remove('active');
    document.getElementById("linter-verible").classList.remove('active');
    document.getElementById("linter-verilator").classList.remove('active');
    document.getElementById("linter-vivado").classList.remove('active');
    document.getElementById("linter-vsg").classList.remove('active');
    document.getElementById("schematic-general").classList.remove('active');
    document.getElementById("templates-general").classList.remove('active');
    document.getElementById("tools-general").classList.remove('active');
    document.getElementById("tools-quartus").classList.remove('active');
    document.getElementById("tools-vsg").classList.remove('active');
    document.getElementById("tools-osvvm").classList.remove('active');
    document.getElementById("tools-ascenlint").classList.remove('active');
    document.getElementById("tools-cocotb").classList.remove('active');
    document.getElementById("tools-diamond").classList.remove('active');
    document.getElementById("tools-ghdl").classList.remove('active');
    document.getElementById("tools-icarus").classList.remove('active');
    document.getElementById("tools-icestorm").classList.remove('active');
    document.getElementById("tools-ise").classList.remove('active');
    document.getElementById("tools-isem").classList.remove('active');
    document.getElementById("tools-modelsim").classList.remove('active');
    document.getElementById("tools-morty").classList.remove('active');
    document.getElementById("tools-radiant").classList.remove('active');
    document.getElementById("tools-rivierapro").classList.remove('active');
    document.getElementById("tools-siliconcompiler").classList.remove('active');
    document.getElementById("tools-spyglass").classList.remove('active');
    document.getElementById("tools-symbiyosys").classList.remove('active');
    document.getElementById("tools-symbiflow").classList.remove('active');
    document.getElementById("tools-trellis").classList.remove('active');
    document.getElementById("tools-vcs").classList.remove('active');
    document.getElementById("tools-verible").classList.remove('active');
    document.getElementById("tools-verilator").classList.remove('active');
    document.getElementById("tools-vivado").classList.remove('active');
    document.getElementById("tools-vunit").classList.remove('active');
    document.getElementById("tools-xcelium").classList.remove('active');
    document.getElementById("tools-xsim").classList.remove('active');
    document.getElementById("tools-yosys").classList.remove('active');
    document.getElementById("tools-openfpga").classList.remove('active');
    document.getElementById("tools-activehdl").classList.remove('active');
    document.getElementById("tools-questa").classList.remove('active');
    document.getElementById("tools-raptor").classList.remove('active');
    
    // Show the selected section
    document.getElementById(tp0 + "-" + tp1).classList.add('active');
    
    // Update sidebar selection
    updateSidebarSelection(tp0, tp1);
  }

  function updateSidebarSelection(tp0, tp1) {
    // Remove all selections
    document.getElementById("btn-general-general").classList.remove('selected');
    document.getElementById("btn-documentation-general").classList.remove('selected');
    document.getElementById("btn-editor-general").classList.remove('selected');
    document.getElementById("btn-formatter-general").classList.remove('selected');
    if (document.getElementById("btn-formatter-istyle")) {
        document.getElementById("btn-formatter-istyle").classList.remove('selected');
    }
    if (document.getElementById("btn-formatter-s3sv")) {
        document.getElementById("btn-formatter-s3sv").classList.remove('selected');
    }
    if (document.getElementById("btn-formatter-verible")) {
        document.getElementById("btn-formatter-verible").classList.remove('selected');
    }
    if (document.getElementById("btn-formatter-standalone")) {
        document.getElementById("btn-formatter-standalone").classList.remove('selected');
    }
    if (document.getElementById("btn-formatter-vsg")) {
        document.getElementById("btn-formatter-vsg").classList.remove('selected');
    }
    document.getElementById("btn-linter-general").classList.remove('selected');
    if (document.getElementById("btn-linter-vhdlls")) {
        document.getElementById("btn-linter-vhdlls").classList.remove('selected');
    }
    if (document.getElementById("btn-linter-ghdl")) {
        document.getElementById("btn-linter-ghdl").classList.remove('selected');
    }
    if (document.getElementById("btn-linter-icarus")) {
        document.getElementById("btn-linter-icarus").classList.remove('selected');
    }
    if (document.getElementById("btn-linter-modelsim")) {
        document.getElementById("btn-linter-modelsim").classList.remove('selected');
    }
    if (document.getElementById("btn-linter-verible")) {
        document.getElementById("btn-linter-verible").classList.remove('selected');
    }
    if (document.getElementById("btn-linter-verilator")) {
        document.getElementById("btn-linter-verilator").classList.remove('selected');
    }
    if (document.getElementById("btn-linter-vivado")) {
        document.getElementById("btn-linter-vivado").classList.remove('selected');
    }
    if (document.getElementById("btn-linter-vsg")) {
        document.getElementById("btn-linter-vsg").classList.remove('selected');
    }
    document.getElementById("btn-schematic-general").classList.remove('selected');
    document.getElementById("btn-templates-general").classList.remove('selected');
    document.getElementById("btn-tools-general").classList.remove('selected');
    if (document.getElementById("btn-tools-quartus")) {
        document.getElementById("btn-tools-quartus").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-vsg")) {
        document.getElementById("btn-tools-vsg").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-osvvm")) {
        document.getElementById("btn-tools-osvvm").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-ascenlint")) {
        document.getElementById("btn-tools-ascenlint").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-cocotb")) {
        document.getElementById("btn-tools-cocotb").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-diamond")) {
        document.getElementById("btn-tools-diamond").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-ghdl")) {
        document.getElementById("btn-tools-ghdl").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-icarus")) {
        document.getElementById("btn-tools-icarus").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-icestorm")) {
        document.getElementById("btn-tools-icestorm").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-ise")) {
        document.getElementById("btn-tools-ise").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-isem")) {
        document.getElementById("btn-tools-isem").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-modelsim")) {
        document.getElementById("btn-tools-modelsim").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-morty")) {
        document.getElementById("btn-tools-morty").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-radiant")) {
        document.getElementById("btn-tools-radiant").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-rivierapro")) {
        document.getElementById("btn-tools-rivierapro").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-siliconcompiler")) {
        document.getElementById("btn-tools-siliconcompiler").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-spyglass")) {
        document.getElementById("btn-tools-spyglass").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-symbiyosys")) {
        document.getElementById("btn-tools-symbiyosys").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-symbiflow")) {
        document.getElementById("btn-tools-symbiflow").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-trellis")) {
        document.getElementById("btn-tools-trellis").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-vcs")) {
        document.getElementById("btn-tools-vcs").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-verible")) {
        document.getElementById("btn-tools-verible").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-verilator")) {
        document.getElementById("btn-tools-verilator").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-vivado")) {
        document.getElementById("btn-tools-vivado").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-vunit")) {
        document.getElementById("btn-tools-vunit").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-xcelium")) {
        document.getElementById("btn-tools-xcelium").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-xsim")) {
        document.getElementById("btn-tools-xsim").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-yosys")) {
        document.getElementById("btn-tools-yosys").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-openfpga")) {
        document.getElementById("btn-tools-openfpga").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-activehdl")) {
        document.getElementById("btn-tools-activehdl").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-questa")) {
        document.getElementById("btn-tools-questa").classList.remove('selected');
    }
    if (document.getElementById("btn-tools-raptor")) {
        document.getElementById("btn-tools-raptor").classList.remove('selected');
    }
    
    // Add selection to current item
    if (tp1 === "general") {
        document.getElementById("btn-" + tp0 + "-general").classList.add('selected');
    } else {
        document.getElementById("btn-" + tp0 + "-" + tp1).classList.add('selected');
    }
  }

  function toggleSidebarSection(tp0) {
    // Functionality disabled - sections should always remain open
    return;
  }

  // Initialize
  enable_tab('general', 'general');

  // Add event listeners for sidebar
  document.getElementById("btn-general-general").addEventListener("click", function(e) {
    e.preventDefault();
    enable_tab("general", "general");
  });
  document.getElementById("btn-documentation-general").addEventListener("click", function(e) {
    e.preventDefault();
    enable_tab("documentation", "general");
  });
  document.getElementById("btn-editor-general").addEventListener("click", function(e) {
    e.preventDefault();
    enable_tab("editor", "general");
  });
  document.getElementById("btn-formatter-general").addEventListener("click", function(e) {
    e.preventDefault();
    enable_tab("formatter", "general");
  });
  if (document.getElementById("btn-formatter-istyle")) {
    document.getElementById("btn-formatter-istyle").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("formatter", "istyle");
    });
  }
  if (document.getElementById("btn-formatter-s3sv")) {
    document.getElementById("btn-formatter-s3sv").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("formatter", "s3sv");
    });
  }
  if (document.getElementById("btn-formatter-verible")) {
    document.getElementById("btn-formatter-verible").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("formatter", "verible");
    });
  }
  if (document.getElementById("btn-formatter-standalone")) {
    document.getElementById("btn-formatter-standalone").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("formatter", "standalone");
    });
  }
  if (document.getElementById("btn-formatter-vsg")) {
    document.getElementById("btn-formatter-vsg").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("formatter", "vsg");
    });
  }
  document.getElementById("btn-linter-general").addEventListener("click", function(e) {
    e.preventDefault();
    enable_tab("linter", "general");
  });
  if (document.getElementById("btn-linter-vhdlls")) {
    document.getElementById("btn-linter-vhdlls").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("linter", "vhdlls");
    });
  }
  if (document.getElementById("btn-linter-ghdl")) {
    document.getElementById("btn-linter-ghdl").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("linter", "ghdl");
    });
  }
  if (document.getElementById("btn-linter-icarus")) {
    document.getElementById("btn-linter-icarus").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("linter", "icarus");
    });
  }
  if (document.getElementById("btn-linter-modelsim")) {
    document.getElementById("btn-linter-modelsim").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("linter", "modelsim");
    });
  }
  if (document.getElementById("btn-linter-verible")) {
    document.getElementById("btn-linter-verible").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("linter", "verible");
    });
  }
  if (document.getElementById("btn-linter-verilator")) {
    document.getElementById("btn-linter-verilator").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("linter", "verilator");
    });
  }
  if (document.getElementById("btn-linter-vivado")) {
    document.getElementById("btn-linter-vivado").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("linter", "vivado");
    });
  }
  if (document.getElementById("btn-linter-vsg")) {
    document.getElementById("btn-linter-vsg").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("linter", "vsg");
    });
  }
  document.getElementById("btn-schematic-general").addEventListener("click", function(e) {
    e.preventDefault();
    enable_tab("schematic", "general");
  });
  document.getElementById("btn-templates-general").addEventListener("click", function(e) {
    e.preventDefault();
    enable_tab("templates", "general");
  });
  document.getElementById("btn-tools-general").addEventListener("click", function(e) {
    e.preventDefault();
    enable_tab("tools", "general");
  });
  if (document.getElementById("btn-tools-quartus")) {
    document.getElementById("btn-tools-quartus").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "quartus");
    });
  }
  if (document.getElementById("btn-tools-vsg")) {
    document.getElementById("btn-tools-vsg").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "vsg");
    });
  }
  if (document.getElementById("btn-tools-osvvm")) {
    document.getElementById("btn-tools-osvvm").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "osvvm");
    });
  }
  if (document.getElementById("btn-tools-ascenlint")) {
    document.getElementById("btn-tools-ascenlint").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "ascenlint");
    });
  }
  if (document.getElementById("btn-tools-cocotb")) {
    document.getElementById("btn-tools-cocotb").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "cocotb");
    });
  }
  if (document.getElementById("btn-tools-diamond")) {
    document.getElementById("btn-tools-diamond").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "diamond");
    });
  }
  if (document.getElementById("btn-tools-ghdl")) {
    document.getElementById("btn-tools-ghdl").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "ghdl");
    });
  }
  if (document.getElementById("btn-tools-icarus")) {
    document.getElementById("btn-tools-icarus").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "icarus");
    });
  }
  if (document.getElementById("btn-tools-icestorm")) {
    document.getElementById("btn-tools-icestorm").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "icestorm");
    });
  }
  if (document.getElementById("btn-tools-ise")) {
    document.getElementById("btn-tools-ise").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "ise");
    });
  }
  if (document.getElementById("btn-tools-isem")) {
    document.getElementById("btn-tools-isem").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "isem");
    });
  }
  if (document.getElementById("btn-tools-modelsim")) {
    document.getElementById("btn-tools-modelsim").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "modelsim");
    });
  }
  if (document.getElementById("btn-tools-morty")) {
    document.getElementById("btn-tools-morty").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "morty");
    });
  }
  if (document.getElementById("btn-tools-radiant")) {
    document.getElementById("btn-tools-radiant").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "radiant");
    });
  }
  if (document.getElementById("btn-tools-rivierapro")) {
    document.getElementById("btn-tools-rivierapro").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "rivierapro");
    });
  }
  if (document.getElementById("btn-tools-siliconcompiler")) {
    document.getElementById("btn-tools-siliconcompiler").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "siliconcompiler");
    });
  }
  if (document.getElementById("btn-tools-spyglass")) {
    document.getElementById("btn-tools-spyglass").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "spyglass");
    });
  }
  if (document.getElementById("btn-tools-symbiyosys")) {
    document.getElementById("btn-tools-symbiyosys").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "symbiyosys");
    });
  }
  if (document.getElementById("btn-tools-symbiflow")) {
    document.getElementById("btn-tools-symbiflow").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "symbiflow");
    });
  }
  if (document.getElementById("btn-tools-trellis")) {
    document.getElementById("btn-tools-trellis").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "trellis");
    });
  }
  if (document.getElementById("btn-tools-vcs")) {
    document.getElementById("btn-tools-vcs").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "vcs");
    });
  }
  if (document.getElementById("btn-tools-verible")) {
    document.getElementById("btn-tools-verible").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "verible");
    });
  }
  if (document.getElementById("btn-tools-verilator")) {
    document.getElementById("btn-tools-verilator").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "verilator");
    });
  }
  if (document.getElementById("btn-tools-vivado")) {
    document.getElementById("btn-tools-vivado").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "vivado");
    });
  }
  if (document.getElementById("btn-tools-vunit")) {
    document.getElementById("btn-tools-vunit").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "vunit");
    });
  }
  if (document.getElementById("btn-tools-xcelium")) {
    document.getElementById("btn-tools-xcelium").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "xcelium");
    });
  }
  if (document.getElementById("btn-tools-xsim")) {
    document.getElementById("btn-tools-xsim").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "xsim");
    });
  }
  if (document.getElementById("btn-tools-yosys")) {
    document.getElementById("btn-tools-yosys").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "yosys");
    });
  }
  if (document.getElementById("btn-tools-openfpga")) {
    document.getElementById("btn-tools-openfpga").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "openfpga");
    });
  }
  if (document.getElementById("btn-tools-activehdl")) {
    document.getElementById("btn-tools-activehdl").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "activehdl");
    });
  }
  if (document.getElementById("btn-tools-questa")) {
    document.getElementById("btn-tools-questa").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "questa");
    });
  }
  if (document.getElementById("btn-tools-raptor")) {
    document.getElementById("btn-tools-raptor").addEventListener("click", function(e) {
      e.preventDefault();
      enable_tab("tools", "raptor");
    });
  }
  
  const vscode = acquireVsCodeApi();

  function send_config_and_close(){
    const config = get_config();

    vscode.postMessage({
        command: 'set_config_and_close',
        config : config
    });
  }

  function send_config(){
    const config = get_config();

    vscode.postMessage({
        command: 'set_config',
        config : config
    });
  }

  function close_panel(){
    vscode.postMessage({
        command: 'close'
    });
  }

  function export_config(){
    vscode.postMessage({
        command: 'export'
    });
  }

  function load_config(){
    vscode.postMessage({
        command: 'load'
    });
  }

  window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
          case 'set_config':
              set_config(message.config);
              set_mark(message.diff_config, message.projectName);
              document.getElementById("configTitle").innerHTML = message.title;
              const tool = message.tool;
              if (tool != undefined && tool != ""){
                enable_tab("tools", tool);
              }
              break;
      }
  });

  function get_config(){
    const config = {};
    let element_value;
    config["general"] = {}
    config["general"]["general"] = {}
    element_value = document.getElementById("general-general-pypath").value;
    config["general"]["general"]["pypath"] = element_value
    element_value = document.getElementById("general-general-makepath").value;
    config["general"]["general"]["makepath"] = element_value
    element_value = document.getElementById("general-general-go_to_definition_vhdl").checked;
    config["general"]["general"]["go_to_definition_vhdl"] = element_value
    element_value = document.getElementById("general-general-go_to_definition_verilog").checked;
    config["general"]["general"]["go_to_definition_verilog"] = element_value
    element_value = document.getElementById("general-general-developer_mode").checked;
    config["general"]["general"]["developer_mode"] = element_value
    config["documentation"] = {}
    config["documentation"]["general"] = {}
    element_value = document.getElementById("documentation-general-language").value;
    config["documentation"]["general"]["language"] = element_value
    element_value = document.getElementById("documentation-general-symbol_vhdl").value;
    config["documentation"]["general"]["symbol_vhdl"] = element_value
    element_value = document.getElementById("documentation-general-symbol_verilog").value;
    config["documentation"]["general"]["symbol_verilog"] = element_value
    element_value = document.getElementById("documentation-general-dependency_graph").checked;
    config["documentation"]["general"]["dependency_graph"] = element_value
    element_value = document.getElementById("documentation-general-self_contained").checked;
    config["documentation"]["general"]["self_contained"] = element_value
    element_value = document.getElementById("documentation-general-fsm").checked;
    config["documentation"]["general"]["fsm"] = element_value
    element_value = document.getElementById("documentation-general-ports").value;
    config["documentation"]["general"]["ports"] = element_value
    element_value = document.getElementById("documentation-general-generics").value;
    config["documentation"]["general"]["generics"] = element_value
    element_value = document.getElementById("documentation-general-instantiations").value;
    config["documentation"]["general"]["instantiations"] = element_value
    element_value = document.getElementById("documentation-general-signals").value;
    config["documentation"]["general"]["signals"] = element_value
    element_value = document.getElementById("documentation-general-constants").value;
    config["documentation"]["general"]["constants"] = element_value
    element_value = document.getElementById("documentation-general-types").value;
    config["documentation"]["general"]["types"] = element_value
    element_value = document.getElementById("documentation-general-process").value;
    config["documentation"]["general"]["process"] = element_value
    element_value = document.getElementById("documentation-general-functions").value;
    config["documentation"]["general"]["functions"] = element_value
    element_value = document.getElementById("documentation-general-tasks").value;
    config["documentation"]["general"]["tasks"] = element_value
    element_value = document.getElementById("documentation-general-magic_config_path").value;
    config["documentation"]["general"]["magic_config_path"] = element_value
    config["editor"] = {}
    config["editor"]["general"] = {}
    element_value = document.getElementById("editor-general-stutter_comment_shortcuts").checked;
    config["editor"]["general"]["stutter_comment_shortcuts"] = element_value
    element_value = parseInt(document.getElementById("editor-general-stutter_block_width").value, 10);
    config["editor"]["general"]["stutter_block_width"] = element_value
    element_value = parseInt(document.getElementById("editor-general-stutter_max_width").value, 10);
    config["editor"]["general"]["stutter_max_width"] = element_value
    element_value = document.getElementById("editor-general-stutter_delimiters").checked;
    config["editor"]["general"]["stutter_delimiters"] = element_value
    element_value = document.getElementById("editor-general-stutter_bracket_shortcuts").checked;
    config["editor"]["general"]["stutter_bracket_shortcuts"] = element_value
    config["formatter"] = {}
    config["formatter"]["general"] = {}
    element_value = document.getElementById("formatter-general-formatter_verilog").value;
    config["formatter"]["general"]["formatter_verilog"] = element_value
    element_value = document.getElementById("formatter-general-formatter_vhdl").value;
    config["formatter"]["general"]["formatter_vhdl"] = element_value
    config["formatter"]["istyle"] = {}
    element_value = document.getElementById("formatter-istyle-style").value;
    config["formatter"]["istyle"]["style"] = element_value
    element_value = parseInt(document.getElementById("formatter-istyle-indentation_size").value, 10);
    config["formatter"]["istyle"]["indentation_size"] = element_value
    config["formatter"]["s3sv"] = {}
    element_value = document.getElementById("formatter-s3sv-one_bind_per_line").checked;
    config["formatter"]["s3sv"]["one_bind_per_line"] = element_value
    element_value = document.getElementById("formatter-s3sv-one_declaration_per_line").checked;
    config["formatter"]["s3sv"]["one_declaration_per_line"] = element_value
    element_value = document.getElementById("formatter-s3sv-use_tabs").checked;
    config["formatter"]["s3sv"]["use_tabs"] = element_value
    element_value = parseInt(document.getElementById("formatter-s3sv-indentation_size").value, 10);
    config["formatter"]["s3sv"]["indentation_size"] = element_value
    config["formatter"]["verible"] = {}
    element_value = document.getElementById("formatter-verible-format_args").value;
    config["formatter"]["verible"]["format_args"] = element_value
    config["formatter"]["standalone"] = {}
    element_value = document.getElementById("formatter-standalone-keyword_case").value;
    config["formatter"]["standalone"]["keyword_case"] = element_value
    element_value = document.getElementById("formatter-standalone-name_case").value;
    config["formatter"]["standalone"]["name_case"] = element_value
    element_value = document.getElementById("formatter-standalone-indentation").value;
    config["formatter"]["standalone"]["indentation"] = element_value
    element_value = document.getElementById("formatter-standalone-align_port_generic").checked;
    config["formatter"]["standalone"]["align_port_generic"] = element_value
    element_value = document.getElementById("formatter-standalone-align_comment").checked;
    config["formatter"]["standalone"]["align_comment"] = element_value
    element_value = document.getElementById("formatter-standalone-remove_comments").checked;
    config["formatter"]["standalone"]["remove_comments"] = element_value
    element_value = document.getElementById("formatter-standalone-remove_reports").checked;
    config["formatter"]["standalone"]["remove_reports"] = element_value
    element_value = document.getElementById("formatter-standalone-check_alias").checked;
    config["formatter"]["standalone"]["check_alias"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_then").value;
    config["formatter"]["standalone"]["new_line_after_then"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_semicolon").value;
    config["formatter"]["standalone"]["new_line_after_semicolon"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_else").value;
    config["formatter"]["standalone"]["new_line_after_else"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_port").value;
    config["formatter"]["standalone"]["new_line_after_port"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_generic").value;
    config["formatter"]["standalone"]["new_line_after_generic"] = element_value
    config["formatter"]["vsg"] = {}
    config["linter"] = {}
    config["linter"]["general"] = {}
    element_value = document.getElementById("linter-general-linter_vhdl").value;
    config["linter"]["general"]["linter_vhdl"] = element_value
    element_value = document.getElementById("linter-general-linter_verilog").value;
    config["linter"]["general"]["linter_verilog"] = element_value
    element_value = document.getElementById("linter-general-lstyle_verilog").value;
    config["linter"]["general"]["lstyle_verilog"] = element_value
    element_value = document.getElementById("linter-general-lstyle_vhdl").value;
    config["linter"]["general"]["lstyle_vhdl"] = element_value
    config["linter"]["vhdlls"] = {}
    element_value = document.getElementById("linter-vhdlls-standard").value;
    config["linter"]["vhdlls"]["standard"] = element_value
    element_value = document.getElementById("linter-vhdlls-ignoreVunit").checked;
    config["linter"]["vhdlls"]["ignoreVunit"] = element_value
    element_value = document.getElementById("linter-vhdlls-vunitPath").value;
    config["linter"]["vhdlls"]["vunitPath"] = element_value
    config["linter"]["ghdl"] = {}
    element_value = document.getElementById("linter-ghdl-arguments").value;
    config["linter"]["ghdl"]["arguments"] = element_value
    config["linter"]["icarus"] = {}
    element_value = document.getElementById("linter-icarus-arguments").value;
    config["linter"]["icarus"]["arguments"] = element_value
    config["linter"]["modelsim"] = {}
    element_value = document.getElementById("linter-modelsim-vhdl_arguments").value;
    config["linter"]["modelsim"]["vhdl_arguments"] = element_value
    element_value = document.getElementById("linter-modelsim-verilog_arguments").value;
    config["linter"]["modelsim"]["verilog_arguments"] = element_value
    config["linter"]["verible"] = {}
    element_value = document.getElementById("linter-verible-arguments").value;
    config["linter"]["verible"]["arguments"] = element_value
    config["linter"]["verilator"] = {}
    element_value = document.getElementById("linter-verilator-arguments").value;
    config["linter"]["verilator"]["arguments"] = element_value
    config["linter"]["vivado"] = {}
    element_value = document.getElementById("linter-vivado-vhdl_arguments").value;
    config["linter"]["vivado"]["vhdl_arguments"] = element_value
    element_value = document.getElementById("linter-vivado-verilog_arguments").value;
    config["linter"]["vivado"]["verilog_arguments"] = element_value
    config["linter"]["vsg"] = {}
    config["schematic"] = {}
    config["schematic"]["general"] = {}
    element_value = document.getElementById("schematic-general-backend").value;
    config["schematic"]["general"]["backend"] = element_value
    element_value = document.getElementById("schematic-general-extra").value;
    config["schematic"]["general"]["extra"] = element_value
    element_value = document.getElementById("schematic-general-args").value;
    config["schematic"]["general"]["args"] = element_value
    element_value = document.getElementById("schematic-general-args_ghdl").value;
    config["schematic"]["general"]["args_ghdl"] = element_value
    config["templates"] = {}
    config["templates"]["general"] = {}
    element_value = document.getElementById("templates-general-header_file_path").value;
    config["templates"]["general"]["header_file_path"] = element_value
    element_value = document.getElementById("templates-general-indent").value;
    config["templates"]["general"]["indent"] = element_value
    element_value = document.getElementById("templates-general-clock_generation_style").value;
    config["templates"]["general"]["clock_generation_style"] = element_value
    element_value = document.getElementById("templates-general-instance_style").value;
    config["templates"]["general"]["instance_style"] = element_value
    config["tools"] = {}
    config["tools"]["general"] = {}
    element_value = document.getElementById("tools-general-select_tool").value;
    config["tools"]["general"]["select_tool"] = element_value
    element_value = document.getElementById("tools-general-manual_compilation_order").value;
    config["tools"]["general"]["manual_compilation_order"] = element_value
    element_value = document.getElementById("tools-general-execution_mode").value;
    config["tools"]["general"]["execution_mode"] = element_value
    element_value = document.getElementById("tools-general-waveform_viewer").value;
    config["tools"]["general"]["waveform_viewer"] = element_value
    element_value = document.getElementById("tools-general-gtkwave_installation_path").value;
    config["tools"]["general"]["gtkwave_installation_path"] = element_value
    element_value = document.getElementById("tools-general-gtkwave_extra_arguments").value;
    config["tools"]["general"]["gtkwave_extra_arguments"] = element_value
    config["tools"]["quartus"] = {}
    element_value = document.getElementById("tools-quartus-installation_path").value;
    config["tools"]["quartus"]["installation_path"] = element_value
    element_value = document.getElementById("tools-quartus-family").value;
    config["tools"]["quartus"]["family"] = element_value
    element_value = document.getElementById("tools-quartus-device").value;
    config["tools"]["quartus"]["device"] = element_value
    element_value = document.getElementById("tools-quartus-optimization_mode").value;
    config["tools"]["quartus"]["optimization_mode"] = element_value
    element_value = document.getElementById("tools-quartus-allow_register_retiming").checked;
    config["tools"]["quartus"]["allow_register_retiming"] = element_value
    element_value = document.getElementById("tools-quartus-wave_file_questa").value;
    config["tools"]["quartus"]["wave_file_questa"] = element_value
    config["tools"]["vsg"] = {}
    element_value = document.getElementById("tools-vsg-installation_path").value;
    config["tools"]["vsg"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vsg-style_config").value;
    config["tools"]["vsg"]["style_config"] = element_value
    element_value = parseInt(document.getElementById("tools-vsg-core_number").value, 10);
    config["tools"]["vsg"]["core_number"] = element_value
    element_value = document.getElementById("tools-vsg-aditional_arguments").value;
    config["tools"]["vsg"]["aditional_arguments"] = element_value
    config["tools"]["osvvm"] = {}
    element_value = document.getElementById("tools-osvvm-installation_path").value;
    config["tools"]["osvvm"]["installation_path"] = element_value
    element_value = document.getElementById("tools-osvvm-tclsh_binary").value;
    config["tools"]["osvvm"]["tclsh_binary"] = element_value
    element_value = document.getElementById("tools-osvvm-simulator_name").value;
    config["tools"]["osvvm"]["simulator_name"] = element_value
    config["tools"]["ascenlint"] = {}
    element_value = document.getElementById("tools-ascenlint-installation_path").value;
    config["tools"]["ascenlint"]["installation_path"] = element_value
    element_value = document.getElementById("tools-ascenlint-ascentlint_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ascenlint"]["ascentlint_options"] = element_value
    config["tools"]["cocotb"] = {}
    element_value = document.getElementById("tools-cocotb-installation_path").value;
    config["tools"]["cocotb"]["installation_path"] = element_value
    element_value = document.getElementById("tools-cocotb-simulator_name").value;
    config["tools"]["cocotb"]["simulator_name"] = element_value
    element_value = document.getElementById("tools-cocotb-compile_args").value;
    config["tools"]["cocotb"]["compile_args"] = element_value
    element_value = document.getElementById("tools-cocotb-run_args").value;
    config["tools"]["cocotb"]["run_args"] = element_value
    element_value = document.getElementById("tools-cocotb-plusargs").value;
    config["tools"]["cocotb"]["plusargs"] = element_value
    config["tools"]["diamond"] = {}
    element_value = document.getElementById("tools-diamond-installation_path").value;
    config["tools"]["diamond"]["installation_path"] = element_value
    element_value = document.getElementById("tools-diamond-part").value;
    config["tools"]["diamond"]["part"] = element_value
    config["tools"]["ghdl"] = {}
    config["tools"]["ghdl"]["section_basic"] = element_value
    element_value = document.getElementById("tools-ghdl-installation_path").value;
    config["tools"]["ghdl"]["installation_path"] = element_value
    config["tools"]["ghdl"]["section_language"] = element_value
    element_value = document.getElementById("tools-ghdl-vhdl_standard").value;
    config["tools"]["ghdl"]["vhdl_standard"] = element_value
    element_value = document.getElementById("tools-ghdl-ieee_library").value;
    config["tools"]["ghdl"]["ieee_library"] = element_value
    element_value = document.getElementById("tools-ghdl-relaxed_parsing").checked;
    config["tools"]["ghdl"]["relaxed_parsing"] = element_value
    element_value = document.getElementById("tools-ghdl-unicode_support").checked;
    config["tools"]["ghdl"]["unicode_support"] = element_value
    element_value = document.getElementById("tools-ghdl-psl_enabled").checked;
    config["tools"]["ghdl"]["psl_enabled"] = element_value
    config["tools"]["ghdl"]["section_libraries"] = element_value
    element_value = document.getElementById("tools-ghdl-work_library").value;
    config["tools"]["ghdl"]["work_library"] = element_value
    element_value = document.getElementById("tools-ghdl-library_paths").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["library_paths"] = element_value
    config["tools"]["ghdl"]["section_stage_options"] = element_value
    element_value = document.getElementById("tools-ghdl-check_syntax_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["check_syntax_options"] = element_value
    element_value = document.getElementById("tools-ghdl-analyze_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["analyze_options"] = element_value
    element_value = document.getElementById("tools-ghdl-elaborate_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["elaborate_options"] = element_value
    element_value = document.getElementById("tools-ghdl-run_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["run_options"] = element_value
    element_value = document.getElementById("tools-ghdl-synthesis_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["synthesis_options"] = element_value
    config["tools"]["ghdl"]["section_custom"] = element_value
    element_value = document.getElementById("tools-ghdl-extra_flags").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["extra_flags"] = element_value
    config["tools"]["ghdl"]["section_elaboration"] = element_value
    element_value = document.getElementById("tools-ghdl-relaxed_rules").checked;
    config["tools"]["ghdl"]["relaxed_rules"] = element_value
    element_value = document.getElementById("tools-ghdl-bind_checks").checked;
    config["tools"]["ghdl"]["bind_checks"] = element_value
    element_value = document.getElementById("tools-ghdl-vital_checks").checked;
    config["tools"]["ghdl"]["vital_checks"] = element_value
    config["tools"]["ghdl"]["section_simulation"] = element_value
    element_value = document.getElementById("tools-ghdl-simulation_time").value;
    config["tools"]["ghdl"]["simulation_time"] = element_value
    element_value = document.getElementById("tools-ghdl-resolution_limit").value;
    config["tools"]["ghdl"]["resolution_limit"] = element_value
    element_value = document.getElementById("tools-ghdl-stack_size").value;
    config["tools"]["ghdl"]["stack_size"] = element_value
    element_value = parseInt(document.getElementById("tools-ghdl-stop_delta_cycles").value, 10);
    config["tools"]["ghdl"]["stop_delta_cycles"] = element_value
    config["tools"]["ghdl"]["section_waveform"] = element_value
    element_value = document.getElementById("tools-ghdl-waveform_enabled").checked;
    config["tools"]["ghdl"]["waveform_enabled"] = element_value
    element_value = document.getElementById("tools-ghdl-waveform_format").value;
    config["tools"]["ghdl"]["waveform_format"] = element_value
    element_value = document.getElementById("tools-ghdl-waveform_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["waveform_options"] = element_value
    config["tools"]["ghdl"]["section_waveform_advanced"] = element_value
    element_value = document.getElementById("tools-ghdl-wave_start_time").value;
    config["tools"]["ghdl"]["wave_start_time"] = element_value
    element_value = document.getElementById("tools-ghdl-vcd_4states").checked;
    config["tools"]["ghdl"]["vcd_4states"] = element_value
    element_value = document.getElementById("tools-ghdl-vcd_nodate").checked;
    config["tools"]["ghdl"]["vcd_nodate"] = element_value
    element_value = document.getElementById("tools-ghdl-read_wave_opt").value;
    config["tools"]["ghdl"]["read_wave_opt"] = element_value
    element_value = document.getElementById("tools-ghdl-write_wave_opt").value;
    config["tools"]["ghdl"]["write_wave_opt"] = element_value
    config["tools"]["ghdl"]["section_debug"] = element_value
    element_value = document.getElementById("tools-ghdl-debug_level").value;
    config["tools"]["ghdl"]["debug_level"] = element_value
    element_value = document.getElementById("tools-ghdl-verbose").checked;
    config["tools"]["ghdl"]["verbose"] = element_value
    config["tools"]["ghdl"]["section_warnings"] = element_value
    element_value = document.getElementById("tools-ghdl-warnings_as_errors").checked;
    config["tools"]["ghdl"]["warnings_as_errors"] = element_value
    element_value = document.getElementById("tools-ghdl-suppress_warnings").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["suppress_warnings"] = element_value
    config["tools"]["ghdl"]["section_assertions"] = element_value
    element_value = document.getElementById("tools-ghdl-assert_level").value;
    config["tools"]["ghdl"]["assert_level"] = element_value
    config["tools"]["ghdl"]["section_display"] = element_value
    element_value = document.getElementById("tools-ghdl-display_time").checked;
    config["tools"]["ghdl"]["display_time"] = element_value
    element_value = document.getElementById("tools-ghdl-unbuffered_output").checked;
    config["tools"]["ghdl"]["unbuffered_output"] = element_value
    element_value = parseInt(document.getElementById("tools-ghdl-max_stack_alloc").value, 10);
    config["tools"]["ghdl"]["max_stack_alloc"] = element_value
    config["tools"]["ghdl"]["section_backtrace"] = element_value
    element_value = document.getElementById("tools-ghdl-backtrace_severity").value;
    config["tools"]["ghdl"]["backtrace_severity"] = element_value
    config["tools"]["ghdl"]["section_ieee"] = element_value
    element_value = document.getElementById("tools-ghdl-ieee_asserts").value;
    config["tools"]["ghdl"]["ieee_asserts"] = element_value
    element_value = document.getElementById("tools-ghdl-asserts_policy").value;
    config["tools"]["ghdl"]["asserts_policy"] = element_value
    config["tools"]["ghdl"]["section_external"] = element_value
    element_value = document.getElementById("tools-ghdl-sdf_file").value;
    config["tools"]["ghdl"]["sdf_file"] = element_value
    element_value = document.getElementById("tools-ghdl-vpi_modules").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["vpi_modules"] = element_value
    element_value = document.getElementById("tools-ghdl-vhpi_modules").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["ghdl"]["vhpi_modules"] = element_value
    element_value = document.getElementById("tools-ghdl-vpi_trace_file").value;
    config["tools"]["ghdl"]["vpi_trace_file"] = element_value
    element_value = document.getElementById("tools-ghdl-vhpi_trace_file").value;
    config["tools"]["ghdl"]["vhpi_trace_file"] = element_value
    config["tools"]["ghdl"]["section_tracing"] = element_value
    element_value = document.getElementById("tools-ghdl-psl_report_file").value;
    config["tools"]["ghdl"]["psl_report_file"] = element_value
    element_value = document.getElementById("tools-ghdl-psl_report_uncovered").checked;
    config["tools"]["ghdl"]["psl_report_uncovered"] = element_value
    element_value = document.getElementById("tools-ghdl-disp_tree").value;
    config["tools"]["ghdl"]["disp_tree"] = element_value
    config["tools"]["ghdl"]["section_execution"] = element_value
    element_value = document.getElementById("tools-ghdl-no_run").checked;
    config["tools"]["ghdl"]["no_run"] = element_value
    config["tools"]["icarus"] = {}
    element_value = document.getElementById("tools-icarus-installation_path").value;
    config["tools"]["icarus"]["installation_path"] = element_value
    element_value = document.getElementById("tools-icarus-timescale").value;
    config["tools"]["icarus"]["timescale"] = element_value
    element_value = document.getElementById("tools-icarus-iverilog_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["icarus"]["iverilog_options"] = element_value
    config["tools"]["icestorm"] = {}
    element_value = document.getElementById("tools-icestorm-installation_path").value;
    config["tools"]["icestorm"]["installation_path"] = element_value
    element_value = document.getElementById("tools-icestorm-pnr").value;
    config["tools"]["icestorm"]["pnr"] = element_value
    element_value = document.getElementById("tools-icestorm-arch").value;
    config["tools"]["icestorm"]["arch"] = element_value
    element_value = document.getElementById("tools-icestorm-output_format").value;
    config["tools"]["icestorm"]["output_format"] = element_value
    element_value = document.getElementById("tools-icestorm-yosys_as_subtool").checked;
    config["tools"]["icestorm"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-icestorm-makefile_name").value;
    config["tools"]["icestorm"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-icestorm-arachne_pnr_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["icestorm"]["arachne_pnr_options"] = element_value
    element_value = document.getElementById("tools-icestorm-nextpnr_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["icestorm"]["nextpnr_options"] = element_value
    element_value = document.getElementById("tools-icestorm-yosys_synth_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["icestorm"]["yosys_synth_options"] = element_value
    config["tools"]["ise"] = {}
    element_value = document.getElementById("tools-ise-installation_path").value;
    config["tools"]["ise"]["installation_path"] = element_value
    element_value = document.getElementById("tools-ise-family").value;
    config["tools"]["ise"]["family"] = element_value
    element_value = document.getElementById("tools-ise-device").value;
    config["tools"]["ise"]["device"] = element_value
    element_value = document.getElementById("tools-ise-package").value;
    config["tools"]["ise"]["package"] = element_value
    element_value = document.getElementById("tools-ise-speed").value;
    config["tools"]["ise"]["speed"] = element_value
    config["tools"]["isem"] = {}
    element_value = document.getElementById("tools-isem-installation_path").value;
    config["tools"]["isem"]["installation_path"] = element_value
    element_value = document.getElementById("tools-isem-fuse_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["isem"]["fuse_options"] = element_value
    element_value = document.getElementById("tools-isem-isim_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["isem"]["isim_options"] = element_value
    config["tools"]["modelsim"] = {}
    element_value = document.getElementById("tools-modelsim-installation_path").value;
    config["tools"]["modelsim"]["installation_path"] = element_value
    element_value = document.getElementById("tools-modelsim-vcom_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["modelsim"]["vcom_options"] = element_value
    element_value = document.getElementById("tools-modelsim-vlog_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["modelsim"]["vlog_options"] = element_value
    element_value = document.getElementById("tools-modelsim-vsim_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["modelsim"]["vsim_options"] = element_value
    config["tools"]["morty"] = {}
    element_value = document.getElementById("tools-morty-installation_path").value;
    config["tools"]["morty"]["installation_path"] = element_value
    element_value = document.getElementById("tools-morty-morty_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["morty"]["morty_options"] = element_value
    config["tools"]["radiant"] = {}
    element_value = document.getElementById("tools-radiant-installation_path").value;
    config["tools"]["radiant"]["installation_path"] = element_value
    element_value = document.getElementById("tools-radiant-part").value;
    config["tools"]["radiant"]["part"] = element_value
    config["tools"]["rivierapro"] = {}
    element_value = document.getElementById("tools-rivierapro-installation_path").value;
    config["tools"]["rivierapro"]["installation_path"] = element_value
    element_value = document.getElementById("tools-rivierapro-compilation_mode").value;
    config["tools"]["rivierapro"]["compilation_mode"] = element_value
    element_value = document.getElementById("tools-rivierapro-vlog_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["rivierapro"]["vlog_options"] = element_value
    element_value = document.getElementById("tools-rivierapro-vsim_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["rivierapro"]["vsim_options"] = element_value
    config["tools"]["siliconcompiler"] = {}
    element_value = document.getElementById("tools-siliconcompiler-installation_path").value;
    config["tools"]["siliconcompiler"]["installation_path"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-target").value;
    config["tools"]["siliconcompiler"]["target"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_enable").checked;
    config["tools"]["siliconcompiler"]["server_enable"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_address").value;
    config["tools"]["siliconcompiler"]["server_address"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_username").value;
    config["tools"]["siliconcompiler"]["server_username"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_password").value;
    config["tools"]["siliconcompiler"]["server_password"] = element_value
    config["tools"]["spyglass"] = {}
    element_value = document.getElementById("tools-spyglass-installation_path").value;
    config["tools"]["spyglass"]["installation_path"] = element_value
    element_value = document.getElementById("tools-spyglass-methodology").value;
    config["tools"]["spyglass"]["methodology"] = element_value
    element_value = document.getElementById("tools-spyglass-goals").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["spyglass"]["goals"] = element_value
    element_value = document.getElementById("tools-spyglass-spyglass_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["spyglass"]["spyglass_options"] = element_value
    element_value = document.getElementById("tools-spyglass-rule_parameters").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["spyglass"]["rule_parameters"] = element_value
    config["tools"]["symbiyosys"] = {}
    element_value = document.getElementById("tools-symbiyosys-installation_path").value;
    config["tools"]["symbiyosys"]["installation_path"] = element_value
    element_value = document.getElementById("tools-symbiyosys-tasknames").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["symbiyosys"]["tasknames"] = element_value
    config["tools"]["symbiflow"] = {}
    element_value = document.getElementById("tools-symbiflow-installation_path").value;
    config["tools"]["symbiflow"]["installation_path"] = element_value
    element_value = document.getElementById("tools-symbiflow-package").value;
    config["tools"]["symbiflow"]["package"] = element_value
    element_value = document.getElementById("tools-symbiflow-part").value;
    config["tools"]["symbiflow"]["part"] = element_value
    element_value = document.getElementById("tools-symbiflow-vendor").value;
    config["tools"]["symbiflow"]["vendor"] = element_value
    element_value = document.getElementById("tools-symbiflow-pnr").value;
    config["tools"]["symbiflow"]["pnr"] = element_value
    element_value = document.getElementById("tools-symbiflow-vpr_options").value;
    config["tools"]["symbiflow"]["vpr_options"] = element_value
    element_value = document.getElementById("tools-symbiflow-environment_script").value;
    config["tools"]["symbiflow"]["environment_script"] = element_value
    config["tools"]["trellis"] = {}
    element_value = document.getElementById("tools-trellis-installation_path").value;
    config["tools"]["trellis"]["installation_path"] = element_value
    element_value = document.getElementById("tools-trellis-arch").value;
    config["tools"]["trellis"]["arch"] = element_value
    element_value = document.getElementById("tools-trellis-output_format").value;
    config["tools"]["trellis"]["output_format"] = element_value
    element_value = document.getElementById("tools-trellis-yosys_as_subtool").checked;
    config["tools"]["trellis"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-trellis-makefile_name").value;
    config["tools"]["trellis"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-trellis-script_name").value;
    config["tools"]["trellis"]["script_name"] = element_value
    element_value = document.getElementById("tools-trellis-nextpnr_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["trellis"]["nextpnr_options"] = element_value
    element_value = document.getElementById("tools-trellis-yosys_synth_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["trellis"]["yosys_synth_options"] = element_value
    config["tools"]["vcs"] = {}
    element_value = document.getElementById("tools-vcs-installation_path").value;
    config["tools"]["vcs"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vcs-vcs_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["vcs"]["vcs_options"] = element_value
    element_value = document.getElementById("tools-vcs-run_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["vcs"]["run_options"] = element_value
    config["tools"]["verible"] = {}
    element_value = document.getElementById("tools-verible-installation_path").value;
    config["tools"]["verible"]["installation_path"] = element_value
    config["tools"]["verilator"] = {}
    element_value = document.getElementById("tools-verilator-installation_path").value;
    config["tools"]["verilator"]["installation_path"] = element_value
    element_value = document.getElementById("tools-verilator-mode").value;
    config["tools"]["verilator"]["mode"] = element_value
    element_value = document.getElementById("tools-verilator-libs").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["verilator"]["libs"] = element_value
    element_value = document.getElementById("tools-verilator-verilator_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["verilator"]["verilator_options"] = element_value
    element_value = document.getElementById("tools-verilator-make_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["verilator"]["make_options"] = element_value
    element_value = document.getElementById("tools-verilator-run_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["verilator"]["run_options"] = element_value
    config["tools"]["vivado"] = {}
    element_value = document.getElementById("tools-vivado-installation_path").value;
    config["tools"]["vivado"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vivado-part").value;
    config["tools"]["vivado"]["part"] = element_value
    element_value = document.getElementById("tools-vivado-synth").value;
    config["tools"]["vivado"]["synth"] = element_value
    element_value = document.getElementById("tools-vivado-pnr").value;
    config["tools"]["vivado"]["pnr"] = element_value
    element_value = parseInt(document.getElementById("tools-vivado-jtag_freq").value, 10);
    config["tools"]["vivado"]["jtag_freq"] = element_value
    element_value = document.getElementById("tools-vivado-hw_target").value;
    config["tools"]["vivado"]["hw_target"] = element_value
    config["tools"]["vunit"] = {}
    element_value = document.getElementById("tools-vunit-installation_path").value;
    config["tools"]["vunit"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vunit-simulator_name").value;
    config["tools"]["vunit"]["simulator_name"] = element_value
    element_value = document.getElementById("tools-vunit-runpy_mode").value;
    config["tools"]["vunit"]["runpy_mode"] = element_value
    element_value = document.getElementById("tools-vunit-extra_options").value;
    config["tools"]["vunit"]["extra_options"] = element_value
    element_value = document.getElementById("tools-vunit-enable_array_util_lib").checked;
    config["tools"]["vunit"]["enable_array_util_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_com_lib").checked;
    config["tools"]["vunit"]["enable_com_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_json4vhdl_lib").checked;
    config["tools"]["vunit"]["enable_json4vhdl_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_osvvm_lib").checked;
    config["tools"]["vunit"]["enable_osvvm_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_random_lib").checked;
    config["tools"]["vunit"]["enable_random_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_verification_components_lib").checked;
    config["tools"]["vunit"]["enable_verification_components_lib"] = element_value
    config["tools"]["xcelium"] = {}
    element_value = document.getElementById("tools-xcelium-installation_path").value;
    config["tools"]["xcelium"]["installation_path"] = element_value
    element_value = document.getElementById("tools-xcelium-xmvhdl_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["xcelium"]["xmvhdl_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xmvlog_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["xcelium"]["xmvlog_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xmsim_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["xcelium"]["xmsim_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xrun_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["xcelium"]["xrun_options"] = element_value
    config["tools"]["xsim"] = {}
    element_value = document.getElementById("tools-xsim-installation_path").value;
    config["tools"]["xsim"]["installation_path"] = element_value
    element_value = document.getElementById("tools-xsim-xelab_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["xsim"]["xelab_options"] = element_value
    element_value = document.getElementById("tools-xsim-xsim_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["xsim"]["xsim_options"] = element_value
    config["tools"]["yosys"] = {}
    config["tools"]["yosys"]["section_basic"] = element_value
    element_value = document.getElementById("tools-yosys-installation_path").value;
    config["tools"]["yosys"]["installation_path"] = element_value
    config["tools"]["yosys"]["section_files"] = element_value
    element_value = document.getElementById("tools-yosys-read_verilog_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["read_verilog_options"] = element_value
    element_value = document.getElementById("tools-yosys-read_systemverilog_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["read_systemverilog_options"] = element_value
    element_value = document.getElementById("tools-yosys-read_liberty_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["read_liberty_options"] = element_value
    config["tools"]["yosys"]["section_hierarchy"] = element_value
    element_value = document.getElementById("tools-yosys-hierarchy_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["hierarchy_options"] = element_value
    config["tools"]["yosys"]["section_synthesis"] = element_value
    element_value = document.getElementById("tools-yosys-proc_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["proc_options"] = element_value
    element_value = document.getElementById("tools-yosys-opt_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["opt_options"] = element_value
    element_value = document.getElementById("tools-yosys-flatten_enabled").checked;
    config["tools"]["yosys"]["flatten_enabled"] = element_value
    element_value = document.getElementById("tools-yosys-flatten_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["flatten_options"] = element_value
    config["tools"]["yosys"]["section_memory_fsm"] = element_value
    element_value = document.getElementById("tools-yosys-memory_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["memory_options"] = element_value
    element_value = document.getElementById("tools-yosys-fsm_enabled").checked;
    config["tools"]["yosys"]["fsm_enabled"] = element_value
    element_value = document.getElementById("tools-yosys-fsm_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["fsm_options"] = element_value
    config["tools"]["yosys"]["section_techmap"] = element_value
    element_value = document.getElementById("tools-yosys-techmap_enabled").checked;
    config["tools"]["yosys"]["techmap_enabled"] = element_value
    element_value = document.getElementById("tools-yosys-techmap_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["techmap_options"] = element_value
    element_value = document.getElementById("tools-yosys-abc_enabled").checked;
    config["tools"]["yosys"]["abc_enabled"] = element_value
    element_value = document.getElementById("tools-yosys-abc_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["abc_options"] = element_value
    config["tools"]["yosys"]["section_synthesis_general"] = element_value
    element_value = document.getElementById("tools-yosys-synthesis_target").value;
    config["tools"]["yosys"]["synthesis_target"] = element_value
    config["tools"]["yosys"]["section_synthesis_ice40"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_device").value;
    config["tools"]["yosys"]["ice40_device"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_top_module").value;
    config["tools"]["yosys"]["ice40_top_module"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_output_blif").value;
    config["tools"]["yosys"]["ice40_output_blif"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_output_edif").value;
    config["tools"]["yosys"]["ice40_output_edif"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_output_json").value;
    config["tools"]["yosys"]["ice40_output_json"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_noflatten").checked;
    config["tools"]["yosys"]["ice40_noflatten"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_dff").checked;
    config["tools"]["yosys"]["ice40_dff"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_retime").checked;
    config["tools"]["yosys"]["ice40_retime"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_nocarry").checked;
    config["tools"]["yosys"]["ice40_nocarry"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_nodffe").checked;
    config["tools"]["yosys"]["ice40_nodffe"] = element_value
    element_value = parseInt(document.getElementById("tools-yosys-ice40_dffe_min_ce_use").value, 10);
    config["tools"]["yosys"]["ice40_dffe_min_ce_use"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_nobram").checked;
    config["tools"]["yosys"]["ice40_nobram"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_spram").checked;
    config["tools"]["yosys"]["ice40_spram"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_dsp").checked;
    config["tools"]["yosys"]["ice40_dsp"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_noabc").checked;
    config["tools"]["yosys"]["ice40_noabc"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_abc2").checked;
    config["tools"]["yosys"]["ice40_abc2"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_vpr").checked;
    config["tools"]["yosys"]["ice40_vpr"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_noabc9").checked;
    config["tools"]["yosys"]["ice40_noabc9"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_flowmap").checked;
    config["tools"]["yosys"]["ice40_flowmap"] = element_value
    element_value = document.getElementById("tools-yosys-ice40_no_rw_check").checked;
    config["tools"]["yosys"]["ice40_no_rw_check"] = element_value
    config["tools"]["yosys"]["section_synthesis_ecp5"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_top_module").value;
    config["tools"]["yosys"]["ecp5_top_module"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_output_blif").value;
    config["tools"]["yosys"]["ecp5_output_blif"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_output_edif").value;
    config["tools"]["yosys"]["ecp5_output_edif"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_output_json").value;
    config["tools"]["yosys"]["ecp5_output_json"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_noflatten").checked;
    config["tools"]["yosys"]["ecp5_noflatten"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_dff").checked;
    config["tools"]["yosys"]["ecp5_dff"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_retime").checked;
    config["tools"]["yosys"]["ecp5_retime"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_noccu2").checked;
    config["tools"]["yosys"]["ecp5_noccu2"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_nodffe").checked;
    config["tools"]["yosys"]["ecp5_nodffe"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_nobram").checked;
    config["tools"]["yosys"]["ecp5_nobram"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_nolutram").checked;
    config["tools"]["yosys"]["ecp5_nolutram"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_nowidelut").checked;
    config["tools"]["yosys"]["ecp5_nowidelut"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_asyncprld").checked;
    config["tools"]["yosys"]["ecp5_asyncprld"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_abc2").checked;
    config["tools"]["yosys"]["ecp5_abc2"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_noabc9").checked;
    config["tools"]["yosys"]["ecp5_noabc9"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_vpr").checked;
    config["tools"]["yosys"]["ecp5_vpr"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_iopad").checked;
    config["tools"]["yosys"]["ecp5_iopad"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_nodsp").checked;
    config["tools"]["yosys"]["ecp5_nodsp"] = element_value
    element_value = document.getElementById("tools-yosys-ecp5_no_rw_check").checked;
    config["tools"]["yosys"]["ecp5_no_rw_check"] = element_value
    config["tools"]["yosys"]["section_debug"] = element_value
    element_value = document.getElementById("tools-yosys-verbose").checked;
    config["tools"]["yosys"]["verbose"] = element_value
    element_value = document.getElementById("tools-yosys-debug_level").value;
    config["tools"]["yosys"]["debug_level"] = element_value
    element_value = document.getElementById("tools-yosys-log_file").value;
    config["tools"]["yosys"]["log_file"] = element_value
    config["tools"]["yosys"]["section_legacy"] = element_value
    config["tools"]["yosys"]["section_custom"] = element_value
    element_value = document.getElementById("tools-yosys-custom_load_commands").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["custom_load_commands"] = element_value
    element_value = document.getElementById("tools-yosys-custom_analyze_commands").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["custom_analyze_commands"] = element_value
    element_value = document.getElementById("tools-yosys-custom_elaborate_commands").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["custom_elaborate_commands"] = element_value
    element_value = document.getElementById("tools-yosys-extra_flags").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["extra_flags"] = element_value
    config["tools"]["yosys"]["section_advanced"] = element_value
    element_value = document.getElementById("tools-yosys-check_enabled").checked;
    config["tools"]["yosys"]["check_enabled"] = element_value
    element_value = document.getElementById("tools-yosys-check_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["check_options"] = element_value
    element_value = document.getElementById("tools-yosys-stat_enabled").checked;
    config["tools"]["yosys"]["stat_enabled"] = element_value
    element_value = document.getElementById("tools-yosys-stat_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["yosys"]["stat_options"] = element_value
    config["tools"]["openfpga"] = {}
    element_value = document.getElementById("tools-openfpga-installation_path").value;
    config["tools"]["openfpga"]["installation_path"] = element_value
    element_value = document.getElementById("tools-openfpga-arch").value;
    config["tools"]["openfpga"]["arch"] = element_value
    element_value = document.getElementById("tools-openfpga-task_options").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["openfpga"]["task_options"] = element_value
    config["tools"]["activehdl"] = {}
    element_value = document.getElementById("tools-activehdl-installation_path").value;
    config["tools"]["activehdl"]["installation_path"] = element_value
    config["tools"]["questa"] = {}
    element_value = document.getElementById("tools-questa-installation_path").value;
    config["tools"]["questa"]["installation_path"] = element_value
    config["tools"]["raptor"] = {}
    element_value = document.getElementById("tools-raptor-installation_path").value;
    config["tools"]["raptor"]["installation_path"] = element_value
    element_value = document.getElementById("tools-raptor-target_device").value;
    config["tools"]["raptor"]["target_device"] = element_value
    element_value = document.getElementById("tools-raptor-vhdl_version").value;
    config["tools"]["raptor"]["vhdl_version"] = element_value
    element_value = document.getElementById("tools-raptor-verilog_version").value;
    config["tools"]["raptor"]["verilog_version"] = element_value
    element_value = document.getElementById("tools-raptor-sv_version").value;
    config["tools"]["raptor"]["sv_version"] = element_value
    config["tools"]["raptor"]["div_0"] = element_value
    element_value = document.getElementById("tools-raptor-optimization").value;
    config["tools"]["raptor"]["optimization"] = element_value
    element_value = document.getElementById("tools-raptor-effort").value;
    config["tools"]["raptor"]["effort"] = element_value
    element_value = document.getElementById("tools-raptor-fsm_encoding").value;
    config["tools"]["raptor"]["fsm_encoding"] = element_value
    element_value = document.getElementById("tools-raptor-carry").value;
    config["tools"]["raptor"]["carry"] = element_value
    element_value = document.getElementById("tools-raptor-pnr_netlist_language").value;
    config["tools"]["raptor"]["pnr_netlist_language"] = element_value
    element_value = parseInt(document.getElementById("tools-raptor-dsp_limit").value, 10);
    config["tools"]["raptor"]["dsp_limit"] = element_value
    element_value = parseInt(document.getElementById("tools-raptor-block_ram_limit").value, 10);
    config["tools"]["raptor"]["block_ram_limit"] = element_value
    element_value = document.getElementById("tools-raptor-fast_synthesis").checked;
    config["tools"]["raptor"]["fast_synthesis"] = element_value
    config["tools"]["raptor"]["div_1"] = element_value
    element_value = document.getElementById("tools-raptor-top_level").value;
    config["tools"]["raptor"]["top_level"] = element_value
    element_value = document.getElementById("tools-raptor-sim_source_list").value.split(',');
    if (element_value.length == 1 && element_value[0] == "") {
      element_value = [];
    }
    config["tools"]["raptor"]["sim_source_list"] = element_value
    element_value = document.getElementById("tools-raptor-simulate_rtl").checked;
    config["tools"]["raptor"]["simulate_rtl"] = element_value
    element_value = document.getElementById("tools-raptor-waveform_rtl").value;
    config["tools"]["raptor"]["waveform_rtl"] = element_value
    element_value = document.getElementById("tools-raptor-simulator_rtl").value;
    config["tools"]["raptor"]["simulator_rtl"] = element_value
    element_value = document.getElementById("tools-raptor-simulation_options_rtl").value;
    config["tools"]["raptor"]["simulation_options_rtl"] = element_value
    element_value = document.getElementById("tools-raptor-simulate_gate").checked;
    config["tools"]["raptor"]["simulate_gate"] = element_value
    element_value = document.getElementById("tools-raptor-waveform_gate").value;
    config["tools"]["raptor"]["waveform_gate"] = element_value
    element_value = document.getElementById("tools-raptor-simulator_gate").value;
    config["tools"]["raptor"]["simulator_gate"] = element_value
    element_value = document.getElementById("tools-raptor-simulation_options_gate").value;
    config["tools"]["raptor"]["simulation_options_gate"] = element_value
    element_value = document.getElementById("tools-raptor-simulate_pnr").checked;
    config["tools"]["raptor"]["simulate_pnr"] = element_value
    element_value = document.getElementById("tools-raptor-waveform_pnr").value;
    config["tools"]["raptor"]["waveform_pnr"] = element_value
    element_value = document.getElementById("tools-raptor-simulator_pnr").value;
    config["tools"]["raptor"]["simulator_pnr"] = element_value
    element_value = document.getElementById("tools-raptor-simulation_options_pnr").value;
    config["tools"]["raptor"]["simulation_options_pnr"] = element_value
    return config;
  }

  function set_config(config){
    if (config["general"] && config["general"]["general"] && config["general"]["general"]["pypath"] !== undefined) {
        document.getElementById("general-general-pypath").value = config["general"]["general"]["pypath"];
    }
    if (config["general"] && config["general"]["general"] && config["general"]["general"]["makepath"] !== undefined) {
        document.getElementById("general-general-makepath").value = config["general"]["general"]["makepath"];
    }
    if (config["general"] && config["general"]["general"] && config["general"]["general"]["go_to_definition_vhdl"] !== undefined) {
        document.getElementById("general-general-go_to_definition_vhdl").checked = config["general"]["general"]["go_to_definition_vhdl"];
    }
    if (config["general"] && config["general"]["general"] && config["general"]["general"]["go_to_definition_verilog"] !== undefined) {
        document.getElementById("general-general-go_to_definition_verilog").checked = config["general"]["general"]["go_to_definition_verilog"];
    }
    if (config["general"] && config["general"]["general"] && config["general"]["general"]["developer_mode"] !== undefined) {
        document.getElementById("general-general-developer_mode").checked = config["general"]["general"]["developer_mode"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["language"] !== undefined) {
        document.getElementById("documentation-general-language").value = config["documentation"]["general"]["language"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["symbol_vhdl"] !== undefined) {
        document.getElementById("documentation-general-symbol_vhdl").value = config["documentation"]["general"]["symbol_vhdl"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["symbol_verilog"] !== undefined) {
        document.getElementById("documentation-general-symbol_verilog").value = config["documentation"]["general"]["symbol_verilog"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["dependency_graph"] !== undefined) {
        document.getElementById("documentation-general-dependency_graph").checked = config["documentation"]["general"]["dependency_graph"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["self_contained"] !== undefined) {
        document.getElementById("documentation-general-self_contained").checked = config["documentation"]["general"]["self_contained"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["fsm"] !== undefined) {
        document.getElementById("documentation-general-fsm").checked = config["documentation"]["general"]["fsm"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["ports"] !== undefined) {
        document.getElementById("documentation-general-ports").value = config["documentation"]["general"]["ports"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["generics"] !== undefined) {
        document.getElementById("documentation-general-generics").value = config["documentation"]["general"]["generics"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["instantiations"] !== undefined) {
        document.getElementById("documentation-general-instantiations").value = config["documentation"]["general"]["instantiations"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["signals"] !== undefined) {
        document.getElementById("documentation-general-signals").value = config["documentation"]["general"]["signals"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["constants"] !== undefined) {
        document.getElementById("documentation-general-constants").value = config["documentation"]["general"]["constants"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["types"] !== undefined) {
        document.getElementById("documentation-general-types").value = config["documentation"]["general"]["types"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["process"] !== undefined) {
        document.getElementById("documentation-general-process").value = config["documentation"]["general"]["process"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["functions"] !== undefined) {
        document.getElementById("documentation-general-functions").value = config["documentation"]["general"]["functions"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["tasks"] !== undefined) {
        document.getElementById("documentation-general-tasks").value = config["documentation"]["general"]["tasks"];
    }
    if (config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["magic_config_path"] !== undefined) {
        document.getElementById("documentation-general-magic_config_path").value = config["documentation"]["general"]["magic_config_path"];
    }
    if (config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_comment_shortcuts"] !== undefined) {
        document.getElementById("editor-general-stutter_comment_shortcuts").checked = config["editor"]["general"]["stutter_comment_shortcuts"];
    }
    if (config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_block_width"] !== undefined) {
        document.getElementById("editor-general-stutter_block_width").value = config["editor"]["general"]["stutter_block_width"];
    }
    if (config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_max_width"] !== undefined) {
        document.getElementById("editor-general-stutter_max_width").value = config["editor"]["general"]["stutter_max_width"];
    }
    if (config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_delimiters"] !== undefined) {
        document.getElementById("editor-general-stutter_delimiters").checked = config["editor"]["general"]["stutter_delimiters"];
    }
    if (config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_bracket_shortcuts"] !== undefined) {
        document.getElementById("editor-general-stutter_bracket_shortcuts").checked = config["editor"]["general"]["stutter_bracket_shortcuts"];
    }
    if (config["formatter"] && config["formatter"]["general"] && config["formatter"]["general"]["formatter_verilog"] !== undefined) {
        document.getElementById("formatter-general-formatter_verilog").value = config["formatter"]["general"]["formatter_verilog"];
    }
    if (config["formatter"] && config["formatter"]["general"] && config["formatter"]["general"]["formatter_vhdl"] !== undefined) {
        document.getElementById("formatter-general-formatter_vhdl").value = config["formatter"]["general"]["formatter_vhdl"];
    }
    if (config["formatter"] && config["formatter"]["istyle"] && config["formatter"]["istyle"]["style"] !== undefined) {
        document.getElementById("formatter-istyle-style").value = config["formatter"]["istyle"]["style"];
    }
    if (config["formatter"] && config["formatter"]["istyle"] && config["formatter"]["istyle"]["indentation_size"] !== undefined) {
        document.getElementById("formatter-istyle-indentation_size").value = config["formatter"]["istyle"]["indentation_size"];
    }
    if (config["formatter"] && config["formatter"]["s3sv"] && config["formatter"]["s3sv"]["one_bind_per_line"] !== undefined) {
        document.getElementById("formatter-s3sv-one_bind_per_line").checked = config["formatter"]["s3sv"]["one_bind_per_line"];
    }
    if (config["formatter"] && config["formatter"]["s3sv"] && config["formatter"]["s3sv"]["one_declaration_per_line"] !== undefined) {
        document.getElementById("formatter-s3sv-one_declaration_per_line").checked = config["formatter"]["s3sv"]["one_declaration_per_line"];
    }
    if (config["formatter"] && config["formatter"]["s3sv"] && config["formatter"]["s3sv"]["use_tabs"] !== undefined) {
        document.getElementById("formatter-s3sv-use_tabs").checked = config["formatter"]["s3sv"]["use_tabs"];
    }
    if (config["formatter"] && config["formatter"]["s3sv"] && config["formatter"]["s3sv"]["indentation_size"] !== undefined) {
        document.getElementById("formatter-s3sv-indentation_size").value = config["formatter"]["s3sv"]["indentation_size"];
    }
    if (config["formatter"] && config["formatter"]["verible"] && config["formatter"]["verible"]["format_args"] !== undefined) {
        document.getElementById("formatter-verible-format_args").value = config["formatter"]["verible"]["format_args"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["keyword_case"] !== undefined) {
        document.getElementById("formatter-standalone-keyword_case").value = config["formatter"]["standalone"]["keyword_case"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["name_case"] !== undefined) {
        document.getElementById("formatter-standalone-name_case").value = config["formatter"]["standalone"]["name_case"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["indentation"] !== undefined) {
        document.getElementById("formatter-standalone-indentation").value = config["formatter"]["standalone"]["indentation"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["align_port_generic"] !== undefined) {
        document.getElementById("formatter-standalone-align_port_generic").checked = config["formatter"]["standalone"]["align_port_generic"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["align_comment"] !== undefined) {
        document.getElementById("formatter-standalone-align_comment").checked = config["formatter"]["standalone"]["align_comment"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["remove_comments"] !== undefined) {
        document.getElementById("formatter-standalone-remove_comments").checked = config["formatter"]["standalone"]["remove_comments"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["remove_reports"] !== undefined) {
        document.getElementById("formatter-standalone-remove_reports").checked = config["formatter"]["standalone"]["remove_reports"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["check_alias"] !== undefined) {
        document.getElementById("formatter-standalone-check_alias").checked = config["formatter"]["standalone"]["check_alias"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_then"] !== undefined) {
        document.getElementById("formatter-standalone-new_line_after_then").value = config["formatter"]["standalone"]["new_line_after_then"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_semicolon"] !== undefined) {
        document.getElementById("formatter-standalone-new_line_after_semicolon").value = config["formatter"]["standalone"]["new_line_after_semicolon"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_else"] !== undefined) {
        document.getElementById("formatter-standalone-new_line_after_else").value = config["formatter"]["standalone"]["new_line_after_else"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_port"] !== undefined) {
        document.getElementById("formatter-standalone-new_line_after_port").value = config["formatter"]["standalone"]["new_line_after_port"];
    }
    if (config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_generic"] !== undefined) {
        document.getElementById("formatter-standalone-new_line_after_generic").value = config["formatter"]["standalone"]["new_line_after_generic"];
    }
    if (config["linter"] && config["linter"]["general"] && config["linter"]["general"]["linter_vhdl"] !== undefined) {
        document.getElementById("linter-general-linter_vhdl").value = config["linter"]["general"]["linter_vhdl"];
    }
    if (config["linter"] && config["linter"]["general"] && config["linter"]["general"]["linter_verilog"] !== undefined) {
        document.getElementById("linter-general-linter_verilog").value = config["linter"]["general"]["linter_verilog"];
    }
    if (config["linter"] && config["linter"]["general"] && config["linter"]["general"]["lstyle_verilog"] !== undefined) {
        document.getElementById("linter-general-lstyle_verilog").value = config["linter"]["general"]["lstyle_verilog"];
    }
    if (config["linter"] && config["linter"]["general"] && config["linter"]["general"]["lstyle_vhdl"] !== undefined) {
        document.getElementById("linter-general-lstyle_vhdl").value = config["linter"]["general"]["lstyle_vhdl"];
    }
    if (config["linter"] && config["linter"]["vhdlls"] && config["linter"]["vhdlls"]["standard"] !== undefined) {
        document.getElementById("linter-vhdlls-standard").value = config["linter"]["vhdlls"]["standard"];
    }
    if (config["linter"] && config["linter"]["vhdlls"] && config["linter"]["vhdlls"]["ignoreVunit"] !== undefined) {
        document.getElementById("linter-vhdlls-ignoreVunit").checked = config["linter"]["vhdlls"]["ignoreVunit"];
    }
    if (config["linter"] && config["linter"]["vhdlls"] && config["linter"]["vhdlls"]["vunitPath"] !== undefined) {
        document.getElementById("linter-vhdlls-vunitPath").value = config["linter"]["vhdlls"]["vunitPath"];
    }
    if (config["linter"] && config["linter"]["ghdl"] && config["linter"]["ghdl"]["arguments"] !== undefined) {
        document.getElementById("linter-ghdl-arguments").value = config["linter"]["ghdl"]["arguments"];
    }
    if (config["linter"] && config["linter"]["icarus"] && config["linter"]["icarus"]["arguments"] !== undefined) {
        document.getElementById("linter-icarus-arguments").value = config["linter"]["icarus"]["arguments"];
    }
    if (config["linter"] && config["linter"]["modelsim"] && config["linter"]["modelsim"]["vhdl_arguments"] !== undefined) {
        document.getElementById("linter-modelsim-vhdl_arguments").value = config["linter"]["modelsim"]["vhdl_arguments"];
    }
    if (config["linter"] && config["linter"]["modelsim"] && config["linter"]["modelsim"]["verilog_arguments"] !== undefined) {
        document.getElementById("linter-modelsim-verilog_arguments").value = config["linter"]["modelsim"]["verilog_arguments"];
    }
    if (config["linter"] && config["linter"]["verible"] && config["linter"]["verible"]["arguments"] !== undefined) {
        document.getElementById("linter-verible-arguments").value = config["linter"]["verible"]["arguments"];
    }
    if (config["linter"] && config["linter"]["verilator"] && config["linter"]["verilator"]["arguments"] !== undefined) {
        document.getElementById("linter-verilator-arguments").value = config["linter"]["verilator"]["arguments"];
    }
    if (config["linter"] && config["linter"]["vivado"] && config["linter"]["vivado"]["vhdl_arguments"] !== undefined) {
        document.getElementById("linter-vivado-vhdl_arguments").value = config["linter"]["vivado"]["vhdl_arguments"];
    }
    if (config["linter"] && config["linter"]["vivado"] && config["linter"]["vivado"]["verilog_arguments"] !== undefined) {
        document.getElementById("linter-vivado-verilog_arguments").value = config["linter"]["vivado"]["verilog_arguments"];
    }
    if (config["schematic"] && config["schematic"]["general"] && config["schematic"]["general"]["backend"] !== undefined) {
        document.getElementById("schematic-general-backend").value = config["schematic"]["general"]["backend"];
    }
    if (config["schematic"] && config["schematic"]["general"] && config["schematic"]["general"]["extra"] !== undefined) {
        document.getElementById("schematic-general-extra").value = config["schematic"]["general"]["extra"];
    }
    if (config["schematic"] && config["schematic"]["general"] && config["schematic"]["general"]["args"] !== undefined) {
        document.getElementById("schematic-general-args").value = config["schematic"]["general"]["args"];
    }
    if (config["schematic"] && config["schematic"]["general"] && config["schematic"]["general"]["args_ghdl"] !== undefined) {
        document.getElementById("schematic-general-args_ghdl").value = config["schematic"]["general"]["args_ghdl"];
    }
    if (config["templates"] && config["templates"]["general"] && config["templates"]["general"]["header_file_path"] !== undefined) {
        document.getElementById("templates-general-header_file_path").value = config["templates"]["general"]["header_file_path"];
    }
    if (config["templates"] && config["templates"]["general"] && config["templates"]["general"]["indent"] !== undefined) {
        document.getElementById("templates-general-indent").value = config["templates"]["general"]["indent"];
    }
    if (config["templates"] && config["templates"]["general"] && config["templates"]["general"]["clock_generation_style"] !== undefined) {
        document.getElementById("templates-general-clock_generation_style").value = config["templates"]["general"]["clock_generation_style"];
    }
    if (config["templates"] && config["templates"]["general"] && config["templates"]["general"]["instance_style"] !== undefined) {
        document.getElementById("templates-general-instance_style").value = config["templates"]["general"]["instance_style"];
    }
    if (config["tools"] && config["tools"]["general"] && config["tools"]["general"]["select_tool"] !== undefined) {
        document.getElementById("tools-general-select_tool").value = config["tools"]["general"]["select_tool"];
    }
    if (config["tools"] && config["tools"]["general"] && config["tools"]["general"]["manual_compilation_order"] !== undefined) {
        document.getElementById("tools-general-manual_compilation_order").value = config["tools"]["general"]["manual_compilation_order"];
    }
    if (config["tools"] && config["tools"]["general"] && config["tools"]["general"]["execution_mode"] !== undefined) {
        document.getElementById("tools-general-execution_mode").value = config["tools"]["general"]["execution_mode"];
    }
    if (config["tools"] && config["tools"]["general"] && config["tools"]["general"]["waveform_viewer"] !== undefined) {
        document.getElementById("tools-general-waveform_viewer").value = config["tools"]["general"]["waveform_viewer"];
    }
    if (config["tools"] && config["tools"]["general"] && config["tools"]["general"]["gtkwave_installation_path"] !== undefined) {
        document.getElementById("tools-general-gtkwave_installation_path").value = config["tools"]["general"]["gtkwave_installation_path"];
    }
    if (config["tools"] && config["tools"]["general"] && config["tools"]["general"]["gtkwave_extra_arguments"] !== undefined) {
        document.getElementById("tools-general-gtkwave_extra_arguments").value = config["tools"]["general"]["gtkwave_extra_arguments"];
    }
    if (config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["installation_path"] !== undefined) {
        document.getElementById("tools-quartus-installation_path").value = config["tools"]["quartus"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["family"] !== undefined) {
        document.getElementById("tools-quartus-family").value = config["tools"]["quartus"]["family"];
    }
    if (config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["device"] !== undefined) {
        document.getElementById("tools-quartus-device").value = config["tools"]["quartus"]["device"];
    }
    if (config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["optimization_mode"] !== undefined) {
        document.getElementById("tools-quartus-optimization_mode").value = config["tools"]["quartus"]["optimization_mode"];
    }
    if (config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["allow_register_retiming"] !== undefined) {
        document.getElementById("tools-quartus-allow_register_retiming").checked = config["tools"]["quartus"]["allow_register_retiming"];
    }
    if (config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["wave_file_questa"] !== undefined) {
        document.getElementById("tools-quartus-wave_file_questa").value = config["tools"]["quartus"]["wave_file_questa"];
    }
    if (config["tools"] && config["tools"]["vsg"] && config["tools"]["vsg"]["installation_path"] !== undefined) {
        document.getElementById("tools-vsg-installation_path").value = config["tools"]["vsg"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["vsg"] && config["tools"]["vsg"]["style_config"] !== undefined) {
        document.getElementById("tools-vsg-style_config").value = config["tools"]["vsg"]["style_config"];
    }
    if (config["tools"] && config["tools"]["vsg"] && config["tools"]["vsg"]["core_number"] !== undefined) {
        document.getElementById("tools-vsg-core_number").value = config["tools"]["vsg"]["core_number"];
    }
    if (config["tools"] && config["tools"]["vsg"] && config["tools"]["vsg"]["aditional_arguments"] !== undefined) {
        document.getElementById("tools-vsg-aditional_arguments").value = config["tools"]["vsg"]["aditional_arguments"];
    }
    if (config["tools"] && config["tools"]["osvvm"] && config["tools"]["osvvm"]["installation_path"] !== undefined) {
        document.getElementById("tools-osvvm-installation_path").value = config["tools"]["osvvm"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["osvvm"] && config["tools"]["osvvm"]["tclsh_binary"] !== undefined) {
        document.getElementById("tools-osvvm-tclsh_binary").value = config["tools"]["osvvm"]["tclsh_binary"];
    }
    if (config["tools"] && config["tools"]["osvvm"] && config["tools"]["osvvm"]["simulator_name"] !== undefined) {
        document.getElementById("tools-osvvm-simulator_name").value = config["tools"]["osvvm"]["simulator_name"];
    }
    if (config["tools"] && config["tools"]["ascenlint"] && config["tools"]["ascenlint"]["installation_path"] !== undefined) {
        document.getElementById("tools-ascenlint-installation_path").value = config["tools"]["ascenlint"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["ascenlint"] && config["tools"]["ascenlint"]["ascentlint_options"] !== undefined) {
        element_value = document.getElementById("tools-ascenlint-ascentlint_options").value = String(config["tools"]["ascenlint"]["ascentlint_options"]);
    }
    if (config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["installation_path"] !== undefined) {
        document.getElementById("tools-cocotb-installation_path").value = config["tools"]["cocotb"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["simulator_name"] !== undefined) {
        document.getElementById("tools-cocotb-simulator_name").value = config["tools"]["cocotb"]["simulator_name"];
    }
    if (config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["compile_args"] !== undefined) {
        document.getElementById("tools-cocotb-compile_args").value = config["tools"]["cocotb"]["compile_args"];
    }
    if (config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["run_args"] !== undefined) {
        document.getElementById("tools-cocotb-run_args").value = config["tools"]["cocotb"]["run_args"];
    }
    if (config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["plusargs"] !== undefined) {
        document.getElementById("tools-cocotb-plusargs").value = config["tools"]["cocotb"]["plusargs"];
    }
    if (config["tools"] && config["tools"]["diamond"] && config["tools"]["diamond"]["installation_path"] !== undefined) {
        document.getElementById("tools-diamond-installation_path").value = config["tools"]["diamond"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["diamond"] && config["tools"]["diamond"]["part"] !== undefined) {
        document.getElementById("tools-diamond-part").value = config["tools"]["diamond"]["part"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["installation_path"] !== undefined) {
        document.getElementById("tools-ghdl-installation_path").value = config["tools"]["ghdl"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vhdl_standard"] !== undefined) {
        document.getElementById("tools-ghdl-vhdl_standard").value = config["tools"]["ghdl"]["vhdl_standard"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["ieee_library"] !== undefined) {
        document.getElementById("tools-ghdl-ieee_library").value = config["tools"]["ghdl"]["ieee_library"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["relaxed_parsing"] !== undefined) {
        document.getElementById("tools-ghdl-relaxed_parsing").checked = config["tools"]["ghdl"]["relaxed_parsing"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["unicode_support"] !== undefined) {
        document.getElementById("tools-ghdl-unicode_support").checked = config["tools"]["ghdl"]["unicode_support"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["psl_enabled"] !== undefined) {
        document.getElementById("tools-ghdl-psl_enabled").checked = config["tools"]["ghdl"]["psl_enabled"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["work_library"] !== undefined) {
        document.getElementById("tools-ghdl-work_library").value = config["tools"]["ghdl"]["work_library"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["library_paths"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-library_paths").value = String(config["tools"]["ghdl"]["library_paths"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["check_syntax_options"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-check_syntax_options").value = String(config["tools"]["ghdl"]["check_syntax_options"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["analyze_options"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-analyze_options").value = String(config["tools"]["ghdl"]["analyze_options"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["elaborate_options"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-elaborate_options").value = String(config["tools"]["ghdl"]["elaborate_options"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["run_options"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-run_options").value = String(config["tools"]["ghdl"]["run_options"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["synthesis_options"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-synthesis_options").value = String(config["tools"]["ghdl"]["synthesis_options"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["extra_flags"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-extra_flags").value = String(config["tools"]["ghdl"]["extra_flags"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["relaxed_rules"] !== undefined) {
        document.getElementById("tools-ghdl-relaxed_rules").checked = config["tools"]["ghdl"]["relaxed_rules"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["bind_checks"] !== undefined) {
        document.getElementById("tools-ghdl-bind_checks").checked = config["tools"]["ghdl"]["bind_checks"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vital_checks"] !== undefined) {
        document.getElementById("tools-ghdl-vital_checks").checked = config["tools"]["ghdl"]["vital_checks"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["simulation_time"] !== undefined) {
        document.getElementById("tools-ghdl-simulation_time").value = config["tools"]["ghdl"]["simulation_time"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["resolution_limit"] !== undefined) {
        document.getElementById("tools-ghdl-resolution_limit").value = config["tools"]["ghdl"]["resolution_limit"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["stack_size"] !== undefined) {
        document.getElementById("tools-ghdl-stack_size").value = config["tools"]["ghdl"]["stack_size"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["stop_delta_cycles"] !== undefined) {
        document.getElementById("tools-ghdl-stop_delta_cycles").value = config["tools"]["ghdl"]["stop_delta_cycles"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["waveform_enabled"] !== undefined) {
        document.getElementById("tools-ghdl-waveform_enabled").checked = config["tools"]["ghdl"]["waveform_enabled"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["waveform_format"] !== undefined) {
        document.getElementById("tools-ghdl-waveform_format").value = config["tools"]["ghdl"]["waveform_format"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["waveform_options"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-waveform_options").value = String(config["tools"]["ghdl"]["waveform_options"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["wave_start_time"] !== undefined) {
        document.getElementById("tools-ghdl-wave_start_time").value = config["tools"]["ghdl"]["wave_start_time"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vcd_4states"] !== undefined) {
        document.getElementById("tools-ghdl-vcd_4states").checked = config["tools"]["ghdl"]["vcd_4states"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vcd_nodate"] !== undefined) {
        document.getElementById("tools-ghdl-vcd_nodate").checked = config["tools"]["ghdl"]["vcd_nodate"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["read_wave_opt"] !== undefined) {
        document.getElementById("tools-ghdl-read_wave_opt").value = config["tools"]["ghdl"]["read_wave_opt"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["write_wave_opt"] !== undefined) {
        document.getElementById("tools-ghdl-write_wave_opt").value = config["tools"]["ghdl"]["write_wave_opt"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["debug_level"] !== undefined) {
        document.getElementById("tools-ghdl-debug_level").value = config["tools"]["ghdl"]["debug_level"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["verbose"] !== undefined) {
        document.getElementById("tools-ghdl-verbose").checked = config["tools"]["ghdl"]["verbose"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["warnings_as_errors"] !== undefined) {
        document.getElementById("tools-ghdl-warnings_as_errors").checked = config["tools"]["ghdl"]["warnings_as_errors"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["suppress_warnings"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-suppress_warnings").value = String(config["tools"]["ghdl"]["suppress_warnings"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["assert_level"] !== undefined) {
        document.getElementById("tools-ghdl-assert_level").value = config["tools"]["ghdl"]["assert_level"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["display_time"] !== undefined) {
        document.getElementById("tools-ghdl-display_time").checked = config["tools"]["ghdl"]["display_time"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["unbuffered_output"] !== undefined) {
        document.getElementById("tools-ghdl-unbuffered_output").checked = config["tools"]["ghdl"]["unbuffered_output"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["max_stack_alloc"] !== undefined) {
        document.getElementById("tools-ghdl-max_stack_alloc").value = config["tools"]["ghdl"]["max_stack_alloc"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["backtrace_severity"] !== undefined) {
        document.getElementById("tools-ghdl-backtrace_severity").value = config["tools"]["ghdl"]["backtrace_severity"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["ieee_asserts"] !== undefined) {
        document.getElementById("tools-ghdl-ieee_asserts").value = config["tools"]["ghdl"]["ieee_asserts"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["asserts_policy"] !== undefined) {
        document.getElementById("tools-ghdl-asserts_policy").value = config["tools"]["ghdl"]["asserts_policy"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["sdf_file"] !== undefined) {
        document.getElementById("tools-ghdl-sdf_file").value = config["tools"]["ghdl"]["sdf_file"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vpi_modules"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-vpi_modules").value = String(config["tools"]["ghdl"]["vpi_modules"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vhpi_modules"] !== undefined) {
        element_value = document.getElementById("tools-ghdl-vhpi_modules").value = String(config["tools"]["ghdl"]["vhpi_modules"]);
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vpi_trace_file"] !== undefined) {
        document.getElementById("tools-ghdl-vpi_trace_file").value = config["tools"]["ghdl"]["vpi_trace_file"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vhpi_trace_file"] !== undefined) {
        document.getElementById("tools-ghdl-vhpi_trace_file").value = config["tools"]["ghdl"]["vhpi_trace_file"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["psl_report_file"] !== undefined) {
        document.getElementById("tools-ghdl-psl_report_file").value = config["tools"]["ghdl"]["psl_report_file"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["psl_report_uncovered"] !== undefined) {
        document.getElementById("tools-ghdl-psl_report_uncovered").checked = config["tools"]["ghdl"]["psl_report_uncovered"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["disp_tree"] !== undefined) {
        document.getElementById("tools-ghdl-disp_tree").value = config["tools"]["ghdl"]["disp_tree"];
    }
    if (config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["no_run"] !== undefined) {
        document.getElementById("tools-ghdl-no_run").checked = config["tools"]["ghdl"]["no_run"];
    }
    if (config["tools"] && config["tools"]["icarus"] && config["tools"]["icarus"]["installation_path"] !== undefined) {
        document.getElementById("tools-icarus-installation_path").value = config["tools"]["icarus"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["icarus"] && config["tools"]["icarus"]["timescale"] !== undefined) {
        document.getElementById("tools-icarus-timescale").value = config["tools"]["icarus"]["timescale"];
    }
    if (config["tools"] && config["tools"]["icarus"] && config["tools"]["icarus"]["iverilog_options"] !== undefined) {
        element_value = document.getElementById("tools-icarus-iverilog_options").value = String(config["tools"]["icarus"]["iverilog_options"]);
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["installation_path"] !== undefined) {
        document.getElementById("tools-icestorm-installation_path").value = config["tools"]["icestorm"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["pnr"] !== undefined) {
        document.getElementById("tools-icestorm-pnr").value = config["tools"]["icestorm"]["pnr"];
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["arch"] !== undefined) {
        document.getElementById("tools-icestorm-arch").value = config["tools"]["icestorm"]["arch"];
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["output_format"] !== undefined) {
        document.getElementById("tools-icestorm-output_format").value = config["tools"]["icestorm"]["output_format"];
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["yosys_as_subtool"] !== undefined) {
        document.getElementById("tools-icestorm-yosys_as_subtool").checked = config["tools"]["icestorm"]["yosys_as_subtool"];
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["makefile_name"] !== undefined) {
        document.getElementById("tools-icestorm-makefile_name").value = config["tools"]["icestorm"]["makefile_name"];
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["arachne_pnr_options"] !== undefined) {
        element_value = document.getElementById("tools-icestorm-arachne_pnr_options").value = String(config["tools"]["icestorm"]["arachne_pnr_options"]);
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["nextpnr_options"] !== undefined) {
        element_value = document.getElementById("tools-icestorm-nextpnr_options").value = String(config["tools"]["icestorm"]["nextpnr_options"]);
    }
    if (config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["yosys_synth_options"] !== undefined) {
        element_value = document.getElementById("tools-icestorm-yosys_synth_options").value = String(config["tools"]["icestorm"]["yosys_synth_options"]);
    }
    if (config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["installation_path"] !== undefined) {
        document.getElementById("tools-ise-installation_path").value = config["tools"]["ise"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["family"] !== undefined) {
        document.getElementById("tools-ise-family").value = config["tools"]["ise"]["family"];
    }
    if (config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["device"] !== undefined) {
        document.getElementById("tools-ise-device").value = config["tools"]["ise"]["device"];
    }
    if (config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["package"] !== undefined) {
        document.getElementById("tools-ise-package").value = config["tools"]["ise"]["package"];
    }
    if (config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["speed"] !== undefined) {
        document.getElementById("tools-ise-speed").value = config["tools"]["ise"]["speed"];
    }
    if (config["tools"] && config["tools"]["isem"] && config["tools"]["isem"]["installation_path"] !== undefined) {
        document.getElementById("tools-isem-installation_path").value = config["tools"]["isem"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["isem"] && config["tools"]["isem"]["fuse_options"] !== undefined) {
        element_value = document.getElementById("tools-isem-fuse_options").value = String(config["tools"]["isem"]["fuse_options"]);
    }
    if (config["tools"] && config["tools"]["isem"] && config["tools"]["isem"]["isim_options"] !== undefined) {
        element_value = document.getElementById("tools-isem-isim_options").value = String(config["tools"]["isem"]["isim_options"]);
    }
    if (config["tools"] && config["tools"]["modelsim"] && config["tools"]["modelsim"]["installation_path"] !== undefined) {
        document.getElementById("tools-modelsim-installation_path").value = config["tools"]["modelsim"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["modelsim"] && config["tools"]["modelsim"]["vcom_options"] !== undefined) {
        element_value = document.getElementById("tools-modelsim-vcom_options").value = String(config["tools"]["modelsim"]["vcom_options"]);
    }
    if (config["tools"] && config["tools"]["modelsim"] && config["tools"]["modelsim"]["vlog_options"] !== undefined) {
        element_value = document.getElementById("tools-modelsim-vlog_options").value = String(config["tools"]["modelsim"]["vlog_options"]);
    }
    if (config["tools"] && config["tools"]["modelsim"] && config["tools"]["modelsim"]["vsim_options"] !== undefined) {
        element_value = document.getElementById("tools-modelsim-vsim_options").value = String(config["tools"]["modelsim"]["vsim_options"]);
    }
    if (config["tools"] && config["tools"]["morty"] && config["tools"]["morty"]["installation_path"] !== undefined) {
        document.getElementById("tools-morty-installation_path").value = config["tools"]["morty"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["morty"] && config["tools"]["morty"]["morty_options"] !== undefined) {
        element_value = document.getElementById("tools-morty-morty_options").value = String(config["tools"]["morty"]["morty_options"]);
    }
    if (config["tools"] && config["tools"]["radiant"] && config["tools"]["radiant"]["installation_path"] !== undefined) {
        document.getElementById("tools-radiant-installation_path").value = config["tools"]["radiant"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["radiant"] && config["tools"]["radiant"]["part"] !== undefined) {
        document.getElementById("tools-radiant-part").value = config["tools"]["radiant"]["part"];
    }
    if (config["tools"] && config["tools"]["rivierapro"] && config["tools"]["rivierapro"]["installation_path"] !== undefined) {
        document.getElementById("tools-rivierapro-installation_path").value = config["tools"]["rivierapro"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["rivierapro"] && config["tools"]["rivierapro"]["compilation_mode"] !== undefined) {
        document.getElementById("tools-rivierapro-compilation_mode").value = config["tools"]["rivierapro"]["compilation_mode"];
    }
    if (config["tools"] && config["tools"]["rivierapro"] && config["tools"]["rivierapro"]["vlog_options"] !== undefined) {
        element_value = document.getElementById("tools-rivierapro-vlog_options").value = String(config["tools"]["rivierapro"]["vlog_options"]);
    }
    if (config["tools"] && config["tools"]["rivierapro"] && config["tools"]["rivierapro"]["vsim_options"] !== undefined) {
        element_value = document.getElementById("tools-rivierapro-vsim_options").value = String(config["tools"]["rivierapro"]["vsim_options"]);
    }
    if (config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["installation_path"] !== undefined) {
        document.getElementById("tools-siliconcompiler-installation_path").value = config["tools"]["siliconcompiler"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["target"] !== undefined) {
        document.getElementById("tools-siliconcompiler-target").value = config["tools"]["siliconcompiler"]["target"];
    }
    if (config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["server_enable"] !== undefined) {
        document.getElementById("tools-siliconcompiler-server_enable").checked = config["tools"]["siliconcompiler"]["server_enable"];
    }
    if (config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["server_address"] !== undefined) {
        document.getElementById("tools-siliconcompiler-server_address").value = config["tools"]["siliconcompiler"]["server_address"];
    }
    if (config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["server_username"] !== undefined) {
        document.getElementById("tools-siliconcompiler-server_username").value = config["tools"]["siliconcompiler"]["server_username"];
    }
    if (config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["server_password"] !== undefined) {
        document.getElementById("tools-siliconcompiler-server_password").value = config["tools"]["siliconcompiler"]["server_password"];
    }
    if (config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["installation_path"] !== undefined) {
        document.getElementById("tools-spyglass-installation_path").value = config["tools"]["spyglass"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["methodology"] !== undefined) {
        document.getElementById("tools-spyglass-methodology").value = config["tools"]["spyglass"]["methodology"];
    }
    if (config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["goals"] !== undefined) {
        element_value = document.getElementById("tools-spyglass-goals").value = String(config["tools"]["spyglass"]["goals"]);
    }
    if (config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["spyglass_options"] !== undefined) {
        element_value = document.getElementById("tools-spyglass-spyglass_options").value = String(config["tools"]["spyglass"]["spyglass_options"]);
    }
    if (config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["rule_parameters"] !== undefined) {
        element_value = document.getElementById("tools-spyglass-rule_parameters").value = String(config["tools"]["spyglass"]["rule_parameters"]);
    }
    if (config["tools"] && config["tools"]["symbiyosys"] && config["tools"]["symbiyosys"]["installation_path"] !== undefined) {
        document.getElementById("tools-symbiyosys-installation_path").value = config["tools"]["symbiyosys"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["symbiyosys"] && config["tools"]["symbiyosys"]["tasknames"] !== undefined) {
        element_value = document.getElementById("tools-symbiyosys-tasknames").value = String(config["tools"]["symbiyosys"]["tasknames"]);
    }
    if (config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["installation_path"] !== undefined) {
        document.getElementById("tools-symbiflow-installation_path").value = config["tools"]["symbiflow"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["package"] !== undefined) {
        document.getElementById("tools-symbiflow-package").value = config["tools"]["symbiflow"]["package"];
    }
    if (config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["part"] !== undefined) {
        document.getElementById("tools-symbiflow-part").value = config["tools"]["symbiflow"]["part"];
    }
    if (config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["vendor"] !== undefined) {
        document.getElementById("tools-symbiflow-vendor").value = config["tools"]["symbiflow"]["vendor"];
    }
    if (config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["pnr"] !== undefined) {
        document.getElementById("tools-symbiflow-pnr").value = config["tools"]["symbiflow"]["pnr"];
    }
    if (config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["vpr_options"] !== undefined) {
        document.getElementById("tools-symbiflow-vpr_options").value = config["tools"]["symbiflow"]["vpr_options"];
    }
    if (config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["environment_script"] !== undefined) {
        document.getElementById("tools-symbiflow-environment_script").value = config["tools"]["symbiflow"]["environment_script"];
    }
    if (config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["installation_path"] !== undefined) {
        document.getElementById("tools-trellis-installation_path").value = config["tools"]["trellis"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["arch"] !== undefined) {
        document.getElementById("tools-trellis-arch").value = config["tools"]["trellis"]["arch"];
    }
    if (config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["output_format"] !== undefined) {
        document.getElementById("tools-trellis-output_format").value = config["tools"]["trellis"]["output_format"];
    }
    if (config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["yosys_as_subtool"] !== undefined) {
        document.getElementById("tools-trellis-yosys_as_subtool").checked = config["tools"]["trellis"]["yosys_as_subtool"];
    }
    if (config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["makefile_name"] !== undefined) {
        document.getElementById("tools-trellis-makefile_name").value = config["tools"]["trellis"]["makefile_name"];
    }
    if (config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["script_name"] !== undefined) {
        document.getElementById("tools-trellis-script_name").value = config["tools"]["trellis"]["script_name"];
    }
    if (config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["nextpnr_options"] !== undefined) {
        element_value = document.getElementById("tools-trellis-nextpnr_options").value = String(config["tools"]["trellis"]["nextpnr_options"]);
    }
    if (config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["yosys_synth_options"] !== undefined) {
        element_value = document.getElementById("tools-trellis-yosys_synth_options").value = String(config["tools"]["trellis"]["yosys_synth_options"]);
    }
    if (config["tools"] && config["tools"]["vcs"] && config["tools"]["vcs"]["installation_path"] !== undefined) {
        document.getElementById("tools-vcs-installation_path").value = config["tools"]["vcs"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["vcs"] && config["tools"]["vcs"]["vcs_options"] !== undefined) {
        element_value = document.getElementById("tools-vcs-vcs_options").value = String(config["tools"]["vcs"]["vcs_options"]);
    }
    if (config["tools"] && config["tools"]["vcs"] && config["tools"]["vcs"]["run_options"] !== undefined) {
        element_value = document.getElementById("tools-vcs-run_options").value = String(config["tools"]["vcs"]["run_options"]);
    }
    if (config["tools"] && config["tools"]["verible"] && config["tools"]["verible"]["installation_path"] !== undefined) {
        document.getElementById("tools-verible-installation_path").value = config["tools"]["verible"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["installation_path"] !== undefined) {
        document.getElementById("tools-verilator-installation_path").value = config["tools"]["verilator"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["mode"] !== undefined) {
        document.getElementById("tools-verilator-mode").value = config["tools"]["verilator"]["mode"];
    }
    if (config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["libs"] !== undefined) {
        element_value = document.getElementById("tools-verilator-libs").value = String(config["tools"]["verilator"]["libs"]);
    }
    if (config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["verilator_options"] !== undefined) {
        element_value = document.getElementById("tools-verilator-verilator_options").value = String(config["tools"]["verilator"]["verilator_options"]);
    }
    if (config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["make_options"] !== undefined) {
        element_value = document.getElementById("tools-verilator-make_options").value = String(config["tools"]["verilator"]["make_options"]);
    }
    if (config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["run_options"] !== undefined) {
        element_value = document.getElementById("tools-verilator-run_options").value = String(config["tools"]["verilator"]["run_options"]);
    }
    if (config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["installation_path"] !== undefined) {
        document.getElementById("tools-vivado-installation_path").value = config["tools"]["vivado"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["part"] !== undefined) {
        document.getElementById("tools-vivado-part").value = config["tools"]["vivado"]["part"];
    }
    if (config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["synth"] !== undefined) {
        document.getElementById("tools-vivado-synth").value = config["tools"]["vivado"]["synth"];
    }
    if (config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["pnr"] !== undefined) {
        document.getElementById("tools-vivado-pnr").value = config["tools"]["vivado"]["pnr"];
    }
    if (config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["jtag_freq"] !== undefined) {
        document.getElementById("tools-vivado-jtag_freq").value = config["tools"]["vivado"]["jtag_freq"];
    }
    if (config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["hw_target"] !== undefined) {
        document.getElementById("tools-vivado-hw_target").value = config["tools"]["vivado"]["hw_target"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["installation_path"] !== undefined) {
        document.getElementById("tools-vunit-installation_path").value = config["tools"]["vunit"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["simulator_name"] !== undefined) {
        document.getElementById("tools-vunit-simulator_name").value = config["tools"]["vunit"]["simulator_name"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["runpy_mode"] !== undefined) {
        document.getElementById("tools-vunit-runpy_mode").value = config["tools"]["vunit"]["runpy_mode"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["extra_options"] !== undefined) {
        document.getElementById("tools-vunit-extra_options").value = config["tools"]["vunit"]["extra_options"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_array_util_lib"] !== undefined) {
        document.getElementById("tools-vunit-enable_array_util_lib").checked = config["tools"]["vunit"]["enable_array_util_lib"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_com_lib"] !== undefined) {
        document.getElementById("tools-vunit-enable_com_lib").checked = config["tools"]["vunit"]["enable_com_lib"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_json4vhdl_lib"] !== undefined) {
        document.getElementById("tools-vunit-enable_json4vhdl_lib").checked = config["tools"]["vunit"]["enable_json4vhdl_lib"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_osvvm_lib"] !== undefined) {
        document.getElementById("tools-vunit-enable_osvvm_lib").checked = config["tools"]["vunit"]["enable_osvvm_lib"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_random_lib"] !== undefined) {
        document.getElementById("tools-vunit-enable_random_lib").checked = config["tools"]["vunit"]["enable_random_lib"];
    }
    if (config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_verification_components_lib"] !== undefined) {
        document.getElementById("tools-vunit-enable_verification_components_lib").checked = config["tools"]["vunit"]["enable_verification_components_lib"];
    }
    if (config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["installation_path"] !== undefined) {
        document.getElementById("tools-xcelium-installation_path").value = config["tools"]["xcelium"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["xmvhdl_options"] !== undefined) {
        element_value = document.getElementById("tools-xcelium-xmvhdl_options").value = String(config["tools"]["xcelium"]["xmvhdl_options"]);
    }
    if (config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["xmvlog_options"] !== undefined) {
        element_value = document.getElementById("tools-xcelium-xmvlog_options").value = String(config["tools"]["xcelium"]["xmvlog_options"]);
    }
    if (config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["xmsim_options"] !== undefined) {
        element_value = document.getElementById("tools-xcelium-xmsim_options").value = String(config["tools"]["xcelium"]["xmsim_options"]);
    }
    if (config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["xrun_options"] !== undefined) {
        element_value = document.getElementById("tools-xcelium-xrun_options").value = String(config["tools"]["xcelium"]["xrun_options"]);
    }
    if (config["tools"] && config["tools"]["xsim"] && config["tools"]["xsim"]["installation_path"] !== undefined) {
        document.getElementById("tools-xsim-installation_path").value = config["tools"]["xsim"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["xsim"] && config["tools"]["xsim"]["xelab_options"] !== undefined) {
        element_value = document.getElementById("tools-xsim-xelab_options").value = String(config["tools"]["xsim"]["xelab_options"]);
    }
    if (config["tools"] && config["tools"]["xsim"] && config["tools"]["xsim"]["xsim_options"] !== undefined) {
        element_value = document.getElementById("tools-xsim-xsim_options").value = String(config["tools"]["xsim"]["xsim_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["installation_path"] !== undefined) {
        document.getElementById("tools-yosys-installation_path").value = config["tools"]["yosys"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["read_verilog_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-read_verilog_options").value = String(config["tools"]["yosys"]["read_verilog_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["read_systemverilog_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-read_systemverilog_options").value = String(config["tools"]["yosys"]["read_systemverilog_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["read_liberty_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-read_liberty_options").value = String(config["tools"]["yosys"]["read_liberty_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["hierarchy_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-hierarchy_options").value = String(config["tools"]["yosys"]["hierarchy_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["proc_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-proc_options").value = String(config["tools"]["yosys"]["proc_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["opt_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-opt_options").value = String(config["tools"]["yosys"]["opt_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["flatten_enabled"] !== undefined) {
        document.getElementById("tools-yosys-flatten_enabled").checked = config["tools"]["yosys"]["flatten_enabled"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["flatten_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-flatten_options").value = String(config["tools"]["yosys"]["flatten_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["memory_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-memory_options").value = String(config["tools"]["yosys"]["memory_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["fsm_enabled"] !== undefined) {
        document.getElementById("tools-yosys-fsm_enabled").checked = config["tools"]["yosys"]["fsm_enabled"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["fsm_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-fsm_options").value = String(config["tools"]["yosys"]["fsm_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["techmap_enabled"] !== undefined) {
        document.getElementById("tools-yosys-techmap_enabled").checked = config["tools"]["yosys"]["techmap_enabled"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["techmap_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-techmap_options").value = String(config["tools"]["yosys"]["techmap_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["abc_enabled"] !== undefined) {
        document.getElementById("tools-yosys-abc_enabled").checked = config["tools"]["yosys"]["abc_enabled"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["abc_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-abc_options").value = String(config["tools"]["yosys"]["abc_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["synthesis_target"] !== undefined) {
        document.getElementById("tools-yosys-synthesis_target").value = config["tools"]["yosys"]["synthesis_target"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_device"] !== undefined) {
        document.getElementById("tools-yosys-ice40_device").value = config["tools"]["yosys"]["ice40_device"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_top_module"] !== undefined) {
        document.getElementById("tools-yosys-ice40_top_module").value = config["tools"]["yosys"]["ice40_top_module"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_output_blif"] !== undefined) {
        document.getElementById("tools-yosys-ice40_output_blif").value = config["tools"]["yosys"]["ice40_output_blif"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_output_edif"] !== undefined) {
        document.getElementById("tools-yosys-ice40_output_edif").value = config["tools"]["yosys"]["ice40_output_edif"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_output_json"] !== undefined) {
        document.getElementById("tools-yosys-ice40_output_json").value = config["tools"]["yosys"]["ice40_output_json"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_noflatten"] !== undefined) {
        document.getElementById("tools-yosys-ice40_noflatten").checked = config["tools"]["yosys"]["ice40_noflatten"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_dff"] !== undefined) {
        document.getElementById("tools-yosys-ice40_dff").checked = config["tools"]["yosys"]["ice40_dff"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_retime"] !== undefined) {
        document.getElementById("tools-yosys-ice40_retime").checked = config["tools"]["yosys"]["ice40_retime"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_nocarry"] !== undefined) {
        document.getElementById("tools-yosys-ice40_nocarry").checked = config["tools"]["yosys"]["ice40_nocarry"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_nodffe"] !== undefined) {
        document.getElementById("tools-yosys-ice40_nodffe").checked = config["tools"]["yosys"]["ice40_nodffe"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_dffe_min_ce_use"] !== undefined) {
        document.getElementById("tools-yosys-ice40_dffe_min_ce_use").value = config["tools"]["yosys"]["ice40_dffe_min_ce_use"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_nobram"] !== undefined) {
        document.getElementById("tools-yosys-ice40_nobram").checked = config["tools"]["yosys"]["ice40_nobram"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_spram"] !== undefined) {
        document.getElementById("tools-yosys-ice40_spram").checked = config["tools"]["yosys"]["ice40_spram"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_dsp"] !== undefined) {
        document.getElementById("tools-yosys-ice40_dsp").checked = config["tools"]["yosys"]["ice40_dsp"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_noabc"] !== undefined) {
        document.getElementById("tools-yosys-ice40_noabc").checked = config["tools"]["yosys"]["ice40_noabc"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_abc2"] !== undefined) {
        document.getElementById("tools-yosys-ice40_abc2").checked = config["tools"]["yosys"]["ice40_abc2"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_vpr"] !== undefined) {
        document.getElementById("tools-yosys-ice40_vpr").checked = config["tools"]["yosys"]["ice40_vpr"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_noabc9"] !== undefined) {
        document.getElementById("tools-yosys-ice40_noabc9").checked = config["tools"]["yosys"]["ice40_noabc9"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_flowmap"] !== undefined) {
        document.getElementById("tools-yosys-ice40_flowmap").checked = config["tools"]["yosys"]["ice40_flowmap"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_no_rw_check"] !== undefined) {
        document.getElementById("tools-yosys-ice40_no_rw_check").checked = config["tools"]["yosys"]["ice40_no_rw_check"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_top_module"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_top_module").value = config["tools"]["yosys"]["ecp5_top_module"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_output_blif"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_output_blif").value = config["tools"]["yosys"]["ecp5_output_blif"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_output_edif"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_output_edif").value = config["tools"]["yosys"]["ecp5_output_edif"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_output_json"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_output_json").value = config["tools"]["yosys"]["ecp5_output_json"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_noflatten"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_noflatten").checked = config["tools"]["yosys"]["ecp5_noflatten"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_dff"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_dff").checked = config["tools"]["yosys"]["ecp5_dff"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_retime"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_retime").checked = config["tools"]["yosys"]["ecp5_retime"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_noccu2"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_noccu2").checked = config["tools"]["yosys"]["ecp5_noccu2"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nodffe"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_nodffe").checked = config["tools"]["yosys"]["ecp5_nodffe"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nobram"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_nobram").checked = config["tools"]["yosys"]["ecp5_nobram"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nolutram"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_nolutram").checked = config["tools"]["yosys"]["ecp5_nolutram"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nowidelut"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_nowidelut").checked = config["tools"]["yosys"]["ecp5_nowidelut"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_asyncprld"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_asyncprld").checked = config["tools"]["yosys"]["ecp5_asyncprld"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_abc2"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_abc2").checked = config["tools"]["yosys"]["ecp5_abc2"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_noabc9"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_noabc9").checked = config["tools"]["yosys"]["ecp5_noabc9"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_vpr"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_vpr").checked = config["tools"]["yosys"]["ecp5_vpr"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_iopad"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_iopad").checked = config["tools"]["yosys"]["ecp5_iopad"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nodsp"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_nodsp").checked = config["tools"]["yosys"]["ecp5_nodsp"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_no_rw_check"] !== undefined) {
        document.getElementById("tools-yosys-ecp5_no_rw_check").checked = config["tools"]["yosys"]["ecp5_no_rw_check"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["verbose"] !== undefined) {
        document.getElementById("tools-yosys-verbose").checked = config["tools"]["yosys"]["verbose"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["debug_level"] !== undefined) {
        document.getElementById("tools-yosys-debug_level").value = config["tools"]["yosys"]["debug_level"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["log_file"] !== undefined) {
        document.getElementById("tools-yosys-log_file").value = config["tools"]["yosys"]["log_file"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["custom_load_commands"] !== undefined) {
        element_value = document.getElementById("tools-yosys-custom_load_commands").value = String(config["tools"]["yosys"]["custom_load_commands"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["custom_analyze_commands"] !== undefined) {
        element_value = document.getElementById("tools-yosys-custom_analyze_commands").value = String(config["tools"]["yosys"]["custom_analyze_commands"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["custom_elaborate_commands"] !== undefined) {
        element_value = document.getElementById("tools-yosys-custom_elaborate_commands").value = String(config["tools"]["yosys"]["custom_elaborate_commands"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["extra_flags"] !== undefined) {
        element_value = document.getElementById("tools-yosys-extra_flags").value = String(config["tools"]["yosys"]["extra_flags"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["check_enabled"] !== undefined) {
        document.getElementById("tools-yosys-check_enabled").checked = config["tools"]["yosys"]["check_enabled"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["check_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-check_options").value = String(config["tools"]["yosys"]["check_options"]);
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["stat_enabled"] !== undefined) {
        document.getElementById("tools-yosys-stat_enabled").checked = config["tools"]["yosys"]["stat_enabled"];
    }
    if (config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["stat_options"] !== undefined) {
        element_value = document.getElementById("tools-yosys-stat_options").value = String(config["tools"]["yosys"]["stat_options"]);
    }
    if (config["tools"] && config["tools"]["openfpga"] && config["tools"]["openfpga"]["installation_path"] !== undefined) {
        document.getElementById("tools-openfpga-installation_path").value = config["tools"]["openfpga"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["openfpga"] && config["tools"]["openfpga"]["arch"] !== undefined) {
        document.getElementById("tools-openfpga-arch").value = config["tools"]["openfpga"]["arch"];
    }
    if (config["tools"] && config["tools"]["openfpga"] && config["tools"]["openfpga"]["task_options"] !== undefined) {
        element_value = document.getElementById("tools-openfpga-task_options").value = String(config["tools"]["openfpga"]["task_options"]);
    }
    if (config["tools"] && config["tools"]["activehdl"] && config["tools"]["activehdl"]["installation_path"] !== undefined) {
        document.getElementById("tools-activehdl-installation_path").value = config["tools"]["activehdl"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["questa"] && config["tools"]["questa"]["installation_path"] !== undefined) {
        document.getElementById("tools-questa-installation_path").value = config["tools"]["questa"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["installation_path"] !== undefined) {
        document.getElementById("tools-raptor-installation_path").value = config["tools"]["raptor"]["installation_path"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["target_device"] !== undefined) {
        document.getElementById("tools-raptor-target_device").value = config["tools"]["raptor"]["target_device"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["vhdl_version"] !== undefined) {
        document.getElementById("tools-raptor-vhdl_version").value = config["tools"]["raptor"]["vhdl_version"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["verilog_version"] !== undefined) {
        document.getElementById("tools-raptor-verilog_version").value = config["tools"]["raptor"]["verilog_version"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["sv_version"] !== undefined) {
        document.getElementById("tools-raptor-sv_version").value = config["tools"]["raptor"]["sv_version"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["optimization"] !== undefined) {
        document.getElementById("tools-raptor-optimization").value = config["tools"]["raptor"]["optimization"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["effort"] !== undefined) {
        document.getElementById("tools-raptor-effort").value = config["tools"]["raptor"]["effort"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["fsm_encoding"] !== undefined) {
        document.getElementById("tools-raptor-fsm_encoding").value = config["tools"]["raptor"]["fsm_encoding"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["carry"] !== undefined) {
        document.getElementById("tools-raptor-carry").value = config["tools"]["raptor"]["carry"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["pnr_netlist_language"] !== undefined) {
        document.getElementById("tools-raptor-pnr_netlist_language").value = config["tools"]["raptor"]["pnr_netlist_language"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["dsp_limit"] !== undefined) {
        document.getElementById("tools-raptor-dsp_limit").value = config["tools"]["raptor"]["dsp_limit"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["block_ram_limit"] !== undefined) {
        document.getElementById("tools-raptor-block_ram_limit").value = config["tools"]["raptor"]["block_ram_limit"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["fast_synthesis"] !== undefined) {
        document.getElementById("tools-raptor-fast_synthesis").checked = config["tools"]["raptor"]["fast_synthesis"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["top_level"] !== undefined) {
        document.getElementById("tools-raptor-top_level").value = config["tools"]["raptor"]["top_level"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["sim_source_list"] !== undefined) {
        element_value = document.getElementById("tools-raptor-sim_source_list").value = String(config["tools"]["raptor"]["sim_source_list"]);
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulate_rtl"] !== undefined) {
        document.getElementById("tools-raptor-simulate_rtl").checked = config["tools"]["raptor"]["simulate_rtl"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["waveform_rtl"] !== undefined) {
        document.getElementById("tools-raptor-waveform_rtl").value = config["tools"]["raptor"]["waveform_rtl"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulator_rtl"] !== undefined) {
        document.getElementById("tools-raptor-simulator_rtl").value = config["tools"]["raptor"]["simulator_rtl"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulation_options_rtl"] !== undefined) {
        document.getElementById("tools-raptor-simulation_options_rtl").value = config["tools"]["raptor"]["simulation_options_rtl"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulate_gate"] !== undefined) {
        document.getElementById("tools-raptor-simulate_gate").checked = config["tools"]["raptor"]["simulate_gate"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["waveform_gate"] !== undefined) {
        document.getElementById("tools-raptor-waveform_gate").value = config["tools"]["raptor"]["waveform_gate"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulator_gate"] !== undefined) {
        document.getElementById("tools-raptor-simulator_gate").value = config["tools"]["raptor"]["simulator_gate"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulation_options_gate"] !== undefined) {
        document.getElementById("tools-raptor-simulation_options_gate").value = config["tools"]["raptor"]["simulation_options_gate"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulate_pnr"] !== undefined) {
        document.getElementById("tools-raptor-simulate_pnr").checked = config["tools"]["raptor"]["simulate_pnr"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["waveform_pnr"] !== undefined) {
        document.getElementById("tools-raptor-waveform_pnr").value = config["tools"]["raptor"]["waveform_pnr"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulator_pnr"] !== undefined) {
        document.getElementById("tools-raptor-simulator_pnr").value = config["tools"]["raptor"]["simulator_pnr"];
    }
    if (config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulation_options_pnr"] !== undefined) {
        document.getElementById("tools-raptor-simulation_options_pnr").value = config["tools"]["raptor"]["simulation_options_pnr"];
    }
  }

  function set_mark(config, projectName){
    const MODIFIEDMSG = "Modified in project";
    let mark = "";
    mark = "";
    if (projectName !== undefined && config["general"] && config["general"]["general"] && config["general"]["general"]["pypath"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_general-general-pypath").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["general"] && config["general"]["general"] && config["general"]["general"]["makepath"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_general-general-makepath").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["general"] && config["general"]["general"] && config["general"]["general"]["go_to_definition_vhdl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_general-general-go_to_definition_vhdl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["general"] && config["general"]["general"] && config["general"]["general"]["go_to_definition_verilog"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_general-general-go_to_definition_verilog").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["general"] && config["general"]["general"] && config["general"]["general"]["developer_mode"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_general-general-developer_mode").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["language"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-language").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["symbol_vhdl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-symbol_vhdl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["symbol_verilog"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-symbol_verilog").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["dependency_graph"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-dependency_graph").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["self_contained"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-self_contained").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["fsm"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-fsm").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["ports"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-ports").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["generics"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-generics").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["instantiations"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-instantiations").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["signals"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-signals").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["constants"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-constants").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["types"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-types").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["process"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-process").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["functions"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-functions").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["tasks"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-tasks").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["documentation"] && config["documentation"]["general"] && config["documentation"]["general"]["magic_config_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_documentation-general-magic_config_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_comment_shortcuts"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_editor-general-stutter_comment_shortcuts").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_block_width"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_editor-general-stutter_block_width").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_max_width"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_editor-general-stutter_max_width").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_delimiters"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_editor-general-stutter_delimiters").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["editor"] && config["editor"]["general"] && config["editor"]["general"]["stutter_bracket_shortcuts"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_editor-general-stutter_bracket_shortcuts").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["general"] && config["formatter"]["general"]["formatter_verilog"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-general-formatter_verilog").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["general"] && config["formatter"]["general"]["formatter_vhdl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-general-formatter_vhdl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["istyle"] && config["formatter"]["istyle"]["style"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-istyle-style").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["istyle"] && config["formatter"]["istyle"]["indentation_size"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-istyle-indentation_size").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["s3sv"] && config["formatter"]["s3sv"]["one_bind_per_line"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-s3sv-one_bind_per_line").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["s3sv"] && config["formatter"]["s3sv"]["one_declaration_per_line"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-s3sv-one_declaration_per_line").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["s3sv"] && config["formatter"]["s3sv"]["use_tabs"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-s3sv-use_tabs").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["s3sv"] && config["formatter"]["s3sv"]["indentation_size"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-s3sv-indentation_size").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["verible"] && config["formatter"]["verible"]["format_args"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-verible-format_args").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["keyword_case"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-keyword_case").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["name_case"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-name_case").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["indentation"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-indentation").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["align_port_generic"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-align_port_generic").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["align_comment"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-align_comment").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["remove_comments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-remove_comments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["remove_reports"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-remove_reports").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["check_alias"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-check_alias").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_then"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-new_line_after_then").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_semicolon"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-new_line_after_semicolon").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_else"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-new_line_after_else").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_port"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-new_line_after_port").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["formatter"] && config["formatter"]["standalone"] && config["formatter"]["standalone"]["new_line_after_generic"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_formatter-standalone-new_line_after_generic").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["general"] && config["linter"]["general"]["linter_vhdl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-general-linter_vhdl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["general"] && config["linter"]["general"]["linter_verilog"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-general-linter_verilog").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["general"] && config["linter"]["general"]["lstyle_verilog"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-general-lstyle_verilog").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["general"] && config["linter"]["general"]["lstyle_vhdl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-general-lstyle_vhdl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["vhdlls"] && config["linter"]["vhdlls"]["standard"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-vhdlls-standard").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["vhdlls"] && config["linter"]["vhdlls"]["ignoreVunit"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-vhdlls-ignoreVunit").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["vhdlls"] && config["linter"]["vhdlls"]["vunitPath"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-vhdlls-vunitPath").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["ghdl"] && config["linter"]["ghdl"]["arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-ghdl-arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["icarus"] && config["linter"]["icarus"]["arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-icarus-arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["modelsim"] && config["linter"]["modelsim"]["vhdl_arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-modelsim-vhdl_arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["modelsim"] && config["linter"]["modelsim"]["verilog_arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-modelsim-verilog_arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["verible"] && config["linter"]["verible"]["arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-verible-arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["verilator"] && config["linter"]["verilator"]["arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-verilator-arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["vivado"] && config["linter"]["vivado"]["vhdl_arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-vivado-vhdl_arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["linter"] && config["linter"]["vivado"] && config["linter"]["vivado"]["verilog_arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_linter-vivado-verilog_arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["schematic"] && config["schematic"]["general"] && config["schematic"]["general"]["backend"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_schematic-general-backend").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["schematic"] && config["schematic"]["general"] && config["schematic"]["general"]["extra"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_schematic-general-extra").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["schematic"] && config["schematic"]["general"] && config["schematic"]["general"]["args"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_schematic-general-args").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["schematic"] && config["schematic"]["general"] && config["schematic"]["general"]["args_ghdl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_schematic-general-args_ghdl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["templates"] && config["templates"]["general"] && config["templates"]["general"]["header_file_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_templates-general-header_file_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["templates"] && config["templates"]["general"] && config["templates"]["general"]["indent"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_templates-general-indent").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["templates"] && config["templates"]["general"] && config["templates"]["general"]["clock_generation_style"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_templates-general-clock_generation_style").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["templates"] && config["templates"]["general"] && config["templates"]["general"]["instance_style"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_templates-general-instance_style").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["general"] && config["tools"]["general"]["select_tool"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-general-select_tool").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["general"] && config["tools"]["general"]["manual_compilation_order"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-general-manual_compilation_order").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["general"] && config["tools"]["general"]["execution_mode"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-general-execution_mode").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["general"] && config["tools"]["general"]["waveform_viewer"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-general-waveform_viewer").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["general"] && config["tools"]["general"]["gtkwave_installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-general-gtkwave_installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["general"] && config["tools"]["general"]["gtkwave_extra_arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-general-gtkwave_extra_arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-quartus-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["family"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-quartus-family").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["device"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-quartus-device").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["optimization_mode"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-quartus-optimization_mode").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["allow_register_retiming"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-quartus-allow_register_retiming").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["quartus"] && config["tools"]["quartus"]["wave_file_questa"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-quartus-wave_file_questa").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vsg"] && config["tools"]["vsg"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vsg-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vsg"] && config["tools"]["vsg"]["style_config"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vsg-style_config").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vsg"] && config["tools"]["vsg"]["core_number"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vsg-core_number").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vsg"] && config["tools"]["vsg"]["aditional_arguments"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vsg-aditional_arguments").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["osvvm"] && config["tools"]["osvvm"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-osvvm-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["osvvm"] && config["tools"]["osvvm"]["tclsh_binary"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-osvvm-tclsh_binary").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["osvvm"] && config["tools"]["osvvm"]["simulator_name"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-osvvm-simulator_name").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ascenlint"] && config["tools"]["ascenlint"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ascenlint-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ascenlint"] && config["tools"]["ascenlint"]["ascentlint_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ascenlint-ascentlint_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-cocotb-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["simulator_name"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-cocotb-simulator_name").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["compile_args"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-cocotb-compile_args").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["run_args"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-cocotb-run_args").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["cocotb"] && config["tools"]["cocotb"]["plusargs"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-cocotb-plusargs").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["diamond"] && config["tools"]["diamond"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-diamond-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["diamond"] && config["tools"]["diamond"]["part"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-diamond-part").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vhdl_standard"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-vhdl_standard").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["ieee_library"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-ieee_library").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["relaxed_parsing"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-relaxed_parsing").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["unicode_support"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-unicode_support").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["psl_enabled"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-psl_enabled").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["work_library"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-work_library").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["library_paths"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-library_paths").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["check_syntax_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-check_syntax_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["analyze_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-analyze_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["elaborate_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-elaborate_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["run_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-run_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["synthesis_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-synthesis_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["extra_flags"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-extra_flags").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["relaxed_rules"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-relaxed_rules").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["bind_checks"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-bind_checks").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vital_checks"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-vital_checks").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["simulation_time"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-simulation_time").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["resolution_limit"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-resolution_limit").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["stack_size"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-stack_size").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["stop_delta_cycles"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-stop_delta_cycles").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["waveform_enabled"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-waveform_enabled").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["waveform_format"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-waveform_format").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["waveform_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-waveform_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["wave_start_time"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-wave_start_time").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vcd_4states"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-vcd_4states").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vcd_nodate"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-vcd_nodate").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["read_wave_opt"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-read_wave_opt").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["write_wave_opt"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-write_wave_opt").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["debug_level"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-debug_level").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["verbose"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-verbose").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["warnings_as_errors"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-warnings_as_errors").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["suppress_warnings"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-suppress_warnings").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["assert_level"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-assert_level").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["display_time"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-display_time").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["unbuffered_output"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-unbuffered_output").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["max_stack_alloc"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-max_stack_alloc").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["backtrace_severity"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-backtrace_severity").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["ieee_asserts"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-ieee_asserts").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["asserts_policy"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-asserts_policy").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["sdf_file"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-sdf_file").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vpi_modules"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-vpi_modules").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vhpi_modules"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-vhpi_modules").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vpi_trace_file"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-vpi_trace_file").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["vhpi_trace_file"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-vhpi_trace_file").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["psl_report_file"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-psl_report_file").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["psl_report_uncovered"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-psl_report_uncovered").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["disp_tree"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-disp_tree").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ghdl"] && config["tools"]["ghdl"]["no_run"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ghdl-no_run").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icarus"] && config["tools"]["icarus"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icarus-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icarus"] && config["tools"]["icarus"]["timescale"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icarus-timescale").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icarus"] && config["tools"]["icarus"]["iverilog_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icarus-iverilog_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["pnr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-pnr").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["arch"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-arch").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["output_format"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-output_format").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["yosys_as_subtool"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-yosys_as_subtool").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["makefile_name"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-makefile_name").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["arachne_pnr_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-arachne_pnr_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["nextpnr_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-nextpnr_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["icestorm"] && config["tools"]["icestorm"]["yosys_synth_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-icestorm-yosys_synth_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ise-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["family"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ise-family").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["device"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ise-device").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["package"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ise-package").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["ise"] && config["tools"]["ise"]["speed"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-ise-speed").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["isem"] && config["tools"]["isem"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-isem-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["isem"] && config["tools"]["isem"]["fuse_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-isem-fuse_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["isem"] && config["tools"]["isem"]["isim_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-isem-isim_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["modelsim"] && config["tools"]["modelsim"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-modelsim-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["modelsim"] && config["tools"]["modelsim"]["vcom_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-modelsim-vcom_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["modelsim"] && config["tools"]["modelsim"]["vlog_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-modelsim-vlog_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["modelsim"] && config["tools"]["modelsim"]["vsim_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-modelsim-vsim_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["morty"] && config["tools"]["morty"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-morty-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["morty"] && config["tools"]["morty"]["morty_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-morty-morty_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["radiant"] && config["tools"]["radiant"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-radiant-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["radiant"] && config["tools"]["radiant"]["part"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-radiant-part").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["rivierapro"] && config["tools"]["rivierapro"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-rivierapro-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["rivierapro"] && config["tools"]["rivierapro"]["compilation_mode"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-rivierapro-compilation_mode").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["rivierapro"] && config["tools"]["rivierapro"]["vlog_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-rivierapro-vlog_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["rivierapro"] && config["tools"]["rivierapro"]["vsim_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-rivierapro-vsim_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-siliconcompiler-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["target"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-siliconcompiler-target").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["server_enable"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-siliconcompiler-server_enable").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["server_address"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-siliconcompiler-server_address").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["server_username"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-siliconcompiler-server_username").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["siliconcompiler"] && config["tools"]["siliconcompiler"]["server_password"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-siliconcompiler-server_password").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-spyglass-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["methodology"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-spyglass-methodology").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["goals"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-spyglass-goals").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["spyglass_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-spyglass-spyglass_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["spyglass"] && config["tools"]["spyglass"]["rule_parameters"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-spyglass-rule_parameters").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiyosys"] && config["tools"]["symbiyosys"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiyosys-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiyosys"] && config["tools"]["symbiyosys"]["tasknames"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiyosys-tasknames").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiflow-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["package"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiflow-package").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["part"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiflow-part").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["vendor"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiflow-vendor").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["pnr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiflow-pnr").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["vpr_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiflow-vpr_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["symbiflow"] && config["tools"]["symbiflow"]["environment_script"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-symbiflow-environment_script").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-trellis-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["arch"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-trellis-arch").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["output_format"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-trellis-output_format").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["yosys_as_subtool"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-trellis-yosys_as_subtool").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["makefile_name"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-trellis-makefile_name").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["script_name"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-trellis-script_name").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["nextpnr_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-trellis-nextpnr_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["trellis"] && config["tools"]["trellis"]["yosys_synth_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-trellis-yosys_synth_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vcs"] && config["tools"]["vcs"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vcs-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vcs"] && config["tools"]["vcs"]["vcs_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vcs-vcs_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vcs"] && config["tools"]["vcs"]["run_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vcs-run_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["verible"] && config["tools"]["verible"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-verible-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-verilator-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["mode"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-verilator-mode").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["libs"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-verilator-libs").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["verilator_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-verilator-verilator_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["make_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-verilator-make_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["verilator"] && config["tools"]["verilator"]["run_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-verilator-run_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vivado-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["part"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vivado-part").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["synth"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vivado-synth").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["pnr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vivado-pnr").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["jtag_freq"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vivado-jtag_freq").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vivado"] && config["tools"]["vivado"]["hw_target"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vivado-hw_target").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["simulator_name"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-simulator_name").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["runpy_mode"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-runpy_mode").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["extra_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-extra_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_array_util_lib"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-enable_array_util_lib").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_com_lib"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-enable_com_lib").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_json4vhdl_lib"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-enable_json4vhdl_lib").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_osvvm_lib"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-enable_osvvm_lib").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_random_lib"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-enable_random_lib").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["vunit"] && config["tools"]["vunit"]["enable_verification_components_lib"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-vunit-enable_verification_components_lib").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-xcelium-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["xmvhdl_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-xcelium-xmvhdl_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["xmvlog_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-xcelium-xmvlog_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["xmsim_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-xcelium-xmsim_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["xcelium"] && config["tools"]["xcelium"]["xrun_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-xcelium-xrun_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["xsim"] && config["tools"]["xsim"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-xsim-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["xsim"] && config["tools"]["xsim"]["xelab_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-xsim-xelab_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["xsim"] && config["tools"]["xsim"]["xsim_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-xsim-xsim_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["read_verilog_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-read_verilog_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["read_systemverilog_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-read_systemverilog_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["read_liberty_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-read_liberty_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["hierarchy_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-hierarchy_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["proc_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-proc_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["opt_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-opt_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["flatten_enabled"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-flatten_enabled").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["flatten_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-flatten_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["memory_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-memory_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["fsm_enabled"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-fsm_enabled").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["fsm_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-fsm_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["techmap_enabled"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-techmap_enabled").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["techmap_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-techmap_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["abc_enabled"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-abc_enabled").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["abc_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-abc_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["synthesis_target"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-synthesis_target").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_device"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_device").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_top_module"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_top_module").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_output_blif"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_output_blif").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_output_edif"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_output_edif").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_output_json"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_output_json").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_noflatten"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_noflatten").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_dff"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_dff").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_retime"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_retime").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_nocarry"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_nocarry").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_nodffe"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_nodffe").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_dffe_min_ce_use"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_dffe_min_ce_use").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_nobram"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_nobram").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_spram"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_spram").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_dsp"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_dsp").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_noabc"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_noabc").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_abc2"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_abc2").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_vpr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_vpr").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_noabc9"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_noabc9").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_flowmap"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_flowmap").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ice40_no_rw_check"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ice40_no_rw_check").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_top_module"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_top_module").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_output_blif"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_output_blif").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_output_edif"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_output_edif").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_output_json"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_output_json").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_noflatten"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_noflatten").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_dff"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_dff").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_retime"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_retime").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_noccu2"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_noccu2").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nodffe"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_nodffe").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nobram"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_nobram").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nolutram"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_nolutram").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nowidelut"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_nowidelut").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_asyncprld"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_asyncprld").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_abc2"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_abc2").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_noabc9"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_noabc9").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_vpr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_vpr").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_iopad"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_iopad").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_nodsp"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_nodsp").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["ecp5_no_rw_check"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-ecp5_no_rw_check").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["verbose"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-verbose").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["debug_level"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-debug_level").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["log_file"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-log_file").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["custom_load_commands"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-custom_load_commands").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["custom_analyze_commands"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-custom_analyze_commands").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["custom_elaborate_commands"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-custom_elaborate_commands").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["extra_flags"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-extra_flags").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["check_enabled"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-check_enabled").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["check_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-check_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["stat_enabled"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-stat_enabled").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["yosys"] && config["tools"]["yosys"]["stat_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-yosys-stat_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["openfpga"] && config["tools"]["openfpga"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-openfpga-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["openfpga"] && config["tools"]["openfpga"]["arch"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-openfpga-arch").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["openfpga"] && config["tools"]["openfpga"]["task_options"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-openfpga-task_options").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["activehdl"] && config["tools"]["activehdl"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-activehdl-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["questa"] && config["tools"]["questa"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-questa-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["installation_path"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-installation_path").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["target_device"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-target_device").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["vhdl_version"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-vhdl_version").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["verilog_version"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-verilog_version").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["sv_version"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-sv_version").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["optimization"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-optimization").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["effort"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-effort").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["fsm_encoding"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-fsm_encoding").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["carry"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-carry").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["pnr_netlist_language"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-pnr_netlist_language").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["dsp_limit"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-dsp_limit").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["block_ram_limit"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-block_ram_limit").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["fast_synthesis"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-fast_synthesis").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["top_level"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-top_level").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["sim_source_list"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-sim_source_list").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulate_rtl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulate_rtl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["waveform_rtl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-waveform_rtl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulator_rtl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulator_rtl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulation_options_rtl"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulation_options_rtl").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulate_gate"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulate_gate").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["waveform_gate"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-waveform_gate").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulator_gate"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulator_gate").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulation_options_gate"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulation_options_gate").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulate_pnr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulate_pnr").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["waveform_pnr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-waveform_pnr").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulator_pnr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulator_pnr").innerHTML = mark;
    mark = "";
    if (projectName !== undefined && config["tools"] && config["tools"]["raptor"] && config["tools"]["raptor"]["simulation_options_pnr"] !== undefined) {
      mark = MODIFIEDMSG;
    }
    document.getElementById("mark_tools-raptor-simulation_options_pnr").innerHTML = mark;
  }

  function open_submenu_icon(x) {
    x.classList.toggle("change");
  }

  
</script>
</body>
</html>
`;