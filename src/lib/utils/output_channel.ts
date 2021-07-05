/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from 'vscode';

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

}