// This code only can be used for Quartus boards

import { e_config, e_tools_quartus_optimization_mode } from "../../../config/config_declaration";
import { TIMEOUTMSG, p_result } from "../../../process/common";
import { t_board_list, t_loader_action_result } from "../common";
import * as process_utils from "../../../process/utils";
import * as process_teros from "../../../process/process";
import * as file_utils from "../../../utils/file_utils";
import { get_toplevel_from_path } from "../../../utils/hdl_utils";
import * as path_lib from "path";
import { get_files_from_csv } from "../../prj_loaders/csv_loader";
import { e_source_type, e_timing_mode, t_file, t_timing_node, t_timing_path } from "../../common";
import { LANGUAGE } from "../../../common/general";
import * as process from 'process';
import { ChildProcess } from "child_process";
import { Process } from "../../../process/process";
import { ProjectEmitter, e_event } from "../../projectEmitter";
import { e_rtlType } from "./common";

export const LANGUAGE_MAP: Record<LANGUAGE, string> = {
    [LANGUAGE.VHDL]: "VHDL_FILE",
    [LANGUAGE.VERILOG]: "VERILOG_FILE",
    [LANGUAGE.SYSTEMVERILOG]: "SYSTEMVERILOG_FILE",
    [LANGUAGE.CPP]: "",
    [LANGUAGE.C]: "",
    [LANGUAGE.PYTHON]: "",
    [LANGUAGE.VERIBLELINTRULES]: "",
    [LANGUAGE.TCL]: "",
    [LANGUAGE.XDC]: "",
    [LANGUAGE.SDC]: "SDC_FILE",
    [LANGUAGE.PIN]: "",
    [LANGUAGE.XCI]: "",
    [LANGUAGE.SBY]: "",
    [LANGUAGE.PRO]: "",
    [LANGUAGE.NONE]: "",
    [LANGUAGE.QIP]: "",
    [LANGUAGE.UCF]: "",
    [LANGUAGE.IP]: "IP_FILE",
    [LANGUAGE.QSYS]: "QSYS_FILE",
};

export class QuartusExecutionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "QuartusExecutionError";
    }
}

/**
 * Normalize path with spaces
 * @param path Path to normalize
 * @returns path normalized
**/
function normalizePath(path: string): string {
    const regex = /[\s\t]/;

    if (regex.test(path)) {
        return `"${path}"`;
    }
    return path;
}

/**
 * Get Quartus binary directory.
 * @returns Quartus binary directory.
 */
function getBinFolder(): string {
    if (process.platform === "win32") {
        return "bin64";
    }
    return "bin";
}

/**
 * Get Quartus binary directory.
 * @returns Quartus binary directory.
**/
export function getQuartusPath(config: e_config): string {
    // Try with config installation path
    let quartusInstallationPath = config.tools.quartus.installation_path;
    if (quartusInstallationPath !== "") {
        if (file_utils.check_if_file(quartusInstallationPath)) {
            quartusInstallationPath = file_utils.get_directory(quartusInstallationPath);
        }

        const quartusBinPath = path_lib.join(quartusInstallationPath, "quartus");
        if (file_utils.check_if_path_exist(quartusBinPath)) {
            return normalizePath(quartusInstallationPath);
        }
    }

    // Try with environment variable QUARTUS_ROOTDIR
    const QUARTUS_ROOTDIR = process.env.QUARTUS_ROOTDIR;
    if (QUARTUS_ROOTDIR !== undefined && QUARTUS_ROOTDIR !== "") {
        const quartusRootDir = path_lib.resolve(path_lib.join(QUARTUS_ROOTDIR, getBinFolder()));
        return normalizePath(quartusRootDir);
    }

    // Try with environment variable QSYS_ROOTDIR
    const QSYS_ROOTDIR = process.env.QSYS_ROOTDIR;
    if (QSYS_ROOTDIR !== undefined && QSYS_ROOTDIR !== "") {
        const quartusRootDir = path_lib.resolve(path_lib.join(QSYS_ROOTDIR, "..", "..", "quartus", getBinFolder()));
        return normalizePath(quartusRootDir);
    }

    return "";
}

