import { e_project_type } from "../../common";
import { Project_manager } from "../../project_manager";
import {
    e_taskType, t_taskRep,
    t_test_declaration,
    t_test_result
} from "../common";
import { p_result } from "../../../process/common";
import { ChildProcess } from "child_process";
import { runTask } from "./taskRunner";
import { ProjectEmitter } from "../../projectEmitter";
import { TaskStateManager } from "../taskState";
import { getDefaultTaskList } from "./common";
import * as file_utils from "../../../utils/file_utils";
import { get_config_from_json } from "../../../config/config_declaration";
import { LoggerBase } from "colibri/logger/logger";

export class SandpiperProjectManager extends Project_manager {

    constructor(name: string, emitterProject: ProjectEmitter, projectDiskPath: string) {
        super(name, projectDiskPath, emitterProject, undefined);
        this._projectDiskPath = projectDiskPath;
        super.taskStateManager = new TaskStateManager(getDefaultTaskList());
    }

    public getProjectType(): e_project_type {
        return e_project_type.SANDPIPER;
    }

    public getTaskStatus(): { "taskList": t_taskRep[], "currentTask": e_taskType | undefined } {
        return {
            "taskList": this.taskStateManager.getTaskList(),
            "currentTask": this.taskStateManager.getCurrentTask()
        };
    }

    public runTask(taskType: e_taskType, _loggerBase: LoggerBase, callback: (result: p_result) => void): ChildProcess {
        this.taskStateManager.setCurrentTask(undefined);

        return runTask(
            taskType, this.taskStateManager, this._projectDiskPath, this.get_name(), this.emitterProject, callback
        );
    }

    public getRunTitle(): string {
        return "TESTBENCHES";
    }

    public async run(_test_list: t_test_declaration[],
        _callback: (result: t_test_result[]) => void,
        _callback_stream: (stream_c: any) => void): Promise<any> {

        return "Not implemented";
    }

    static async fromJson(jsonContent: any, reference_path: string, emitterProject: ProjectEmitter)
        : Promise<SandpiperProjectManager> {
        
        let projectDiskPath = "";
        try {
            projectDiskPath = jsonContent.project_disk_path;
        }
        catch (error) {
            console.log("Error reading project_disk_path from json");
        }

        const prj = new SandpiperProjectManager(jsonContent.name, emitterProject, projectDiskPath);
        
        await prj.restore_project_files(jsonContent, reference_path);
        // Toplevel

        if (jsonContent.toplevel !== undefined) {
            const toplevel_path = file_utils.get_absolute_path(file_utils.get_directory(reference_path),
                jsonContent.toplevel);
            if (file_utils.check_if_path_exist(toplevel_path)) {
                prj.add_toplevel_path(toplevel_path);
            }
        }

        if (jsonContent?.["configuration"] !== undefined) {
            await prj.set_config(get_config_from_json(jsonContent?.["configuration"]));
        }

        await prj.restore_project_watchers(jsonContent, reference_path);
        return prj;
    }

}