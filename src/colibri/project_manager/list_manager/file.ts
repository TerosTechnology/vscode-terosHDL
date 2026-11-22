// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
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

import { t_file, t_action_result, t_logical, e_source_type } from "../common";
import * as file_utils from "../../utils/file_utils";
import { Manager } from "./manager";
import { Dependency_graph } from "../dependency/dependency";
import { LANGUAGE, t_version_inst } from "../../common/general";
import { get_files_from_csv } from "../prj_loaders/csv_loader";

export class File_manager extends Manager<t_file, undefined, string, string> {
    private files: t_file[] = [];

    async order(python_path: string, compileOrderPath: string) {
        try {
            if (compileOrderPath !== "") {
                const orderResult = get_files_from_csv(compileOrderPath, false);
                if (orderResult.successful && orderResult.file_list.length > 0) {
                    const fileListInOrder = orderResult.file_list;

                    const orderedFiles = fileListInOrder.filter(fileInOrder =>
                        this.files.some(file =>
                            file.name === fileInOrder.name && file.logical_name === fileInOrder.logical_name
                        )
                    );

                    const remainingFiles = this.files.filter(file =>
                        !fileListInOrder.some(fileInOrder =>
                            file.name === fileInOrder.name && file.logical_name === fileInOrder.logical_name
                        )
                    );

                    this.files = [...orderedFiles, ...remainingFiles];
                }
            }
        }
        catch (error) { /* empty */ }

        // Get compile order from dependency graph
        const dep_manger = new Dependency_graph();
        const dep_result = await dep_manger.get_compile_order(this.files, python_path);
        if (dep_result.successful) {
            this.files = dep_result.file_order;
            return;
        }

        // Order by lib
        const lib_files: t_file[] = [];
        const non_lib_files: t_file[] = [];

        this.files.forEach(element => {
            if (element.logical_name === "") {
                non_lib_files.push(element);
            }
            else {
                lib_files.push(element);
            }
        });

        this.files = lib_files.concat(non_lib_files);
    }

    clear() {
        this.files = [];
    }

    clear_automatic_files() {
        const new_files: t_file[] = [];
        this.files.forEach(file => {
            if (file.is_manual === true) {
                new_files.push(file);
            }
        });
        this.files = new_files;
    }

    get(reference_file_path?: string): t_file[] {
        if (reference_file_path !== undefined) {
            const new_files = this.files.map(obj => ({ ...obj }));
            for (let i = 0; i < new_files.length; i++) {
                new_files[i].name = file_utils.get_relative_path(new_files[i].name, reference_file_path);
            }
            return new_files;
        }
        return this.files;
    }

    get_by_logical_name(): t_logical[] {
        const logical_list: t_logical[] = [];
        this.files.forEach(file_inst => {
            let exist = false;

            // Find logic name exists
            logical_list.every(logical_inst => {
                // Logical name exists
                if (logical_inst.name === file_inst.logical_name) {
                    logical_inst.file_list.push(file_inst);
                    exist = true;
                    return false;
                }
                return true;
            });
            if (exist === false) {
                logical_list.push({ name: file_inst.logical_name, file_list: [file_inst] });
            }
        });
        return logical_list;
    }