/**
 * Get qsys binary directory.
 * @returns qsys binary directory.
**/
export function getQsysPath(config: e_config): string {
    const qsysPath = path_lib.resolve(path_lib.join(getQuartusPath(config), "..", "..", "qsys", "bin"));
    return qsysPath;
}

/**
 * Execute Quartus tcl script.
 * @param config Configuration.
 * @param tcl_file Tcl file path.
 * @param args Arguments.
 * @param cwd Current working directory.
 * @param emitterProject Project emitter.
 * @param timeout Timeout in seconds.
 * @returns Result of execution.
**/
async function executeQuartusTcl(is_sta: boolean, config: e_config, tcl_file: string, args: string,
    cwd: string, emitterProject: ProjectEmitter, timeout: number | undefined)
    : Promise<{ result: p_result, csv_content: string }> {

    let binaryName = "quartus_sh";
    if (is_sta) {
        binaryName = "quartus_sta";
    }
    const quartus_bin = path_lib.join(getQuartusPath(config), binaryName);

    // Create temp file for out.csv
    const csv_file = process_utils.create_temp_file("");

    const options = { cwd: cwd, timeout: timeout };

    const cmd = `${quartus_bin} -t "${tcl_file}" "${csv_file}" ${args}`;
    const cmd_result = await (new process_teros.Process(undefined)).exec_wait(cmd, options);

    const csv_content = await file_utils.read_file_sync(csv_file);

    file_utils.remove_file(csv_file);

    let stdout = `\n${cmd_result.command}\n${cmd_result.stdout}\n${cmd_result.stderr}\n`;
    if (cmd_result.successful) {
        emitterProject.emitEventLog(stdout, e_event.STDOUT_INFO);
    } else {
        if (cmd_result.stderr === TIMEOUTMSG) {
            const tclContent = file_utils.read_file_sync(tcl_file);
            stdout += "TCL script executed: \n" + tclContent + "\n";
            emitterProject.emitEventLog(stdout, e_event.STDOUT_ERROR);
        }
        else {
            emitterProject.emitEventLog(stdout, e_event.STDOUT_ERROR);

        }
    }
    return { result: cmd_result, csv_content: csv_content };
}

