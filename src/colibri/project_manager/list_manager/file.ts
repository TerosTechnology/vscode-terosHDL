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

import * as path from "path";
import { t_file, t_action_result, t_logical, e_file_origin, e_source_type } from "../common";
import * as file_utils from "../../utils/file_utils";
import { Manager } from "./manager";
import { Dependency_graph } from "../dependency/dependency";
import { LANGUAGE, t_version_inst } from "../../common/general";
import { get_files_from_csv } from "../prj_loaders/csv_loader";

export class File_manager extends Manager<t_file, undefined, string, string> {
    private files: t_file[] = [];
    private compile_order: t_file[] = [];
    private library_overrides = new Map<string, {
        name: string;
        original_library: string;
        target_library: string;
    }>();

    private get_library_override_key(name: string, original_library: string): string {
        return JSON.stringify([name, original_library]);
    }

    private update_override(
        name: string,
        from_library: string,
        to_library: string,
        is_manual: boolean
    ): void {
        if (is_manual || from_library === to_library) {
            return;
        }

        let original_library = from_library;

        for (const override of this.library_overrides.values()) {
            if (override.name === name && override.target_library === from_library) {
                original_library = override.original_library;
                break;
            }
        }

        const override_key = this.get_library_override_key(name, original_library);

        if (to_library === original_library) {
            this.library_overrides.delete(override_key);
        }
        else {
            this.library_overrides.set(override_key, {
                name,
                original_library,
                target_library: to_library
            });
        }
    }

    public get_library_overrides(): {
        name: string;
        original_library: string;
        target_library: string;
    }[] {
        return Array.from(this.library_overrides.values()).map(override => ({
            ...override
        }));
    }

    public set_library_overrides(overrides: {
        name: string;
        original_library: string;
        target_library: string;
    }[]): void {
        this.library_overrides.clear();

        overrides.forEach(override => {
            const key = this.get_library_override_key(
                override.name,
                override.original_library
        );
            this.library_overrides.set(key, { ...override });
        });
    }

    public get_automatic_library(name: string, original_library: string): string {
        return this.library_overrides.get(this.get_library_override_key(name, original_library))?.target_library
            ?? original_library;
    }

    public get_visual_order(): string[] {
        return this.files.map(file =>
            JSON.stringify([file.name, file.logical_name])
        );
    }

    public apply_visual_order(order: string[]): void {
        if (order.length === 0) {
            return;
        }

        const ordered_files: t_file[] = [];
        const remaining_files = [...this.files];

        order.forEach(key => {
            const index = remaining_files.findIndex(file =>
                JSON.stringify([file.name, file.logical_name]) === key
            );

            if (index !== -1) {
                ordered_files.push(remaining_files.splice(index, 1)[0]);
            }
        });

        this.files = [...ordered_files, ...remaining_files];
        this.invalidate_compile_order();
    }

async order(python_path: string, compileOrderPath: string) {
    let ordered_files = [...this.files];

    try {
        if (compileOrderPath !== "") {
            const orderResult = get_files_from_csv(compileOrderPath, false);

            if (orderResult.successful && orderResult.file_list.length > 0) {
                const fileListInOrder = orderResult.file_list;

                const orderedFiles = fileListInOrder.filter(fileInOrder =>
                    ordered_files.some(file =>
                        file.name === fileInOrder.name &&
                        file.logical_name === fileInOrder.logical_name
                    )
                );

                const remainingFiles = ordered_files.filter(file =>
                    !fileListInOrder.some(fileInOrder =>
                        file.name === fileInOrder.name &&
                        file.logical_name === fileInOrder.logical_name
                    )
                );

                ordered_files = [...orderedFiles, ...remainingFiles];
            }
        }
    }
    catch (error) { /* empty */ }

    const dep_manager = new Dependency_graph();
    const dep_result = await dep_manager.get_compile_order(ordered_files, python_path);

    if (dep_result.successful) {
        this.compile_order = dep_result.file_order;
        return;
    }

    const lib_files: t_file[] = [];
    const non_lib_files: t_file[] = [];

    ordered_files.forEach(element => {
        if (element.logical_name === "") {
            non_lib_files.push(element);
        }
        else {
            lib_files.push(element);
        }
    });

    this.compile_order = lib_files.concat(non_lib_files);
}

    get_compile_order(): t_file[] {
        return this.compile_order.length > 0
        ? [...this.compile_order]
        : [...this.files];
    }

    private invalidate_compile_order(): void {
        this.compile_order = [];
    }

