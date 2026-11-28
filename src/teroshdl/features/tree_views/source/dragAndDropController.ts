import * as vscode from "vscode";
import * as path_lib from "path";
import * as element from "./element";
import { e_source_type, t_file } from "colibri/project_manager/common";
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
        INTERNAL_MIME_TYPE,
        "text/plain"
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
        const draggedFiles: unknown = JSON.parse(rawData);

        if (!Array.isArray(draggedFiles) || draggedFiles.length === 0) {
            return;
        }

        const files = draggedFiles as t_dragged_file[];

        if (files.some(file =>
            file === null ||
            typeof file !== "object" ||
            Array.isArray(file) ||
            typeof file.name !== "string" ||
            typeof file.logical_name !== "string"
        )) {
            return;
        }

        const selectedNames = files.map(file => file.name);

        if (new Set(selectedNames).size !== selectedNames.length) {
            vscode.window.showErrorMessage(
                "The selection contains files with duplicate names."
            );
            return;
        }

        const prj = this.project_manager.get_selected_project();

        const projectFiles = prj.get_file();

        // Preserve the original project order of the selected files.
        const orderedFiles = [...files].sort((a, b) => {
            const indexA = projectFiles.findIndex(file =>
                file.name === a.name &&
                file.logical_name === a.logical_name
            );

            const indexB = projectFiles.findIndex(file =>
                file.name === b.name &&
                file.logical_name === b.logical_name
            );
            return indexA - indexB;
        });

        const orderedNames = orderedFiles.map(file => file.name);

        // Drop on empty tree: move all selected files to the root library.
        if (target === undefined) {
            const result = await prj.move_files(files, "");

            if (!result.successful) {
                vscode.window.showErrorMessage(result.msg);
            }
            return;
        }

        // Drop on a library.
        if (target.contextValue === "library") {
            const targetLibrary = target.get_logical_name();

            const libraryFiles = prj.get_file().filter(file =>
                file.logical_name === targetLibrary &&
                file.name !== ""
            );

            const remainingFiles = libraryFiles.filter(
                file => !selectedNames.includes(file.name)
            );

            const moveResult = await prj.move_files(files, targetLibrary);

            if (!moveResult.successful) {
                vscode.window.showErrorMessage(moveResult.msg);
                return;
            }

            // Move all selected files to the end of the target library.
            const reorderResult = await prj.reorder_files(
                orderedNames,
                targetLibrary,
                remainingFiles.length
            );

            if (!reorderResult.successful) {
                vscode.window.showErrorMessage(reorderResult.msg);
            }

            return;
        }

        if (target.contextValue !== "source") {
            return;
        }

        const targetName = target.get_name();
        const targetLibrary = target.get_logical_name();

        // Do nothing if the drop target is part of the selection.
        if (files.some(file =>
                file.name === targetName &&
                file.logical_name === targetLibrary
            )
        ) {
            return;
        }

        // Calculate the target position before moving the selected files.
        const libraryFiles = prj.get_file().filter(file =>
            file.logical_name === targetLibrary &&
            file.name !== ""
        );

        const remainingFiles = libraryFiles.filter(
            file => !selectedNames.includes(file.name)
        );

        const targetIndex = remainingFiles.findIndex(
            file => file.name === targetName
        );

        if (targetIndex === -1) {
            return;
        }

        // Insert after the last file when it is used as the drop target.
        const insertionIndex = targetIndex === remainingFiles.length - 1
            ? targetIndex + 1
            : targetIndex;



        // Move all selected files to the target library.
        const moveResult = await prj.move_files(files, targetLibrary);

        if (!moveResult.successful) {
            vscode.window.showErrorMessage(moveResult.msg);
            return;
        }

        // Insert all selected files immediately before the target.
        const reorderResult = await prj.reorder_files(
            orderedNames,
            targetLibrary,
            insertionIndex
        );

        if (!reorderResult.successful) {
            vscode.window.showErrorMessage(reorderResult.msg);
        }
    }

    private async handleExternalDrop(
        target: element.Source_tree_element | undefined,
        data: vscode.DataTransferItem
    ): Promise<void> {

        const uriList = await data.asString();

        const uris = uriList
            .split(/\r?\n/)
            .filter(line => line.trim() !== "" && !line.startsWith("#"))
            .map(line => vscode.Uri.parse(line))
            .filter(uri => uri.scheme === "file");

        if (uris.length === 0) {
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

        for (const uri of uris) {
            const sourcePath = uri.fsPath;

            let stat: vscode.FileStat;

            try {
                stat = await vscode.workspace.fs.stat(uri);
            } catch (error) {
                vscode.window.showWarningMessage(
                    `Could not access ${path_lib.basename(sourcePath)}: ${String(error)}`
                );
                continue;
            }

            // Reject directories.
            if ((stat.type & vscode.FileType.Directory) !== 0) {
                vscode.window.showWarningMessage(
                    `Cannot add directory: ${path_lib.basename(sourcePath)}`
                );
                continue;
            }

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