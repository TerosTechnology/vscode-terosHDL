/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from 'vscode';

const MSG_PYTHON = "Error Python3 path (https://terostechnology.github.io/terosHDLdoc/configuration/python.html). ";
const MSG_COCOTB_INSTALLATION = "Install cocotb itself to run tests (https://terostechnology.github.io/terosHDLdoc/configuration/python.html).";
const MSG_COCOTB_DEPS = "Error testing deps (https://terostechnology.github.io/terosHDLdoc/configuration/python.html).";
const MSG_COCOTB_TEST_NOT_FOUND = "Found module in Makefile's MODULE variable but no python file found.";
const MSG_EDALIZE_GUI_ERROR = "GUI option not supported for your current simulator. Check [TerosHDL documentation](https://terostechnology.github.io/terosHDLdoc/project_manager/gui.html).";
const MSG_FILE_NOT_FOUND = "File not found.";
const MSG_DOCUMENTER_NOT_VALID_FILE = "Select a valid file. (https://terostechnology.github.io/terosHDLdoc/documenter/configuration.html)";
const MSG_DOCUMENTER_SAVE = "Document saved in ";
const MSG_COPIED_TO_CLIPBOARD = "Code copied to clipboard.";
const MSG_SELECT_TOPLEVELPATH = "Select a toplvel (https://terostechnology.github.io/terosHDLdoc/project_manager/start.html#selecting-project-and-toplevel).";
const MSG_SELECT_TOPLEVEL = "Select a toplvel (https://terostechnology.github.io/terosHDLdoc/project_manager/start.html#selecting-project-and-toplevel).";
const MSG_SELECT_PROJECT_TREE_VIEW = "Select a project (https://terostechnology.github.io/terosHDLdoc/project_manager/start.html#selecting-project-and-toplevel).";
const MSG_SELECT_PROJECT_SIMULATION = "Select a project (https://terostechnology.github.io/terosHDLdoc/project_manager/start.html#selecting-project-and-toplevel).";
const NETLIST_VIEWER = "Configure (https://terostechnology.github.io/terosHDLdoc/netlist/configuration.html) Yosys or install YoWASP: pip install yowasp-yosys";
const MSG_NOT_PARENT = "This file hasn't parent (https://terostechnology.github.io/terosHDLdoc/editor/go_to_parent.html).";
const MSG_FILES_IN_PROJECT_NO_EXIST = "The following files doesn't exist (maybe the name has been changed): ";
const MSG_SAVE_DEP_GRAPH = "Dependency graph saved in";
const MSG_ERROR_SAVE_DEP_GRAPH = "Dependency graph not defined.";
const MSG_INFO_DEP_GRAPH = "TerosHDL is creating the diagram.";
const NETLIST_VHDL_ERROR = "Your project/file includes 1 or more VHDL files, but it's not configured the backend GHDL+Yosys (https://terostechnology.github.io/terosHDLdoc/netlist/configuration.html).";

export const ERROR_CODE = {
    PYTHON: MSG_PYTHON,
    SELECT_PROJECT_TREE_VIEW: MSG_SELECT_PROJECT_TREE_VIEW,
    SELECT_PROJECT_SIMULATION: MSG_SELECT_PROJECT_SIMULATION,
    SELECT_TOPLEVEL: MSG_SELECT_TOPLEVEL,
    COCOTB_INSTALLATION: MSG_COCOTB_INSTALLATION,
    COCOTB_DEPS: MSG_COCOTB_DEPS,
    COCOTB_TEST_NOT_FOUND: MSG_COCOTB_TEST_NOT_FOUND,
    EDALIZE_GUI_ERROR: MSG_EDALIZE_GUI_ERROR,
    FILE_NOT_FOUND: MSG_FILE_NOT_FOUND,
    DOCUMENTER_NOT_VALID_FILE: MSG_DOCUMENTER_NOT_VALID_FILE,
    DOCUMENTER_SAVE: MSG_DOCUMENTER_SAVE, //argument path 
    COPIED_TO_CLIPBOARD: MSG_COPIED_TO_CLIPBOARD,
    TEMPLATE_NOT_VALID_FILE: MSG_DOCUMENTER_NOT_VALID_FILE,
    SELECT_TOPLEVELPATH: MSG_SELECT_TOPLEVELPATH,
    NETLIST_VIEWER: NETLIST_VIEWER,
    NOT_PARENT: MSG_NOT_PARENT,
    FILES_IN_PROJECT_NO_EXIST: MSG_FILES_IN_PROJECT_NO_EXIST,
    SAVE_DEP_GRAPH: MSG_SAVE_DEP_GRAPH,
    ERROR_SAVE_DEP_GRAPH: MSG_ERROR_SAVE_DEP_GRAPH,
    INFO_DEP_GRAPH: MSG_INFO_DEP_GRAPH,
    NETLIST_VHDL_ERROR: NETLIST_VHDL_ERROR,
};