    add(file: t_file): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(file.name, file.logical_name)) {
            result.successful = false;
            result.msg = "The file is duplicated";
            return result;
        }

        const complete_file: t_file = {
            name: file.name,
            file_type: file.file_type,
            file_version: file_utils.check_default_version_for_filepath(file.name, file.file_version),
            is_include_file: file.is_include_file,
            include_path: file.include_path,
            logical_name: file.logical_name,
            is_manual: file.is_manual,
            source_type: file.source_type,
        };

        this.files.push(complete_file);
        return result;
    }

    move_file(name: string, from_library: string, to_library: string): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        if (from_library === to_library) {
            return result;
        }

        const file = this.files.find(element =>
            element.name === name && element.logical_name === from_library
        );

        if (file === undefined) {
            result.successful = false;
            result.msg = "File doesn't exist in the source library";
            return result;
        }

        if (this.check_if_exists(name, to_library)) {
            result.successful = false;
            result.msg = "The file already exists in the destination library";
            return result;
        }

        file.logical_name = to_library;
        return result;
    }

    move_files(files: { name: string; logical_name: string }[], to_library: string): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        if (files.length === 0) {
            return result;
        }

        // Validate that the selection does not contain duplicate files.
        const selected_files = new Set(
            files.map(file => `${file.logical_name}\0${file.name}`)
        );

        if (selected_files.size !== files.length) {
            result.successful = false;
            result.msg = "The selection contains duplicate files";
            return result;
        }

        // Validate all files before changing anything.
        const files_to_move: t_file[] = [];

        for (const selected_file of files) {
            const file = this.files.find(element =>
                element.name === selected_file.name &&
                element.logical_name === selected_file.logical_name
            );

            if (file === undefined) {
                result.successful = false;
                result.msg = `File doesn't exist in its source library: ${selected_file.name}`;
                return result;
            }

            if (
                selected_file.logical_name !== to_library &&
                this.check_if_exists(selected_file.name, to_library)
            ) {
                result.successful = false;
                result.msg = `The file already exists in the destination library: ${selected_file.name}`;
                return result;
            }

            files_to_move.push(file);
        }

        // Move all selected files to the destination library.
        files_to_move.forEach(file => {
            file.logical_name = to_library;
        });
        return result;
    }

    reorder_file(name: string, library: string, new_index: number): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        const library_files = this.files.filter(file =>
            file.logical_name === library && file.name !== ""
        );

        const current_index = library_files.findIndex(file =>
            file.name === name
        );

        if (current_index === -1) {
            result.successful = false;
            result.msg = "File doesn't exist in the specified library";
            return result;
        }

        if (!Number.isInteger(new_index) || new_index < 0 || new_index >= library_files.length) {
            result.successful = false;
            result.msg = "Invalid file position";
            return result;
        }

        const file = library_files.splice(current_index, 1)[0];
        library_files.splice(new_index, 0, file);

        let library_index = 0;

        this.files = this.files.map(existing_file => {
            if (existing_file.logical_name === library && existing_file.name !== "") {
                return library_files[library_index++];
            }
            return existing_file;
        });
        return result;
    }

        reorder_files(names: string[], library: string, new_index: number): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        if (names.length === 0) {
            return result;
        }

        // Validate that the selection does not contain duplicate files.
        const selected_names = new Set(names);

        if (selected_names.size !== names.length) {
            result.successful = false;
            result.msg = "The selection contains duplicate files";
            return result;
        }

        const library_files = this.files.filter(file =>
            file.logical_name === library && file.name !== ""
        );

        const selected_files: t_file[] = [];

        for (const name of names) {
            const file = library_files.find(element => element.name === name);

            if (file === undefined) {
                result.successful = false;
                result.msg = `File doesn't exist in the specified library: ${name}`;
                return result;
            }

            selected_files.push(file);
        }

        const remaining_files = library_files.filter(file =>
            !selected_names.has(file.name)
        );

        if (!Number.isInteger(new_index) || new_index < 0 ||
            new_index > remaining_files.length
        ) {
            result.successful = false;
            result.msg = "Invalid file position";
            return result;
        }

        remaining_files.splice(new_index, 0, ...selected_files);

        let library_index = 0;

        this.files = this.files.map(existing_file => {
            if (existing_file.logical_name === library && existing_file.name !== "") {
                return remaining_files[library_index++];
            }
            return existing_file;
        });
        return result;
    }

    configureSource(name: string, logical_name: string, fileType: LANGUAGE, fileVersion: t_version_inst,
        sourceType: e_source_type): t_action_result {

        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(name, logical_name) === false) {
            result.successful = false;
            result.msg = "Toplevel path doesn't exist";
            return result;
        }

        for (let i = 0; i < this.files.length; i++) {
            const fileInst = this.files[i];
            if (fileInst.name === name && fileInst.logical_name === logical_name) {
                fileInst.file_type = fileType;
                fileInst.file_version = fileVersion;
                fileInst.source_type = sourceType;
            }
        }
        return result;
    }

    delete(name: string, logical_name = ""): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(name, logical_name) === false) {
            result.successful = false;
            result.msg = "Toplevel path doesn't exist";
            return result;
        }

        const new_files: t_file[] = [];
        this.files.forEach(file => {
            if (file.name !== name || file.logical_name !== logical_name) {
                new_files.push(file);
            }
        });
        this.files = new_files;
        return result;
    }

    delete_by_logical_name(logical_name: string): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: false,
            msg: ""
        };
        this.files.forEach(file_inst => {
            if (logical_name === file_inst.logical_name) {
                this.delete(file_inst.name, logical_name);
                result.successful = true;
            }
        });
        return result;
    }

    add_logical(logical_name: string) {
        const magic_file: t_file = {
            name: "",
            is_include_file: false,
            include_path: "",
            logical_name: logical_name,
            is_manual: false,
            file_type: LANGUAGE.NONE,
            file_version: undefined,
            source_type: e_source_type.NONE,
        };
        return this.add(magic_file);
    }

    private check_if_exists(name: string, logical_name = ""): boolean {
        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            if (file.name === name && file.logical_name === logical_name) {
                return true;
            }
        }
        return false;
    }
}