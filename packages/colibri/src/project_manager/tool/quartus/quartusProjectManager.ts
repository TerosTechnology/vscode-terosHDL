// This code only can be used for Quartus boards

import { e_project_type, t_action_result, t_file } from "../../common";
import { Project_manager } from "../../project_manager";
import * as chokidar from "chokidar";
import {
    QuartusExecutionError, addFilesToProject, removeFilesFromProject, setTopLevelPath,
    getProjectInfo, getFilesFromProject, createProject, getQuartusPath, cleanProject
} from "./utils";
import { e_config } from "../../../config/config_declaration";
import * as path_lib from 'path';
import events = require("events");
import { get_filename } from "../../../utils/file_utils";
import {
    e_artifact_type, e_element_type, e_reportType, e_taskType, t_taskRep,
    t_test_artifact
} from "../common";
import { p_result } from "../../../process/common";
import { ChildProcess } from "child_process";
import { runTask } from "./taskRunner";
import { get_directory } from "../../../utils/file_utils";
import { getDefaultTaskList } from "./common";
import { TaskStateManager } from "../taskState";

export class QuartusProjectManager extends Project_manager {

    private quartusProjectWatcher: chokidar.FSWatcher;

    constructor(name: string, projectPath: string, emitter: events.EventEmitter | undefined = undefined) {
        super(name, emitter);
        super.taskStateManager = new TaskStateManager(getDefaultTaskList());
        this.projectDiskPath = projectPath;

        this.quartusProjectWatcher = chokidar.watch('file', {
            usePolling: true, interval: 2000
        });
        this.quartusProjectWatcher.on('change', (_path, _stats) => {
            this.syncWithDisk();
        });
        this.quartusProjectWatcher.add(projectPath);
    }

    /**
     * Get project type
     * @returns Project type
     */
    public getProjectType(): e_project_type {
        return e_project_type.QUARTUS;
    }

    static async fromJson(config: e_config, jsonContent: any, emitter: events.EventEmitter):
        Promise<QuartusProjectManager> {
        try {
            const projectPath = jsonContent.project_disk_path;
            return await this.fromExistingQuartusProject(config, projectPath, emitter);
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
        projectDirectory: string, emitter: events.EventEmitter): Promise<QuartusProjectManager> {

        try {
            await createProject(config, projectDirectory, name, family, part);
            const projectPath = path_lib.join(projectDirectory, `${name}.qsf`);
            const project = new QuartusProjectManager(name, projectPath, emitter);
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
    static async fromExistingQuartusProject(config: e_config, project_path: string, emitter: events.EventEmitter)
        : Promise<QuartusProjectManager> {
        try {
            const projectInfo = await getProjectInfo(config, project_path);
            const projectFiles = await getFilesFromProject(config, project_path, true);

            const quartusProject = new QuartusProjectManager(projectInfo.name, project_path, emitter);

            // Search for toplevel path for top level entity
            if (projectInfo.topEntity !== "") {
                for (const file of projectFiles) {
                    if (projectInfo.topEntity === get_filename(file.name, false)) {
                        await quartusProject.add_toplevel_path(file.name);
                        break;
                    }
                }
            }

            // Add all files to project
            await quartusProject.add_file_from_array(projectFiles);

            return quartusProject;
        }
        catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
    }

    async syncWithDisk(): Promise<void> {
        const config = super.get_config();
        const quartusProjectInfo = await getProjectInfo(config, this.projectDiskPath);
        const quartusProjectFileList = await getFilesFromProject(config, this.projectDiskPath, true);

        super.clearFiles();
        await super.add_file_from_array(quartusProjectFileList);

        if (quartusProjectInfo.topEntity !== "") {
            for (const file of quartusProjectFileList) {
                if (get_filename(file.name, false) === quartusProjectInfo.topEntity) {
                    super.add_toplevel_path(file.name);
                    break;
                }
            }
        }
        super.notifyChanged();
    }

    public async add_toplevel_path(toplevel_path_inst: string): Promise<t_action_result> {
        const config = super.get_config();
        try {
            await setTopLevelPath(config, this.projectDiskPath, toplevel_path_inst);
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
            await addFilesToProject(config, this.projectDiskPath, file_list);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        return await super.add_file_from_array(file_list);
    }

    public async delete_file_by_logical_name(logical_name: string): Promise<t_action_result> {
        const fileList = super.get_file();
        const fileListToRemove = fileList.filter(file => file.logical_name === logical_name);

        const config = super.get_config();
        try {
            await removeFilesFromProject(config, this.projectDiskPath, fileListToRemove);
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
            await removeFilesFromProject(config, this.projectDiskPath, [fileToDelete]);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        super.notifyChanged();
        return super.delete_file(name, logical_name);
    }

    public getBuildSteps(): t_taskRep[] {
        return this.taskStateManager.getTaskList();
    }

    public runTask(taskType: e_taskType, callback: (result: p_result) => void): ChildProcess {
        const quartusDir = getQuartusPath();
        const projectDir = get_directory(this.projectDiskPath);
        this.taskStateManager.setRunning(taskType);
        return runTask(this.taskStateManager, taskType, quartusDir, projectDir, this.get_name(),
            this.get_name(), callback);
    }

    public cleallAllProject(callback: (result: p_result) => void): ChildProcess {
        const exec_i = cleanProject(this.projectDiskPath, callback);
        return exec_i;
    }

    public getArtifact(taskType: e_taskType, reportType: e_reportType): t_test_artifact {
        if (reportType === e_reportType.TIMINGANALYZER) {
            const command = `quartus_staw ${this.get_name()} -c ${this.get_name()}`;

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
            [e_taskType.QUARTUS_EARLYTIMINGANALYSIS]: "",
            [e_taskType.QUARTUS_FITTERIMPLEMENT]: "",
        };
        const reportKeys = Object.keys(reportSufix);
        if (reportType === e_reportType.REPORT && reportKeys.includes(taskType)) {
            const reportName = `${this.get_name()}.${reportSufix[taskType]}.rpt`;
            const reportPath = path_lib.join(get_directory(this.projectDiskPath), reportName);

            const artifact: t_test_artifact = {
                name: "Report",
                path: reportPath,
                command: "",
                artifact_type: e_artifact_type.SUMMARY,
                element_type: e_element_type.TEXT_FILE,
                content: undefined
            };
            return artifact;
        }
        return {} as t_test_artifact;
    }

}


