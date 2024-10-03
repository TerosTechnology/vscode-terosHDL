// Copyright 2024
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

import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as vscode from 'vscode';
import * as path from 'path';
import { getConfig } from '../utils/utils';
import { GlobalConfigManager } from 'colibri/config/config_manager';
import { Process } from 'colibri/process/process';
import { check_python_package, get_python_path, python_options } from 'colibri/process/python';
import { globalLogger } from '../../logger';
import {
    e_config,
    e_linter_general_linter_verilog,
    e_linter_general_linter_vhdl,
    e_linter_general_lstyle_verilog,
    e_linter_general_lstyle_vhdl,
    e_formatter_general_formatter_vhdl,
    e_formatter_general_formatter_verilog,
} from 'colibri/config/config_declaration';
import { Linter_manager } from '../linter';
import { LANGUAGE } from 'colibri/common/general';
import { Formatter_manager} from '../formatter';
import { Schematic_manager } from '../schematic';
import { checkBinary } from 'colibri/toolChecker/utils';

export class configCheckerManager {
    private multiProjectManager: Multi_project_manager;
    private linterManager: Linter_manager;
    private formatterManager: Formatter_manager;
    private schematicManager: Schematic_manager;

    constructor(
        manager: Multi_project_manager,
        linterManager: Linter_manager,
        formatterManager: Formatter_manager,
        schematicManager: Schematic_manager
    ) {
        this.multiProjectManager = manager;
        this.linterManager = linterManager;
        this.formatterManager = formatterManager;
        this.schematicManager = schematicManager;

        vscode.commands.registerCommand('teroshdl.check_dependencies', async () => await this.check_dependencies());
    }

    public async check_dependencies() {
        await check_dependencies(
            this.multiProjectManager,
            this.linterManager,
            this.formatterManager,
            this.schematicManager
        );
    }
}

async function check_dependencies(
    multiProjectManager: Multi_project_manager,
    linterManager: Linter_manager,
    formatterManager: Formatter_manager,
    schematicManager: Schematic_manager
) {
    const configCurrent = getConfig(multiProjectManager);

    await checkLinter(linterManager);
    await checkFormatter(formatterManager);

    return;

    // const options: python_options = {
    //     path: GlobalConfigManager.getInstance().get_config().general.general.pypath
    // };

    // const intro_info = "-------> ";
    // const intro_warning = "----> ";
    // const intro_error = "------> ";

    // globalLogger.info('Checking dependencies...', true);

    // // Check python
    // const python_result = await get_python_path(options);
    // if (python_result.successful === false) {
    //     const doc_msg_link = "https://terostechnology.github.io/terosHDLdoc/docs/getting_started/installation#2-python3";
    //     const doc_msg = this.get_doc_msg(doc_msg_link);

    //     globalLogger.error(`${intro_error}Python not found. If you are using system path try setting the complete Python path. ${doc_msg}`);
    // }
    // else {
    //     globalLogger.info(`${intro_info} Python found: ${python_result.python_path}`);
    //     globalLogger.info(`${intro_info} Python found in path: ${python_result.python_complete_path}`);

    //     const package_list = ["vunit", "cocotb", "edalize"];
    //     const package_list_optional = ["cocotb"];

    //     for (const package_name of package_list) {
    //         let optional_msg = "";

    //         const package_result = await check_python_package(python_result.python_path,
    //             package_name);
    //         if (!package_result) {
    //             const doc_msg_link = "https://terostechnology.github.io/terosHDLdoc/docs/getting_started/installation#3-python3-package-dependencies";
    //             const doc_msg = this.get_doc_msg(doc_msg_link);

    //             if (package_list_optional.includes(package_name)) {
    //                 globalLogger.warn(`${intro_warning} ${package_name} (optional installation) not found. ${doc_msg}`);
    //             }
    //             else {
    //                 globalLogger.error(`${intro_error} ${package_name} ${optional_msg} not found. ${doc_msg}`);

    //             }
    //         }
    //         else {
    //             globalLogger.info(`${intro_info} ${package_name} found ${optional_msg}`);
    //         }
    //     }
    // }

    // // Check make
    // const make_binary_dir = configCurrent.general.general.makepath;
    // let make_binary_path = ("make");
    // if (make_binary_dir !== "") {
    //     make_binary_path = path.join(make_binary_dir, make_binary_path);
    // }

    // const proc = new Process();
    // const make_result = await proc.exec_wait(`${make_binary_path} --version`);
    // if (!make_result.successful) {
    //     const doc_msg_link = "https://terostechnology.github.io/terosHDLdoc/docs/getting_started/installation#4-make";
    //     const doc_msg = this.get_doc_msg(doc_msg_link);
    //     globalLogger.error(`${intro_error}Make not found in path: ${make_binary_path}. Check that the path is correct. ${doc_msg}`);
    //     globalLogger.error(make_result.stderr);
    //     globalLogger.error(make_result.stdout);
    // }
    // else {
    //     globalLogger.info(`${intro_info} Make found in path: ${make_binary_path}.`);
    // }
}