/**
 * Get Quartus project info.
 * @param config Configuration.
 * @param projectPath Path to Quartus project.
 * @returns Quartus project info.
**/
export async function getProjectInfo(config: e_config, projectPath: string, emitterProject: ProjectEmitter)
    : Promise<{
        name: string, currentRevision: string, topEntity: string, revisionList: string[],
        family: string, part: string,
        optimization_mode: e_tools_quartus_optimization_mode, allow_register_retiming: boolean,
        eda_test_bench_file_list: string[],
        eda_test_bench_top_module: string,
        file_list: t_file[],
    }> {

    const args = `"${projectPath}"`;
    const tcl_file = path_lib.join(__dirname, 'bin', 'project_info.tcl');

    const cmd_result = await executeQuartusTcl(false, config, tcl_file, args, "", emitterProject, 22);

    let testbenchFileList: string[] = [];
    const result = {
        prj_name: "",
        prj_revision: "",
        prj_top_entity: "",
        revision_list: [""],
        family: "",
        part: "",
        optimization_mode: e_tools_quartus_optimization_mode.BALANCED,
        allow_register_retiming: false,
        eda_test_bench_file_list: [] as string[],
        eda_test_bench_top_module: "",
        file_list: [] as t_file[],
    };

    if (!cmd_result.result.successful) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }

    let optimization_mode = "";

    try {
        const line_split = cmd_result.csv_content.trim().split(/\r\n|\n|\r/);

        // General info
        const data_0 = line_split[0].split(',');
        if (data_0.length === 8) {
            result.prj_name = data_0[0].trim();
            result.prj_revision = data_0[1].trim();
            result.prj_top_entity = data_0[2].trim();
            result.family = data_0[3].trim();
            result.part = data_0[4].trim();
            optimization_mode = data_0[5].trim().replace(/ /g, "_");
            result.allow_register_retiming = data_0[6].trim() === "ON" ? true : false;
            result.eda_test_bench_top_module = data_0[7].trim();
        } else {
            throw new QuartusExecutionError("Error in Quartus execution");
        }

        // Revision list
        const data_1 = line_split[1].split(',');
        const revision_list = data_1.map((s: string) => s.trim());
        result.revision_list = revision_list;

        // Testbench file list
        if (line_split.length > 2) {
            testbenchFileList = line_split[2].split(',').map((s: string) => s.trim());
        }

        // File list
        if (line_split.length > 3) {
            const fileListStr = line_split.slice(3).join('\n');
            const csvFileList = process_utils.create_temp_file(fileListStr);
            const fileList = get_files_from_csv(csvFileList, false).file_list;

            for (const file of fileList) {
                if (testbenchFileList.includes(file.name)) {
                    file.source_type = e_source_type.SIMULATION;
                }
            }

            file_utils.remove_file(csvFileList);
            result.file_list = fileList;
        }
    } catch (error) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }

    for (const key in e_tools_quartus_optimization_mode) {
        if (e_tools_quartus_optimization_mode[key as keyof typeof e_tools_quartus_optimization_mode]
            === optimization_mode) {

            result.optimization_mode = e_tools_quartus_optimization_mode[
                key as keyof typeof e_tools_quartus_optimization_mode
            ];
            break;
        }
    }

    const projectInfo = {
        name: result.prj_name,
        currentRevision: result.prj_revision,
        topEntity: result.prj_top_entity,
        revisionList: result.revision_list,
        family: result.family,
        part: result.part,
        optimization_mode: result.optimization_mode,
        allow_register_retiming: result.allow_register_retiming,
        eda_test_bench_file_list: testbenchFileList,
        eda_test_bench_top_module: result.eda_test_bench_top_module,
        file_list: result.file_list,
    };
    return projectInfo;
}

/**
 * Get family and parts installed.
 * @param config Configuration.
 * @returns Quartus project info.
**/
export async function getFamilyAndParts(config: e_config, emitterProject: ProjectEmitter): Promise<t_board_list[]> {
    const tcl_file = path_lib.join(__dirname, 'bin', 'get_boards.tcl');
    const args = "";

    const cmd_result = await executeQuartusTcl(false, config, tcl_file, args, "", emitterProject, undefined);
    if (!cmd_result.result.successful) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }

    const boardList: t_board_list[] = [];
    try {
        const board_list_str = cmd_result.csv_content.split(/\r\n|\n|\r/);
        for (const board_str of board_list_str) {
            const board_list = board_str.split(',');

            const family = board_list[0].trim();
            const part = board_list.slice(1).map((s: string) => s.trim());

            if (family === "") {
                continue;
            }
            boardList.push({
                family: family,
                part_list: part
            });
        }
    } catch (error) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
    return boardList;
}

/**
 * Execute a list of commands in Quartus project.
 * @param config Configuration.
 * @param projectPath Path to Quartus project.
 * @param cmdList List of commands to execute.
**/
export async function executeCmdListQuartusProject(config: e_config, projectPath: string, cmdList: string[],
    emitterProject: ProjectEmitter): Promise<t_loader_action_result> {

    const templateRender = getTemplateRender(cmdList);

    // Create temp file
    const tclFile = process_utils.create_temp_file(templateRender);
    const args = `"${projectPath}"`;

    const cmdResult = await executeQuartusTcl(false, config, tclFile, args, "", emitterProject, undefined);

    const result: t_loader_action_result = {
        successful: cmdResult.result.successful,
        msg: cmdResult.result.stderr + cmdResult.result.stdout
    };

    // Delete temp file
    file_utils.remove_file(tclFile);

    return result;
}