const SAVE_PROJECT = "Project saved in: ";
const SAVE_NETLIST = "Schematic saved in ";
export const MSG_CODE = {
    SAVE_NETLIST: SAVE_NETLIST,
    SAVE_PROJECT: SAVE_PROJECT
};

export class Output_channel {

    separator: string = "****************************************************************************************************************************************";


    private output_channel: vscode.OutputChannel;

    constructor() {
        this.output_channel = vscode.window.createOutputChannel('TerosHDL');
    }

    clear() {
        this.output_channel.clear();
    }

    append(msg: string) {
        this.output_channel.append(msg);
    }

    appendLine(msg: string) {
        this.output_channel.appendLine(msg);
    }

    show() {
        this.output_channel.show();
    }

    get_date() {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours().toString().padStart(2, '0');
        let minutes = date_ob.getMinutes().toString().padStart(2, '0');
        let seconds = date_ob.getSeconds().toString().padStart(2, '0');
        let date_str = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        return date_str.padEnd(19);
    }

    show_info_message(code, args = '') {
        this.show();
        let msg = code;
        if (code === MSG_CODE.SAVE_NETLIST || code === MSG_CODE.SAVE_PROJECT) {
            msg += args;
        }
        let date = this.get_date();
        let msg_end = date + ': ' + msg;
        this.appendLine(msg_end);
    }

    show_message(error_message, args = '') {
        this.show();
        if (error_message === ERROR_CODE.SAVE_DEP_GRAPH) {
            error_message += ` ${args}`;
        }
        if (error_message === ERROR_CODE.PYTHON) {
            error_message += `Current Python3 path: ${args}`;
        }
        if (error_message === ERROR_CODE.FILES_IN_PROJECT_NO_EXIST) {
            let error_files = '';
            for (let i = 0; i < args.length - 1; i++) {
                const element = args[i];
                error_files += element + ', ';
            }
            error_files += args[args.length - 1];
            error_message += `${error_files}`;
        }

        let date = this.get_date();
        let msg = date + ': ' + error_message;
        this.appendLine(msg);
    }

    print_message(msg_i) {
        this.show();

        let date = this.get_date();
        let msg = date + ': ' + msg_i;
        this.appendLine(msg);
    }


    print_separator() {
        this.appendLine(this.separator);
    }