    clear() {
        this.files = [];
        this.library_overrides.clear();
        this.invalidate_compile_order();
    }

    clear_automatic_files() {
        const new_files: t_file[] = [];
        this.files.forEach(file => {
            if (file.is_manual === true || file.name === "") {
                new_files.push(file);
            }
        });
        this.files = new_files;
        this.invalidate_compile_order();
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

        const target_library = file.is_manual
            ? file.logical_name
            : this.get_automatic_library(file.name, file.logical_name);

        if (this.check_if_exists(file.name, target_library)) {
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
            logical_name: target_library,
            is_manual: file.is_manual,
            source_type: file.source_type,
        };

        this.files.push(complete_file);
        this.invalidate_compile_order();
        return result;
    }

    /** Merge provenance for the same file and library; conflicting metadata is rejected. */
    add_contribution(file: t_file): t_action_result {
        const origins = Array.from(new Set(file.origins ?? []));
        const watcher_paths = file.watcher_paths ?? [];
        const invalid = (msg: string): t_action_result => ({ result: "", successful: false, msg });

        if (file.name === "") {
            return invalid("An empty library entry cannot have file contributions");
        }
        if (origins.some(origin => !Object.values(e_file_origin).includes(origin))) {
            return invalid("Invalid file origin");
        }
        if (!file.is_manual && origins.length === 0) {
            return invalid("An automatic contribution must have an origin");
        }
        if (watcher_paths.some(watcher_path => !path.isAbsolute(watcher_path))) {
            return invalid("Watcher paths must be absolute");
        }
        const normalized_paths = Array.from(new Set(watcher_paths.map(watcher_path => path.normalize(watcher_path))));
        if (origins.includes(e_file_origin.WATCHER) !== (normalized_paths.length > 0)) {
            return invalid("Watcher origins and watcher paths must be specified together");
        }

        const target_library = file.is_manual
            ? file.logical_name
            : this.get_automatic_library(file.name, file.logical_name);
        const existing = this.files.find(item => item.name === file.name && item.logical_name === target_library);
        const version = file_utils.check_default_version_for_filepath(file.name, file.file_version);

        if (existing !== undefined) {
            if (existing.file_type !== file.file_type || existing.file_version !== version ||
                existing.is_include_file !== file.is_include_file || existing.include_path !== file.include_path ||
                existing.source_type !== file.source_type) {
                return invalid("Conflicting file metadata");
            }

            const existing_origins = existing.origins ?? (
                existing.is_manual ? [] : [e_file_origin.UNKNOWN]
            );
            existing.origins = Array.from(new Set([...existing_origins, ...origins]));
            existing.watcher_paths = Array.from(new Set([...(existing.watcher_paths ?? []), ...normalized_paths]));
            existing.is_manual = existing.is_manual || file.is_manual;
            return { result: "", successful: true, msg: "" };
        }

        const result = this.add(file);
        if (result.successful) {
            const added = this.files[this.files.length - 1];
            added.origins = origins;
            added.watcher_paths = normalized_paths;
        }
        return result;
    }

    remove_watcher_contribution(watcher_path: string): t_action_result {
        if (!path.isAbsolute(watcher_path)) {
            return { result: "", successful: false, msg: "Watcher paths must be absolute" };
        }
        const normalized_path = path.normalize(watcher_path);
        let removed = false;
        this.files = this.files.filter(file => {
            if (!file.watcher_paths?.includes(normalized_path)) {
                return true;
            }
            file.watcher_paths = file.watcher_paths.filter(item => item !== normalized_path);
            if (file.watcher_paths.length === 0) {
                file.origins = file.origins?.filter(origin => origin !== e_file_origin.WATCHER);
            }
            const keep = file.is_manual || (file.origins?.length ?? 0) > 0;
            removed ||= !keep;
            return keep;
        });
        if (removed) {
            this.invalidate_compile_order();
        }
        return { result: "", successful: true, msg: "" };
    }

    remove_origin_contribution(
        name: string,
        logical_name: string,
        origin: e_file_origin.QUARTUS | e_file_origin.OTHER
    ): t_action_result {
        if (origin !== e_file_origin.QUARTUS && origin !== e_file_origin.OTHER) {
            return { result: "", successful: false, msg: "Invalid removable origin" };
        }
        const file = this.files.find(item => item.name === name && item.logical_name === logical_name);
        if (file === undefined || !file.origins?.includes(origin)) {
            return { result: "", successful: false, msg: "File origin does not exist" };
        }

        file.origins = file.origins.filter(item => item !== origin);
        if (!file.is_manual && file.origins.length === 0) {
            this.files = this.files.filter(item => item !== file);
            this.invalidate_compile_order();
        }
        return { result: "", successful: true, msg: "" };
    }