/**
 * Add files to Quartus project.
 * @param config Configuration.
 * @param projectPath Path to Quartus project.
 * @param fileList List of files to add.
**/
export async function addFilesToProject(config: e_config, projectPath: string, fileList: t_file[],
    emitterProject: ProjectEmitter): Promise<void> {

    const cmd_list: string[] = [];
    for (const file of fileList) {
        let cmd = `set_global_assignment -name ${LANGUAGE_MAP[file.file_type]} ${file.name}`;
        if (file.logical_name !== "") {
            cmd += ` -library ${file.logical_name}`;
        }
        cmd_list.push(cmd);
    }

    const result = await executeCmdListQuartusProject(config, projectPath, cmd_list, emitterProject);
    if (!result.successful) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
}

/**
 * Remove files from Quartus project.
 * @param config Configuration.
 * @param projectPath Path to Quartus project.
 * @param fileList List of files to add.
**/
export async function removeFilesFromProject(config: e_config, projectPath: string, fileList: t_file[],
    emitterProject: ProjectEmitter): Promise<void> {
    const cmd_list: string[] = [];
    for (const file of fileList) {
        let cmd = `set_global_assignment -remove -name ${LANGUAGE_MAP[file.file_type]} ${file.name}`;
        if (file.logical_name !== "") {
            cmd += ` -library ${file.logical_name}`;
        }
        cmd_list.push(cmd);

        const fileRelative = file_utils.get_relative_path(file.name, projectPath);
        cmd = `set_global_assignment -remove -name ${LANGUAGE_MAP[file.file_type]} ${fileRelative}`;
        if (file.logical_name !== "") {
            cmd += ` -library ${file.logical_name}`;
        }
        cmd_list.push(cmd);
    }

    const result = await executeCmdListQuartusProject(config, projectPath, cmd_list, emitterProject);
    if (!result.successful) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
}

/**
 * Create a new Quartus project.
 * @param config Configuration.
 * @param projectDirectory Directory where the project will be created.
 * @param name Project name.
 * @returns Quartus project info.
**/
export async function createProject(config: e_config, projectDirectory: string, name: string,
    family: string, part: string, emitterProject: ProjectEmitter): Promise<void> {

    const tcl_file = path_lib.join(__dirname, 'bin', 'create_project.tcl');
    const args = `"${name}" "${family}" "${part}"`;

    const cmd_result = await executeQuartusTcl(false, config, tcl_file, args, projectDirectory, emitterProject,
        undefined);
    if (!cmd_result.result.successful) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
}

