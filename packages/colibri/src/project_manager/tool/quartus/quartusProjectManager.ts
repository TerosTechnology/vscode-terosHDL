// This code only can be used for Quartus boards

import { e_project_type, t_action_result, t_file } from "../../common";
import { Project_manager } from "../../project_manager";
import * as chokidar from "chokidar";
import {
    QuartusExecutionError, addFilesToProject, removeFilesFromProject, setTopLevelPath, setConfigToProject,
    getProjectInfo, getFilesFromProject, createProject, getQuartusPath, cleanProject, createRPTReportFromRDB,
    setTopLevelTestbench,
} from "./utils";
import { getIpCatalog } from "./ipCatalog";
import {
    e_config, e_tools_general_execution_mode,
    e_tools_quartus_optimization_mode
} from "../../../config/config_declaration";
import * as path_lib from 'path';
import * as fs from 'fs';
import { get_filename } from "../../../utils/file_utils";
import {
    e_artifact_type, e_element_type, e_reportType, e_taskType, t_ipCatalogRep, t_taskRep,
    t_test_artifact,
    t_test_declaration,
    t_test_result
} from "../common";
import { p_result } from "../../../process/common";
import { ChildProcess } from "child_process";
import { runTask } from "./taskRunner";
import { get_directory } from "../../../utils/file_utils";
import { getDefaultTaskList } from "./common";
import { TaskStateManager } from "../taskState";
import { setStatus } from "./quartusDB";
import { GlobalConfigManager } from "../../../config/config_manager";
import { ProjectEmitter, e_event } from "../../projectEmitter";
import { get_toplevel_from_path } from "../../../utils/hdl_utils";
import { Process } from "../../../process/process";
import * as nunjucks from 'nunjucks';
import * as file_utils from "../../../utils/file_utils";
import * as process_utils from "../../../process/utils";

function getVersionDirectory(basePath: string): string {
    const defaultVersionDirectory = "23.3.0";
    try {
        const folders = fs.readdirSync(basePath).filter(file => {
            const fullPath = path_lib.join(basePath, file);
            const isDirectory = fs.statSync(fullPath).isDirectory();
            const matchesPattern = /^\d+(\.\d+)*\.?/.test(file);
            return isDirectory && matchesPattern;
        });

        if (folders.length === 0) {
            return defaultVersionDirectory;
        }

        return folders[0];
    } catch (error) {
        return defaultVersionDirectory;
    }
}

export class QuartusProjectManager extends Project_manager {

    private quartusStatusWatcher: chokidar.FSWatcher | undefined = undefined;
    private quartusDatabaseStatusPath = "";
    private currentRevision: string;
    private topLevelTestbench = "";

    constructor(name: string, projectPath: string, currentRevision: string,
        emitterProject: ProjectEmitter) {
        super(name, emitterProject);
        super.taskStateManager = new TaskStateManager(getDefaultTaskList());
        this.projectDiskPath = projectPath;
        this.currentRevision = currentRevision;

        emitterProject.addProjectListener(async (projectName: string, eventType: e_event) => {
            if (projectName === this.get_name() && eventType === e_event.FINISH_TASK) {
                await this.updateStatus(true);
            }
        });

        const basePath = path_lib.join(
            get_directory(this.projectDiskPath), "qdb", "_compiler", currentRevision, "_flat"
        );

        const folderVersion = getVersionDirectory(basePath);
        const newQuartusDatabaseStatusPath = path_lib.join(basePath, folderVersion, "legacy", "1", "runlog.db");
        this.quartusDatabaseStatusPath = newQuartusDatabaseStatusPath;

        // Status watcher
        this.quartusStatusWatcher = chokidar.watch(get_directory(this.projectDiskPath), {
            usePolling: true, interval: 500, persistent: true, depth: 7,
            ignored: ['*.txt', '*.rdb', '*.model', '*.db_info', '*.qmsgdb', '*.rpt', '*.kvp', '*.ddm'],
        });
        this.quartusStatusWatcher.on('change', (path, _stats) => {
            if (path === this.quartusDatabaseStatusPath) {
                this.updateStatus(false);
            }
            if (path === this.projectDiskPath) {
                this.syncWithDisk();
            }
        });
        this.quartusStatusWatcher.on('unlink', (path: any, _stats: any) => {
            if (path === this.quartusDatabaseStatusPath) {
                this.updateStatus(false);
            }
            if (path === this.projectDiskPath) {
                this.syncWithDisk();
            }
        });
    }