const MSGSEPARATOR = '*************************************************';

async function checkLinter(linterManager: Linter_manager) {
    let msg = '';

    msg += `\n${MSGSEPARATOR}\nChecking linter configuration\n${MSGSEPARATOR}\n`;

    const vhdlErrorLinter = linterManager.vhdlErrorLinter;
    const verilogErrorLinter = linterManager.verilogErrorLinter;
    const vhdlStyleLinter = linterManager.vhdlStyleLinter;
    const verilogStyleLinter = linterManager.verilogStyleLinter;

    const linterList = [vhdlErrorLinter, verilogErrorLinter, vhdlStyleLinter, verilogStyleLinter];
    for (const linter of linterList) {
        const language = linter.lang;
        const linterName = linter.get_linter_name();
        const linterOptions = linter.get_options(language);
        const linterInstance = linter.linter;
        const linterMode = linter.mode;

        const languageMsg = language === LANGUAGE.VHDL ? 'VHDL' : 'Verilog/SV';

        const msgInstallationPath = linterOptions.path === '' ? 'System path' : `"${linterOptions.path}"`;

        const msgChecking = `⊙ Checking linter ${linterMode} with ${linterName} for ${languageMsg}. Current configured installation path: ${msgInstallationPath}\n`;
        const msgDisabled = `⊙ Linter ${linterMode} for ${languageMsg} is disabled. Skipping configuration check.\n`;

        const disabledList = [
            e_linter_general_linter_vhdl.none,
            e_linter_general_linter_vhdl.disabled,
            e_linter_general_linter_verilog.disabled,
            e_linter_general_lstyle_vhdl.disabled,
            e_linter_general_lstyle_verilog.disabled
        ];

        msg += disabledList.includes(linterName) ? msgDisabled : msgChecking;

        if (!disabledList.includes(linterName)) {
            const result = await linterInstance.checkLinterConfiguration(linterName, linterOptions.path);
            for (const [_, line] of result.messageList.entries()) {
                if (line !== '') {
                    msg += `     ${line}\n`;
                }
            }
            if (result.successfulConfig) {
                msg += '🎉 The linter installation path is correctly configured.\n';
            } else if (result.successfulFind) {
                const msgSystemPath = result.binaryPath === '' ? ' [System Path]' : '';
                msg += `🔧 The linter installation path is not correctly configured. Make sure that you use the binary folder, not the binary path. TerosHDL found it in: "${result.binaryPath}"${msgSystemPath}\n`;
            } else {
                msg += `👎 The linter installation path is not correctly configured. The linter binary was not found in the system path or in the configured path. Check the documentation.\n`;
            }
        }

        msg += '\n\n';
    }

    globalLogger.info(msg, true);
}

async function checkFormatter(formatterManager: Formatter_manager) {
    let msg = '';

    msg += `\n${MSGSEPARATOR}\nChecking Formatter configuration\n${MSGSEPARATOR}\n`;

    const formatterVhdl = formatterManager.formatterVhdl;
    const formatterVerilog = formatterManager.formatterVerilog;

    const formatterList = [formatterVhdl, formatterVerilog];
    for (const formatter of formatterList) {
        const language = formatter.lang;
        const formatterName = formatter.get_formatter_name();
        const formatterOptions = formatter.get_formatter_config();

        const includedFormatters = [
            e_formatter_general_formatter_vhdl.standalone,
            e_formatter_general_formatter_verilog.istyle,
        ];
        const languageMsg = language === LANGUAGE.VHDL ? 'VHDL' : 'Verilog/SV';

        if (includedFormatters.includes(formatterName)) {
            msg += `⊙ Formatter ${formatterName} for ${languageMsg} is built into TerosHDL. Skipping configuration check.\n\n`;
            continue;
        }
        else if (formatterName === e_formatter_general_formatter_verilog.verible) {
            const result = await checkBinary('Verible', formatterOptions.path , "verible", ["--version"]);
            for (const [_, line] of result.messageList.entries()) {
                if (line !== '') {
                    msg += `     ${line}\n`;
                }
            }
            if (result.successfulConfig) {
                msg += '🎉 The formatter installation path is correctly configured.\n';
            } else if (result.successfulFind) {
                const msgSystemPath = result.binaryPath === '' ? ' [System Path]' : '';
                msg += `🔧 The formatter installation path is not correctly configured. Make sure that you use the binary folder, not the binary path. TerosHDL found it in: "${result.binaryPath}"${msgSystemPath}\n`;
            } else {
                msg += `👎 The formatter installation path is not correctly configured. The linter binary was not found in the system path or in the configured path. Check the documentation.\n`;
            }
        }
        msg += '\n\n';
    }

    globalLogger.info(msg, true);
}