    print_check_configuration(check_configuration, edalize_checking = false) {
        this.show();
        this.print_separator();

        let errors = '';
        let python3_error = false;

        let msg = `---> Python3 path: ${check_configuration.python_path}`;
        if (check_configuration.python_path === '') {
            msg = `---> Python3 path: doesn't detected.`;
            python3_error = true;
        }
        this.appendLine(msg);

        msg = `---> Python3 packages directory: ${check_configuration.python_directories}`;
        this.appendLine(msg);

        if (check_configuration.vunit === true) {
            this.appendLine('---> VUnit is installed.');
        }
        else {
            errors += 'VUnit';
            this.appendLine('---> VUnit is NOT installed.');
        }

        if (check_configuration.cocotb === true) {
            this.appendLine('---> Cocotb is installed.');
        }
        else if (edalize_checking === false) {
            this.appendLine('---> Cocotb is NOT installed.');
        }

        if (check_configuration.yowasp_yosys === true) {
            this.appendLine('---> yowasp-yosys is installed.');
        }
        else if (edalize_checking === false) {
            errors += ', yowasp-yosys';
            this.appendLine('---> yowasp-yosys is NOT installed.');
        }

        if (check_configuration.edalize === true) {
            this.appendLine('---> Edalize is installed.');
        }
        else {
            errors += ', Edalize';
            this.appendLine('---> Edalize is NOT installed.');
        }

        if (check_configuration.make === true) {
            this.appendLine('---> Make is installed.');
        }
        else {
            errors += ', Make';
            let url = "https://www.gnu.org/software/make/";
            let is_win = process.platform === "win32";
            if (is_win === true) {
                url = "http://gnuwin32.sourceforge.net/packages/make.htm";
            }

            this.appendLine('---> Make is NOT installed: ' + url);
        }

        this.print_separator();
        if (python3_error === true) {
            msg = `Configure your Python 3 path correctly.`;
            this.appendLine(msg);
        }
        if (errors !== '') {
            msg = `Install ${errors} manually or install teroshdl python libraries: pip install teroshdl`;
            this.appendLine(msg);
        }
        msg = 'Check the documenatation: https://terostechnology.github.io/terosHDLdoc/about/requirements.html';
        this.appendLine(msg);
        if (python3_error === true || errors !== '') {
            this.print_separator();
        }

    }

    print_project_documenter_configurtion(configuration, file_input: string, file_output: string, type_output: string) {
        this.print_documenter_configurtion(configuration, file_input, file_output, type_output);
        this.appendLine("• Files processed: ");
    }

    print_project_documenter_result(result) {
        let fail_files = result.fail_files;
        let ok_files = result.ok_files;
        let total_files = fail_files + ok_files;
        this.print_separator();
        let msg = `
---> Check the documentation: https://terostechnology.github.io/terosHDLdoc/documenter/start.html
---> Files found: ${total_files}
---> Files processed successfully: ${ok_files}
---> Unprocessed files: ${fail_files}
      `;
        this.appendLine(msg);
        this.print_separator();
    }

    print_tool_information(project_name, top_level, simulator_gui, simulator_name, installation_path) {
        this.show();

        if (installation_path === '') {
            installation_path = 'System path';
        }

        this.print_separator();
        let msg = `---> Documentation: https://terostechnology.github.io/terosHDLdoc/project_manager/configuration.html
---> Project name: ${project_name}
---> Top level: ${top_level}    
---> Tool name: ${simulator_name}     
---> Installation path: ${installation_path}     
---> Open tool GUI: ${simulator_gui}`;
        this.appendLine(msg);
        this.print_separator();
    }


    print_documenter_configurtion(configuration, file_input: string, file_output: string, type_output: string) {
        this.show();
        this.print_separator();
        let msg = `---> Check the documentation: https://terostechnology.github.io/terosHDLdoc/documenter/start.html
---> Python3 path: ${configuration.pypath}
---> Include constants/types: ${configuration.constants}    
---> Include signals: ${configuration.signals}     
---> Include dependency_graph: ${configuration.dependency_graph}     
---> Include finite state machines: ${configuration.fsm}     
---> Include process/always: ${configuration.process}     
---> HTML self contained: ${configuration.self_contained}     
---> VHDL comment symbol: ${configuration.symbol_vhdl}     
---> Verilog comment symbol: ${configuration.symbol_verilog}`;
        this.appendLine(msg);
        this.print_separator();
        this.appendLine(`• Input file: ${file_input}`);
        this.appendLine(`• Output file: ${file_output}`);
        this.appendLine(`• Output type: ${type_output.toLocaleUpperCase()}`);
        this.appendLine("• Learn how to configure your documentation: https://terostechnology.github.io/terosHDLdoc/configuration/documenter.html");
        this.print_separator();
    }

    print_formatter(formatter_name, options) {
        this.show();
        this.print_separator();
        let msg = `Formatting file with ${formatter_name}: `;
        this.print_message(msg);
        for (const [key, value] of Object.entries(options)) {
            let option = `• ${key}: ${value}`;
            this.appendLine(option);
        }
        this.print_separator();
    }

}