    /**
     * Get project type
     * @returns Project type
     */
    public getProjectType(): e_project_type {
        return e_project_type.QUARTUS;
    }

    static async fromJson(jsonContent: any, _reference_path: string,
        emitterProject: ProjectEmitter): Promise<QuartusProjectManager> {
        try {
            const projectPath = jsonContent.project_disk_path;
            return await this.fromExistingQuartusProject(
                GlobalConfigManager.getInstance().get_config(), projectPath, emitterProject);
        }
        catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
    }

    /**
     * Create a new Quartus project from directory.
     * @param config Configuration.
     * @param name Project name.
     * @param family FPGA family.
     * @param part FPGA part.
     * @param projectDirectory Project directory.
     * @param emitter Emitter function.
     * @returns Quartus project.
    **/
    static async fromNewQuartusProject(config: e_config, name: string, family: string, part: string,
        projectDirectory: string, emitterProject: ProjectEmitter)
        : Promise<QuartusProjectManager> {

        try {
            await createProject(config, projectDirectory, name, family, part, emitterProject);
            const projectPath = path_lib.join(projectDirectory, `${name}.qsf`);
            const project = new QuartusProjectManager(name, projectPath, name, emitterProject);
            return project;
        }
        catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
    }

    /**
     * Load an existing Quartus project from Quartus file path.
     * @param config Configuration.
     * @param project_path Quartus project path.
     * @param emitter Emitter function.
     * @returns Quartus project.
    **/
    static async fromExistingQuartusProject(config: e_config, project_path: string, emitterProject: ProjectEmitter)
        : Promise<QuartusProjectManager> {
        try {
            const projectInfo = await getProjectInfo(config, project_path, emitterProject);
            const projectFiles = await getFilesFromProject(config, project_path, true, emitterProject);

            const quartusProject = new QuartusProjectManager(projectInfo.name, project_path,
                projectInfo.currentRevision, emitterProject);

            // Search for toplevel path for top level entity
            if (projectInfo.topEntity !== "") {
                for (const file of projectFiles) {
                    if (projectInfo.topEntity === get_filename(file.name, false)) {
                        await quartusProject.add_toplevel_path_no_quartus_update(file.name);
                        break;
                    }
                }
            }

            // Set config
            await quartusProject.setConfigFromQuartusProject(
                projectInfo.family,
                projectInfo.part,
                projectInfo.optimization_mode,
                projectInfo.allow_register_retiming
            );

            quartusProject.setTopLevelTestbench(projectInfo.eda_test_bench_top_module);

            // Add all files to project
            await quartusProject.add_file_from_array_no_quartus_update(projectFiles);
            await quartusProject.updateStatus(true);
            return quartusProject;
        }
        catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
    }

    public setTopLevelTestbench(topLevelTestbench: string) {
        this.topLevelTestbench = topLevelTestbench;
    }

    private async setConfigFromQuartusProject(family: string, part: string,
        optimizationMode: e_tools_quartus_optimization_mode, allowRegisterRetime: boolean,
        emitEvent = true) {

        const configCurrent = this.get_config();
        configCurrent.tools.quartus.family = family;
        configCurrent.tools.quartus.device = part;
        configCurrent.tools.quartus.optimization_mode = optimizationMode;
        configCurrent.tools.quartus.allow_register_retiming = allowRegisterRetime;
        await super.set_config(configCurrent, emitEvent);
    }

    private async updateStatus(deleteRunning: boolean) {
        await setStatus(this.taskStateManager, this.quartusDatabaseStatusPath, deleteRunning);
        super.emitUpdateStatus();
    }

