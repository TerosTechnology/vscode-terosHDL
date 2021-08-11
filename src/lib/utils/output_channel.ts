/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from 'vscode';

const MSG_PYTHON = "Error Python3 path. ";
const MSG_COCOTB_INSTALLATION = "Install cocotb itself to run tests.";
const MSG_COCOTB_DEPS = "Error testing deps.";
const MSG_COCOTB_TEST_NOT_FOUND = "Found module in Makefile's MODULE variable but no python file found.";
const MSG_EDALIZE_GUI_ERROR = "GUI option not supported for your current simulator. Check [TerosHDL documentation](https://terostechnology.github.io/terosHDLdoc/features/project_manager.html).";
const MSG_FILE_NOT_FOUND = "File not found.";
const MSG_DOCUMENTER_NOT_VALID_FILE = "Select a valid file.";
const MSG_DOCUMENTER_SAVE = "Document saved in ";
const MSG_COPIED_TO_CLIPBOARD = "Code copied to clipboard.";
const MSG_SELECT_TOPLEVELPATH = "Select a toplvel.";
const MSG_SELECT_TOPLEVEL = "Select a toplvel.";
const MSG_SELECT_PROJECT_TREE_VIEW = "Select a project.";
const MSG_SELECT_PROJECT_SIMULATION = "Select a project.";
const NETLIST_VIEWER = "Configure Yosys or install YoWASP: pip install yowasp-yosys";

export const ERROR_CODE = {
    PYTHON : MSG_PYTHON,
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
};

export class Output_channel{

    private output_channel : vscode.OutputChannel;

    constructor(){
        this.output_channel = vscode.window.createOutputChannel('TerosHDL');
    }

    clear(){
        this.output_channel.clear();   
    }

    append(msg:string){
        this.output_channel.append(msg);
    }

    appendLine(msg:string){
        this.output_channel.appendLine(msg);
    }

    show(){
        this.output_channel.show();
    }

    get_date(){
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

    show_message(error_message, ags){
        this.show();
        if (error_message === ERROR_CODE.PYTHON){
            error_message += `Current Python3 path: ${ags}`;
        }

        let date = this.get_date();
        let msg = date + ': ' + error_message;
        this.appendLine(msg);
    }

    print_message(msg_i){
        this.show();

        let date = this.get_date();
        let msg = date + ': ' + msg_i;
        this.appendLine(msg); 
    }

    print_check_configuration(check_configuration){
        this.clear();
        this.show();
        this.appendLine("************************************************************************************************");
        
        let errors = '';
        let python3_error = false;

        let msg = `---> Python3 path: ${check_configuration.python_path}`;
        if (check_configuration.python_path === ''){
            msg = `---> Python3 path: doesn't detected.`;
            python3_error = true;
        }
        this.appendLine(msg);    

        msg = `---> Python3 packages directory: ${check_configuration.python_directories}`;
        this.appendLine(msg); 

        if (check_configuration.vunit === true){
            this.appendLine('---> VUnit is installed.');
        }
        else{
            errors += 'VUnit';
            this.appendLine('---> VUnit is NOT installed.');
        }
        
        if (check_configuration.cocotb === true){
            this.appendLine('---> Cocotb is installed.');
        }
        else{
            this.appendLine('---> Cocotb is NOT installed.');
        }
        
        if (check_configuration.edalize === true){
            this.appendLine('---> Edalize is installed.');
        }
        else{
            errors += ', Edalize';
            this.appendLine('---> Edalize is NOT installed.');
        }
        this.appendLine("************************************************************************************************");
        if (python3_error === true){
            msg = `Configure your Python 3 path correctly.`;
            this.appendLine(msg);
        }
        if (errors !== ''){
            msg = `Install ${errors} manually or install pyTerosHDL: pip install pyTerosHDL`;
            this.appendLine(msg);
        }
        if (python3_error === true || errors !== ''){
            this.appendLine("************************************************************************************************");
        }

    }

    print_project_documenter_configurtion(configuration, file_input:string, file_output:string, type_output:string){
        this.print_documenter_configurtion(configuration, file_input, file_output, type_output);
        this.appendLine("• Files processed: ");
    }

    print_project_documenter_result(result){
        let fail_files = result.fail_files;
        let ok_files = result.ok_files;
        let total_files = fail_files + ok_files;
        let msg = `
****************************************************************************************************************************************
---> Files found: ${total_files}
---> Files processed successfully: ${ok_files}
---> Unprocessed files: ${fail_files}
****************************************************************************************************************************************
      `;
        this.appendLine(msg);
    }

    print_documenter_configurtion(configuration, file_input:string, file_output:string, type_output:string){
        this.clear();
        this.show();
        this.appendLine("****************************************************************************************************************************************");
        let msg = `---> Python3 path: ${configuration.pypath}    
---> Include constants/types: ${configuration.constants}    
---> Include signals: ${configuration.signals}     
---> Include dependency_graph: ${configuration.dependency_graph}     
---> Include finite state machines: ${configuration.fsm}     
---> Include process/always: ${configuration.process}     
---> HTML self contained: ${configuration.self_contained}     
---> VHDL comment symbol: ${configuration.symbol_vhdl}     
---> Verilog comment symbol: ${configuration.symbol_verilog}`;
        this.appendLine(msg);
        this.appendLine("****************************************************************************************************************************************");
        this.appendLine(`• Input file: ${file_input}`);
        this.appendLine(`• Output file: ${file_output}`);
        this.appendLine(`• Output type: ${type_output.toLocaleUpperCase()}`);
        this.appendLine("• Learn how to configure your documentation: https://terostechnology.github.io/terosHDLdoc/configuration/documenter.html");
        this.appendLine("****************************************************************************************************************************************");
    }

    print_formatter(formatter_name, options){
        this.clear();
        this.show();
        this.appendLine("****************************************************************************************************************************************");
        let msg = `Formatting file with ${formatter_name}: `;
        this.print_message(msg);
        for (const [key, value] of Object.entries(options)) {
            let option = `• ${key}: ${value}`;
            this.appendLine(option);
          }
        this.appendLine("****************************************************************************************************************************************");
    }

}