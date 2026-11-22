import * as vscode from "vscode";
import * as path_lib from "path";
import * as element from "./element";
import {
    e_source_type,
    t_file
} from "colibri/project_manager/common";
import {
    get_default_version_for_filepath,
    get_language_from_filepath
} from "colibri/utils/file_utils";

const INTERNAL_MIME_TYPE = "application/vnd.code.tree.teroshdl-view-source";

type t_dragged_file = {
    name: string;
    logical_name: string;
};

export class SourceDragAndDropController
    implements vscode.TreeDragAndDropController<element.Source_tree_element> {

    readonly dropMimeTypes = [
        "text/uri-list",
        "application/vnd.code.tree.teroshdl-view-source",
        "text/plain",
        INTERNAL_MIME_TYPE
    ];

    readonly dragMimeTypes = [
        INTERNAL_MIME_TYPE
    ];

    constructor(private project_manager: import("colibri/project_manager/multi_project_manager").Multi_project_manager) {}

    async handleDrag(
        source: readonly element.Source_tree_element[],
        dataTransfer: vscode.DataTransfer,
        _token: vscode.CancellationToken
    ): Promise<void> {

        const files = source
            .filter(item => item.contextValue === "source")
            .map(item => ({
                name: item.get_name(),
                logical_name: item.get_logical_name()
            }));

        if (files.length === 0) {
            return;
        }

        if (files.length > 1) {
            vscode.window.showWarningMessage("Please drag one source file at a time.");
            return;
        }

        dataTransfer.set(
            INTERNAL_MIME_TYPE,
            new vscode.DataTransferItem(JSON.stringify(files))
        );
    }

    async handleDrop(
        target: element.Source_tree_element | undefined,
        dataTransfer: vscode.DataTransfer,
        _token: vscode.CancellationToken
    ): Promise<void> {

        try {
            const internalData = dataTransfer.get(INTERNAL_MIME_TYPE);

            if (internalData !== undefined) {
                await this.handleInternalDrop(target, internalData);
                return;
            }

            const uriData = dataTransfer.get("text/uri-list");

            if (uriData !== undefined) {
                await this.handleExternalDrop(target, uriData);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Drag and Drop failed: ${String(error)}`);
        }
    }

    private async handleInternalDrop(
        target: element.Source_tree_element | undefined,
        data: vscode.DataTransferItem
    ): Promise<void> {

        const rawData = await data.asString();
        const draggedFiles: t_dragged_file[] = JSON.parse(rawData);

        if (!Array.isArray(draggedFiles) || draggedFiles.length !== 1) {
            return;
        }

        const draggedFile = draggedFiles[0];

        if (
            typeof draggedFile.name !== "string" ||
            typeof draggedFile.logical_name !== "string"
        ) {
            return;
        }

        const prj = this.project_manager.get_selected_project();

        if (target === undefined || target.contextValue === "library") {
            const targetLibrary = target?.get_logical_name() ?? "";

            const result = await prj.move_file(
                draggedFile.name,
                draggedFile.logical_name,
                targetLibrary
            );

            if (!result.successful) {
                vscode.window.showErrorMessage(result.msg);
            }

            return;
        }

        if (target.contextValue !== "source") {
            return;
        }

        const targetName = target.get_name();
        const targetLibrary = target.get_logical_name();

        if (draggedFile.name === targetName &&
            draggedFile.logical_name === targetLibrary) {
            return;
        }

        if (draggedFile.logical_name !== targetLibrary) {
            const result = await prj.move_file(
                draggedFile.name,
                draggedFile.logical_name,
                targetLibrary
            );

            if (!result.successful) {
                vscode.window.showErrorMessage(result.msg);
            }

            return;
        }

        const libraryFiles = prj.get_file().filter(file =>
            file.logical_name === targetLibrary && file.name !== ""
        );

        const currentIndex = libraryFiles.findIndex(file =>
            file.name === draggedFile.name
        );

        const targetIndex = libraryFiles.findIndex(file =>
            file.name === targetName
        );

        if (currentIndex === -1 || targetIndex === -1) {
            return;
        }

        const newIndex = targetIndex > currentIndex
            ? targetIndex - 1
            : targetIndex;

        const result = await prj.reorder_file(
            draggedFile.name,
            draggedFile.logical_name,
            newIndex
        );

        if (!result.successful) {
            vscode.window.showErrorMessage(result.msg);
        }
    }

    private async handleExternalDrop(
        target: element.Source_tree_element | undefined,
        data: vscode.DataTransferItem
    ): Promise<void> {

        const uriList = await data.asString();

        const paths = uriList
            .split(/\r?\n/)
            .filter(line => line.trim() !== "" && !line.startsWith("#"))
            .map(line => vscode.Uri.parse(line))
            .filter(uri => uri.scheme === "file")
            .map(uri => uri.fsPath);

        if (paths.length === 0) {
            return;
        }

        let targetLibrary = "";

        if (target !== undefined) {
            if (target.contextValue === "library") {
                targetLibrary = target.get_logical_name();
            } else if (target.contextValue === "source") {
                targetLibrary = target.get_logical_name();
            } else {
                return;
            }
        }

        const prj = this.project_manager.get_selected_project();

        for (const sourcePath of paths) {
            const file: t_file = {
                name: path_lib.normalize(sourcePath),
                is_include_file: false,
                include_path: "",
                logical_name: targetLibrary,
                is_manual: true,
                file_type: get_language_from_filepath(sourcePath),
                file_version: get_default_version_for_filepath(sourcePath),
                source_type: e_source_type.NONE
            };

            const result = await prj.add_file(file);

            if (!result.successful) {
                vscode.window.showWarningMessage(
                    `Could not add ${path_lib.basename(sourcePath)}: ${result.msg}`
                );
            }
        }
    }
}