    async syncWithDisk(): Promise<void> {
        const config = super.get_config();
        const projectInfo = await getProjectInfo(config, this.projectDiskPath, this.emitterProject);
        const quartusProjectFileList = await getFilesFromProject(config, this.projectDiskPath, true,
            this.emitterProject);

        super.clearFiles(false);
        await super.add_file_from_array(quartusProjectFileList, false);

        if (projectInfo.topEntity !== "") {
            for (const file of quartusProjectFileList) {
                if (get_filename(file.name, false) === projectInfo.topEntity) {
                    super.add_toplevel_path(file.name, false);
                    break;
                }
            }
        }

        await this.setConfigFromQuartusProject(
            projectInfo.family,
            projectInfo.part,
            projectInfo.optimization_mode,
            projectInfo.allow_register_retiming,
            false,
        );
        this.setTopLevelTestbench(projectInfo.eda_test_bench_top_module);

        super.notifyChanged();
    }

    public async add_toplevel_path_no_quartus_update(toplevel_path_inst: string): Promise<t_action_result> {
        return super.add_toplevel_path(toplevel_path_inst);
    }

    public async add_toplevel_path(toplevel_path_inst: string): Promise<t_action_result> {
        const config = super.get_config();
        try {
            await setTopLevelPath(config, this.projectDiskPath, toplevel_path_inst, this.emitterProject);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        return super.add_toplevel_path(toplevel_path_inst);
    }

    public async add_file(file: t_file): Promise<t_action_result> {
        return await this.add_file_from_array([file]);
    }

    public async add_file_from_array(file_list: t_file[]): Promise<t_action_result> {
        const config = super.get_config();
        try {
            await addFilesToProject(config, this.projectDiskPath, file_list, this.emitterProject);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        return await super.add_file_from_array(file_list);
    }

    private async add_file_from_array_no_quartus_update(file_list: t_file[]): Promise<t_action_result> {
        return await super.add_file_from_array(file_list);
    }

    public async delete_file_by_logical_name(logical_name: string): Promise<t_action_result> {
        const fileList = super.get_file();
        const fileListToRemove = fileList.filter(file => file.logical_name === logical_name);

        const config = super.get_config();
        try {
            await removeFilesFromProject(config, this.projectDiskPath, fileListToRemove, this.emitterProject);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        super.notifyChanged();
        return super.delete_file_by_logical_name(logical_name);
    }

    public async delete_file(name: string, logical_name: string) {
        const projectFileList = super.get_file();
        let fileToDelete: undefined | t_file = undefined;
        for (const file of projectFileList) {
            if (file.name === name && file.logical_name === logical_name) {
                fileToDelete = file;
                break;
            }
        }

        if (fileToDelete === undefined) {
            throw new Error("File not found");
        }

        const config = super.get_config();
        try {
            await removeFilesFromProject(config, this.projectDiskPath, [fileToDelete], this.emitterProject);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        super.notifyChanged();
        return super.delete_file(name, logical_name);
    }

    public getTaskStatus(): { "taskList": t_taskRep[], "currentTask": e_taskType | undefined } {
        return {
            "taskList": this.taskStateManager.getTaskList(),
            "currentTask": this.taskStateManager.getCurrentTask()
        };
    }

    public async getIpCatalog(): Promise<t_ipCatalogRep[]> {
        const projectInfo = await getProjectInfo(this.get_config(), this.projectDiskPath, this.emitterProject);
        try {
            return await getIpCatalog(this.get_config(), projectInfo.family, this.projectDiskPath);
        }
        catch (error) {
            return [];
        }
    }

    public runTask(taskType: e_taskType, callback: (result: p_result) => void): ChildProcess {
        const config = super.get_config();

        this.taskStateManager.setCurrentTask(undefined);
        const quartusDir = getQuartusPath(config);
        const projectDir = get_directory(this.projectDiskPath);
        return runTask(taskType, quartusDir, projectDir, this.get_name(), this.currentRevision,
            this.emitterProject, callback);
    }

    public cleallAllProject(callback: (result: p_result) => void): ChildProcess {
        const config = super.get_config();

        const exec_i = cleanProject(this.get_name(), config, this.projectDiskPath, this.emitterProject, callback);
        return exec_i;
    }

    public async getArtifact(taskType: e_taskType, reportType: e_reportType): Promise<t_test_artifact> {
        if (reportType === e_reportType.TIMINGANALYZER) {
            const quartusBin = path_lib.join(getQuartusPath(this.get_config()), "quartus_staw");
            const command = `${quartusBin} ${this.get_name()} -c ${this.currentRevision}`;

            const artifact: t_test_artifact = {
                name: "Timing Analyzer",
                path: get_directory(this.projectDiskPath),
                command: command,
                artifact_type: e_artifact_type.COMMAND,
                element_type: e_element_type.NONE,
                content: undefined
            };
            return artifact;
        }
        const reportSufix: Record<e_taskType, string> = {
            [e_taskType.CHANGEDEVICE]: "",
            [e_taskType.SETTINGS]: "",
            [e_taskType.OPENFOLDER]: "",
            [e_taskType.QUARTUS_ANALYSISSYNTHESIS]: "syn",
            [e_taskType.QUARTUS_ANALYSISELABORATION]: "syn",
            [e_taskType.QUARTUS_SYNTHESIS]: "syn",
            [e_taskType.QUARTUS_FITTER]: "fit",
            [e_taskType.QUARTUS_PLAN]: "fit.plan",
            [e_taskType.QUARTUS_PLACE]: "fit.place",
            [e_taskType.QUARTUS_ROUTE]: "fit.route",
            [e_taskType.QUARTUS_FITTERFINALIZE]: "fit.finalize",
            [e_taskType.QUARTUS_TIMING]: "sta",
            [e_taskType.QUARTUS_COMPILEDESIGN]: "",
            [e_taskType.QUARTUS_IPGENERATION]: "",
            [e_taskType.QUARTUS_EARLYTIMINGANALYSIS]: "synthesized.sta",
            [e_taskType.QUARTUS_FITTERIMPLEMENT]: "",
        };
        let reportKeys = Object.keys(reportSufix);
        if (reportType === e_reportType.REPORT && reportKeys.includes(taskType)) {
            // const reportName = `${this.currentRevision}.${reportSufix[taskType]}.rpt`;
            // const reportPath = path_lib.join(get_directory(this.projectDiskPath), reportName);

            // const artifact: t_test_artifact = {
            //     name: "Report",
            //     path: reportPath,
            //     command: "",
            //     artifact_type: e_artifact_type.SUMMARY,
            //     element_type: e_element_type.TEXT_FILE,
            //     content: undefined
            // };

            const basePath = path_lib.join(
                get_directory(this.projectDiskPath), "qdb", "_compiler", this.currentRevision, "_flat",
            );
            const folderVersion = getVersionDirectory(basePath);
            const reportDirectory = path_lib.join(basePath, folderVersion, "_all", "1");
            const reportName = `report.${reportSufix[taskType]}.rdb`;

            const reportPath = path_lib.join(reportDirectory, reportName);

            const artifact: t_test_artifact = {
                name: "Report",
                path: await createRPTReportFromRDB(this.get_config(), reportPath),
                command: "",
                artifact_type: e_artifact_type.SUMMARY,
                element_type: e_element_type.TEXT_FILE,
                content: undefined
            };
            return artifact;
        }

        reportSufix[e_taskType.QUARTUS_IPGENERATION] = "ipg";
        reportSufix[e_taskType.QUARTUS_EARLYTIMINGANALYSIS] = "sta",
            reportKeys = Object.keys(reportSufix);
        if (reportType === e_reportType.REPORTDB && reportKeys.includes(taskType)) {
            const reportName = `${this.currentRevision}.${reportSufix[taskType]}.qmsgdb`;
            const reportPath = path_lib.join(get_directory(this.quartusDatabaseStatusPath), reportName);

            const artifact: t_test_artifact = {
                name: "Report",
                path: reportPath,
                command: "",
                artifact_type: e_artifact_type.LOG,
                element_type: e_element_type.DATABASE,
                content: undefined
            };
            return artifact;
        }
        return {} as t_test_artifact;
    }

    public async set_config(config: e_config): Promise<void> {
        await setConfigToProject(config, this.projectDiskPath, this.emitterProject);
        super.set_config(config);
    }

    public getRunTitle(): string {
        return "TESTBENCHES";
    }

    public async get_test_list(): Promise<t_test_declaration[]> {
        try {
            const projectInfo = await getProjectInfo(this.get_config(), this.projectDiskPath, this.emitterProject);
            const eda_test_bench_file = projectInfo.eda_test_bench_file;
            let eda_test_bench_top_module = projectInfo.eda_test_bench_top_module;

            if (eda_test_bench_file === "") {
                return [];
            }

            if (eda_test_bench_top_module === "") {
                eda_test_bench_top_module = get_toplevel_from_path(eda_test_bench_file);
            }

            if (eda_test_bench_top_module === "") {
                return [];
            }

            const testbench = {
                suite_name: "",
                name: eda_test_bench_top_module,
                test_type: "",
                filename: eda_test_bench_file,
                location: undefined,
            };
            return [testbench];
        }
        catch (error) {
            return [];
        }
    }

    public async setTestbench(filePath: string): Promise<t_action_result> {
        const result = {
            result: undefined,
            successful: false,
            msg: "",
        };
        try {
            setTopLevelTestbench(
                this.get_config(), this.projectDiskPath, filePath, this.emitterProject
            );
            // this.emitterProject.emitEvent(this.get_name(), e_event.SELECT_TOPLEVEL_TESTBENCH);
            result.successful = true;
        }
        catch (error) {
            result.successful = false;
        }
        return result;
    }

    public async run(_test_list: t_test_declaration[],
        callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void): Promise<any> {

        const config = this.get_config();
        const cmdList: string[] = [];

        const isCmdMode = config.tools.general.execution_mode === e_tools_general_execution_mode.cmd;
        if (isCmdMode) {
            cmdList.push("set sim_args [list simulation=[list --no_gui]]");
            cmdList.push("execute_flow -simulation -flow_args $sim_args");
        }
        else {
            cmdList.push("execute_flow -simulation");
        }


        const templateContent = file_utils.read_file_sync(path_lib.join(__dirname, 'bin', 'cmd_exec.tcl.nj'));
        const templateRender = nunjucks.renderString(
            templateContent, { "cmd_list": cmdList }).replace(/&quot;/g, "\"");

        // Create temp file
        const tclFile = process_utils.create_temp_file(templateRender);

        const cwd = get_directory(this.projectDiskPath);
        const opt_exec = { cwd: cwd };
        const p = new Process();

        const cmd = `quartus_sh -t "${tclFile}" "" "${this.projectDiskPath}"`;
        const exec_i = p.exec(cmd, opt_exec, (result: p_result) => {
            const resultOutput: t_test_result[] = [];
            if (isCmdMode) {
                const fileOut = process_utils.create_temp_file(result.stdout + result.stderr);
                const artifact_build: t_test_artifact = {
                    name: "Console output",
                    path: fileOut,
                    content: result.stdout + result.stderr,
                    command: "",
                    artifact_type: e_artifact_type.CONSOLE_LOG,
                    element_type: e_element_type.TEXT_FILE
                };

                const test_result: t_test_result = {
                    suite_name: "Simulation",
                    name: this.topLevelTestbench,
                    edam: "",
                    config_summary_path: "",
                    config: config,
                    artifact: [artifact_build],
                    build_path: cwd,
                    successful: result.successful,
                    stdout: result.stdout,
                    stderr: result.stderr,
                    time: 0,
                    test_path: "",
                };
                resultOutput.push(test_result);
            }
            callback(resultOutput);
        });
        callback_stream(exec_i);
        return exec_i;
    }
}