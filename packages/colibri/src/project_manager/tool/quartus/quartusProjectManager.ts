// This code only can be used for Quartus boards

import { t_action_result, t_file } from "../../common";
import { Project_manager } from "../../project_manager";
import { get_toplevel_from_path } from "../../../utils/hdl_utils"
import * as chokidar from "chokidar";
import {
    QuartusExecutionError, addFilesToProject, removeFilesFromProject, setTopLevelPath,
    getProjectInfo, getFilesFromProject
} from "./utils";

export class QuartusProjectManager extends Project_manager {

    private projectPath: string;
    private quartusProjectWatcher: chokidar.FSWatcher;

    constructor(name: string, projectPath: string) {
        super(name);
        this.projectPath = projectPath;

        this.quartusProjectWatcher = chokidar.watch('file', {
            usePolling: true, interval: 2000
        });
        this.quartusProjectWatcher.on('change', (_path, _stats) => {
            this.refreshFromQuartusProject();
        });
    }

    async refreshFromQuartusProject() {
        const config = super.get_config();
        const quartusProjectInfo = await getProjectInfo(config, this.projectPath);
        const quartusProjectFileList = await getFilesFromProject(config, this.projectPath, true);

        super.files.clear();
        super.add_file_from_array(quartusProjectFileList);

        for (const file of quartusProjectFileList) {
            if (get_toplevel_from_path(file.name) !== quartusProjectInfo.topEntity) {
                super.add_toplevel_path(file.name);
            }
        }
    }

    public add_toplevel_path(toplevel_path_inst: string): t_action_result {
        const config = super.get_config();
        try {
            setTopLevelPath(config, this.projectPath, toplevel_path_inst);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        return super.add_toplevel_path(toplevel_path_inst);
    }

    public add_file(file: t_file): t_action_result {
        return this.add_file_from_array([file]);
    }

    public add_file_from_array(file_list: t_file[]): t_action_result {
        const config = super.get_config();
        try {
            addFilesToProject(config, this.projectPath, file_list);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        return super.add_file_from_array(file_list);
    }

    public delete_file(name: string, logical_name: string) {
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
            removeFilesFromProject(config, this.projectPath, [fileToDelete]);
        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
        return super.delete_file(name, logical_name);
    }
}