    remove_manual_contribution(name: string, logical_name: string): t_action_result {
        const file = this.files.find(item => item.name === name && item.logical_name === logical_name);
        if (file === undefined || !file.is_manual) {
            return { result: "", successful: false, msg: "Manual contribution does not exist" };
        }
        file.is_manual = false;
        if ((file.origins?.length ?? 0) === 0) {
            this.files = this.files.filter(item => item !== file);
            this.invalidate_compile_order();
        }
        return { result: "", successful: true, msg: "" };
    }

    private copy_for_contributions(): File_manager {
        const candidate = new File_manager();
        candidate.files = this.files.map(file => ({
            ...file,
            origins: file.origins?.slice(),
            watcher_paths: file.watcher_paths?.slice()
        }));
        candidate.library_overrides = new Map(this.library_overrides);
        return candidate;
    }

    private commit_contributions(candidate: File_manager): void {
        candidate.apply_visual_order(this.get_visual_order());
        const compileInputs = (files: t_file[]) => files.map(file => [
            file.name, file.logical_name, file.file_type, file.file_version,
            file.is_include_file, file.include_path, file.source_type
        ]);
        if (JSON.stringify(compileInputs(this.files)) !== JSON.stringify(compileInputs(candidate.files))) {
            this.invalidate_compile_order();
        }
        this.files = candidate.files;
    }

    add_contributions(files: t_file[], validate_only = false): t_action_result {
        const candidate = this.copy_for_contributions();
        for (const file of files) {
            const result = candidate.add_contribution(file);
            if (!result.successful) {
                return { ...result, msg: `File ${file.name} (${file.logical_name}): ${result.msg}` };
            }
        }
        if (!validate_only) {
            this.commit_contributions(candidate);
        }
        return { result: "", successful: true, msg: "" };
    }

    replace_quartus_contributions(files: t_file[]): t_action_result {
        const candidate = this.copy_for_contributions();
        for (const file of [...candidate.files]) {
            if (file.origins?.includes(e_file_origin.QUARTUS)) {
                candidate.remove_origin_contribution(file.name, file.logical_name, e_file_origin.QUARTUS);
            }
        }
        for (const file of files) {
            const result = candidate.add_contribution({
                ...file, is_manual: false, origins: [e_file_origin.QUARTUS], watcher_paths: []
            });
            if (!result.successful) {
                return { ...result, msg: `Quartus file ${file.name} (${file.logical_name}): ${result.msg}` };
            }
        }
        this.commit_contributions(candidate);
        return { result: "", successful: true, msg: "" };
    }

    replace_watcher_contributions(contributions: { file: t_file; watcher_path: string }[]): t_action_result {
        const candidate = this.copy_for_contributions();
        const previous_paths = new Set(candidate.files.flatMap(file => file.watcher_paths ?? []));
        for (const watcher_path of previous_paths) {
            const result = candidate.remove_watcher_contribution(watcher_path);
            if (!result.successful) {
                return result;
            }
        }

        for (const { file, watcher_path } of contributions) {
            const result = candidate.add_contribution({
                ...file,
                is_manual: false,
                origins: [e_file_origin.WATCHER],
                watcher_paths: [watcher_path]
            });
            if (!result.successful) {
                return {
                    ...result,
                    msg: `Watcher ${watcher_path}, file ${file.name} (${file.logical_name}): ${result.msg}`
                };
            }
        }

        this.commit_contributions(candidate);
        return { result: "", successful: true, msg: "" };
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

        this.update_override(name, from_library, to_library,
            file.is_manual && (file.origins?.length ?? 0) === 0);

        file.logical_name = to_library;
        this.invalidate_compile_order();
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
        const selected_files = new Set(files.map(file => file.name));

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
            this.update_override(
                file.name,
                file.logical_name,
                to_library,
                file.is_manual && (file.origins?.length ?? 0) === 0
            );

            file.logical_name = to_library;
        });
        this.invalidate_compile_order();
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
        this.invalidate_compile_order();
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
        this.invalidate_compile_order();
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
        this.invalidate_compile_order();
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
        this.invalidate_compile_order();
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
                this.invalidate_compile_order();
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