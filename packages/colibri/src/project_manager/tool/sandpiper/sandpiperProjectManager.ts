import { e_project_type, e_source_type } from "../../common";
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

export class SandpiperProjectManager extends Project_manager {

    constructor(name: string, emitterProject: ProjectEmitter, projectDiskPath: string) {
        super(name, emitterProject);
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

    public runTask(taskType: e_taskType, callback: (result: p_result) => void): ChildProcess {
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
        
        // Files
        jsonContent.files.forEach((file: any) => {
            const name = file_utils.get_absolute_path(file_utils.get_directory(reference_path), file.name);

            const is_include_file = file?.["is_include_file"] ?? false;
            const include_path = file?.["include_path"] ?? "";
            const logical_name = file?.["logical_name"] ?? "";
            const is_manual = file?.["is_manual"] ?? true;
            const file_type = file_utils.get_language_from_filepath(name);
            const file_version = file_utils.check_default_version_for_filepath(name, file.file_version);
            const source_type = file?.["source_type"] ?? e_source_type.NONE;

            prj.add_file({
                name: name, is_include_file: is_include_file,
                include_path: include_path, logical_name: logical_name,
                is_manual: is_manual, file_type: file_type,
                file_version: file_version,
                source_type: source_type,
            });
        });
        // Toplevel

        if (jsonContent.toplevel !== undefined) {
            const toplevel_path = file_utils.get_absolute_path(file_utils.get_directory(reference_path),
                jsonContent.toplevel);
            if (file_utils.check_if_path_exist(toplevel_path)) {
                prj.add_toplevel_path(toplevel_path);
            }
        }

        // Watchers
        const watcher_list = jsonContent?.["watchers"] ?? [];
        watcher_list.forEach((watcher: any) => {
            prj.add_file_to_watcher(watcher);
        });

        if (jsonContent?.["configuration"] !== undefined) {
            await prj.set_config(get_config_from_json(jsonContent?.["configuration"]));
        }

        return prj;
    }

}