/**
 * Set top level path in Quartus project.
 * @param config Configuration.
 * @param projectPath Path to Quartus project.
 * @param topLevelPath Top level path.
**/
export async function setTopLevelPath(config: e_config, projectPath: string, topLevelPath: string,
    emitterProject: ProjectEmitter): Promise<void> {
    const entityName = get_toplevel_from_path(topLevelPath);
    const cmd = `set_global_assignment -name TOP_LEVEL_ENTITY ${entityName}`;
    if (entityName === "") {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
    const result = await executeCmdListQuartusProject(config, projectPath, [cmd], emitterProject);
    if (!result.successful) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
}

/**
 * Set top level path in Quartus project.
 * @param config Configuration.
 * @param projectPath Path to Quartus project.
 * @param topLevelTestbenchPath Top level testbench path.
 * @param emitterProject Project emitter.
**/
export async function setTopLevelTestbench(config: e_config, projectPath: string, topLevelTestbenchPath: string,
    emitterProject: ProjectEmitter): Promise<void> {

    const entityName = get_toplevel_from_path(topLevelTestbenchPath);
    if (entityName === "") {
        throw new QuartusExecutionError("Error in Quartus execution");
    }

    const cmd = [
        `set_global_assignment -name EDA_TEST_BENCH_FILE ${topLevelTestbenchPath} -section_id testbenchSet`,
        "remove_all_global_assignments -name EDA_TEST_BENCH_TOP_MODULE",
        `set_global_assignment -name EDA_TEST_BENCH_TOP_MODULE ${entityName} -section_id testbenchSet`
    ];

    const result = await executeCmdListQuartusProject(config, projectPath, cmd, emitterProject);
    if (!result.successful) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
}

/**
 * Set testebench file in Quartus project.
 * @param config Configuration.
 * @param projectPath Path to Quartus project.
 * @param testenchPath Testbench path.
 * @param emitterProject Project emitter.
**/
export async function setTestbenchFileList(config: e_config, projectPath: string, testbenchFileList: t_file[],
    emitterProject: ProjectEmitter): Promise<void> {

    const cmd = [
        "remove_all_global_assignments -name EDA_TEST_BENCH_FILE",
    ];

    for (const file of testbenchFileList) {
        let libCMD = "";
        if (file.logical_name !== "") {
            libCMD = ` -library ${file.logical_name}`;
        }
        cmd.push(`set_global_assignment -name EDA_TEST_BENCH_FILE ${file.name} -section_id testbenchSet ${libCMD}`);
    }

    const result = await executeCmdListQuartusProject(config, projectPath, cmd, emitterProject);
    if (!result.successful) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
}

/**
 * Cleans the project by executing Quartus' project_clean command.
 * 
 * @param projectName The name of the project.
 * @param config The configuration object.
 * @param projectPath The path to the project.
 * @param emitter The project emitter object.
 * @param callback The callback function to be called with the result.
 * @returns The ChildProcess object representing the execution of the command.
 */
export function cleanProject(projectName: string, config: e_config, projectPath: string,
    emitter: ProjectEmitter, callback: (result: p_result) => void): ChildProcess {

    const cmdList = ["project_clean"];

    const templateRender = getTemplateRender(cmdList);

    // Create temp file
    const tclFile = process_utils.create_temp_file(templateRender);
    const args = `"${projectPath}"`;

    const quartus_bin = path_lib.join(getQuartusPath(config), "quartus_sh");

    // Create temp file for out.csv
    const csv_file = process_utils.create_temp_file("");

    const cmd = `${quartus_bin} -t ${tclFile} ${csv_file} ${args}`;

    const opt_exec = { cwd: path_lib.dirname(projectPath) };
    const p = new Process();

    const exec_i = p.exec(cmd, opt_exec, (result: p_result) => {
        emitter.emitEvent(projectName, e_event.FINISH_TASK);
        callback(result);
    });
    return exec_i;
}

/**
 * Creates an HTML report from an RDB file.
 * 
 * @param config The configuration object.
 * @param rdbPath The path to the RDB file.
 * @returns A promise that resolves to the HTML content of the report.
 */
export async function createHTMLReportFromRDB(config: e_config, rdbPath: string): Promise<string> {
    const tmpFile = process_utils.create_temp_file("");
    const htmlFile = tmpFile + ".html";

    let htmlContent = "";

    try {
        const opt_exec = { cwd: path_lib.dirname(rdbPath) };
        const p = new Process();

        const binPath = path_lib.join(getQuartusPath(config), "rdb_convert");
        const cmd = `${binPath} --input ${rdbPath} --output ${htmlFile}`;

        const result = await p.exec_wait(cmd, opt_exec);

        if (result.successful) {
            htmlContent = file_utils.read_file_sync(htmlFile);
        }

    } catch (error) { /* empty */ }
    finally {
        file_utils.remove_file(tmpFile);
        file_utils.remove_file(htmlFile);
    }
    return htmlContent;
}

/**
 * Creates an RPT report file from an RDB file.
 * 
 * @param config The configuration object.
 * @param rdbPath The path to the RDB file.
 * @returns A promise that resolves to the path of the created RPT report file.
 */
export async function createRPTReportFromRDB(config: e_config, rdbPath: string): Promise<string> {
    const rptFile = rdbPath + ".rpt";
    file_utils.remove_file(rptFile);

    try {
        const opt_exec = { cwd: path_lib.dirname(rdbPath) };
        const p = new Process();

        const binPath = path_lib.join(getQuartusPath(config), "rdb_convert");
        const cmd = `${binPath} --input ${rdbPath} --output ${rptFile}`;

        await p.exec_wait(cmd, opt_exec);
    } catch (error) { /* empty */ }
    return rptFile;
}

export async function getTimingReport(config: e_config, projectPath: string, emitterProject: ProjectEmitter,
    numOfPaths: number, timingMode: e_timing_mode): Promise<t_timing_path[]> {

    let strMode = "final";
    if (timingMode === e_timing_mode.EARLY) {
        strMode = "synthesized";
    }

    const args = `"${projectPath}" "${numOfPaths}" "${strMode}"`;
    const tcl_file = path_lib.join(__dirname, 'bin', 'get_timing_report.tcl');

    const cmd_result = await executeQuartusTcl(true, config, tcl_file, args, "", emitterProject, undefined);
    if (!cmd_result.result.successful) {
        return [];
    }

    const pathSections = cmd_result.csv_content.split(/\n(?=Path .+)/);

    let indexPath = 0;
    return pathSections.map(section => {
        ++indexPath;

        const lines = section.trim().split('\n');
        const firstLineSplit = lines[0].split(',');

        const pathName = firstLineSplit[0];
        const slack = parseFloat(firstLineSplit[1]);
        const levelsNumber = parseInt(firstLineSplit[2], 10);

        let total_delay = 0;
        let indexNode = 0;
        const nodes = lines.slice(1).map(line => {
            ++indexNode;
            const [name, cell_location, lineStr0, path, lineStr] = line.split(',');
            const incremental_delay = parseFloat(lineStr0);
            total_delay += incremental_delay;
            total_delay = parseFloat(total_delay.toFixed(3));
            return {
                name, index: indexNode, cell_location, incremental_delay, total_delay,
                path, line: parseInt(lineStr, 10)
            } as t_timing_node;
        });

        const fromNodeName = nodes.length > 0 ? nodes[0].name : "";
        const toNodeName = nodes.length > 0 ? nodes[nodes.length - 1].name : "";

        const fromPath = nodes.length > 0 ? nodes[0].path : "";
        const toPath = nodes.length > 0 ? nodes[nodes.length - 1].path : "";

        const fromLine = nodes.length > 0 ? nodes[0].line : 0;
        const toLine = nodes.length > 0 ? nodes[nodes.length - 1].line : 0;

        return {
            name: pathName,
            index: indexPath,
            slack: slack,
            nodeList: nodes,
            levelsNumber: levelsNumber,
            fromNodeName: fromNodeName,
            toNodeName: toNodeName,
            fromPath: fromPath,
            toPath: toPath,
            fromLine: fromLine,
            toLine: toLine,
        } as t_timing_path;
    });
}

export async function setConfigToProject(config: e_config, projectPath: string,
    emitterProject: ProjectEmitter): Promise<void> {

    const cmdList: string[] = [];

    // Allow Register Retiming
    const allowRegisterRetiming = config.tools.quartus.allow_register_retiming;
    let allow = "OFF";
    if (allowRegisterRetiming) {
        allow = "ON";
    }
    cmdList.push(`set_global_assignment -name ALLOW_REGISTER_RETIMING ${allow}`);

    // Optimization mode
    const optimizationMode = config.tools.quartus.optimization_mode.toLocaleUpperCase().replace(/_/g, " ");
    cmdList.push(`set_global_assignment -name OPTIMIZATION_MODE ${optimizationMode}`);

    // Family and device
    const family = config.tools.quartus.family;
    const device = config.tools.quartus.device;
    // eslint-disable-next-line no-useless-escape
    cmdList.push(`set_global_assignment -name FAMILY "${family}"`);
    cmdList.push(`set_global_assignment -name DEVICE ${device}`);

    // Optimization effort
    await executeCmdListQuartusProject(config, projectPath, cmdList, emitterProject);
}

export async function openRTLAnalyzer(config: e_config, projectPath: string, emitterProject: ProjectEmitter,
    rtlType: e_rtlType): Promise<void> {

    const cmdList: string[] = [
        `tmwq_open_rtl_analyzer dms_path::user_runs::default_run::${rtlType}`,
    ];

    await executeCmdListQuartusProject(config, projectPath, cmdList, emitterProject);
}


export function getTemplateRender(cmdList: string[]) {
    const templateRender = `
    set csv_file_name [lindex $argv 0]
    set project_path [lindex $argv 1]
    
    #open Quartus project
    project_open -force -current_revision $project_path
    
    ${cmdList.join("\n")}
`;
    return templateRender;
}