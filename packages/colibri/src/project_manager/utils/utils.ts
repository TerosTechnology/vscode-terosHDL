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

import { t_project_definition } from "../project_definition";
import * as file_utils from "../../utils/file_utils";
import * as general from "../../common/general";
import * as jsYaml from 'js-yaml';
const initSqlJs = require('sql.js');

export function get_edam_json(prj: t_project_definition, top_level_list: undefined | string[],
    refrence_path?: string) {

    // Set tool options in EDAM format
    const tool_name = prj.config.tools.general.select_tool;
    const tool_config = (<any>prj.config.tools)[tool_name];
    const tool_options = {
        name: tool_name,
        installation_path: tool_config['installation_path'],
        config: tool_config
    };

    const tmp_edam_0 = `{ "${tool_name}" : ${JSON.stringify(tool_options)} }`;
    const tmp_edam_1 = JSON.parse(tmp_edam_0);

    if (top_level_list === undefined) {
        top_level_list = prj.toplevel_path_manager.get(refrence_path);
    }

    let top_level = "";
    if (top_level_list.length > 0) {
        top_level = top_level_list[0];
    }

    const files = prj.file_manager.get(refrence_path);

    type t_edam_file = {
        /** File name with (absolute or relative) path */
        name: string;
        /** Indicates if this file should be treated as an include file (default false) */
        is_include_file: boolean;
        /** When is_include_file is true, the directory containing the file will be 
         * added to the include path. include_path allows setting an explicit directory to use instead */
        include_path: string;
        /** Logical name (e.g. VHDL/SystemVerilog library) of the file */
        logical_name: string;
        /** File type */
        file_type: string;
    }

    const edam_files = files.map((file) => {
        const edam_file_type = () => {
            switch (file.file_type) {
                case general.LANGUAGE.VHDL:
                    if (file.file_version === general.VHDL_LANG_VERSION.v2008) {
                        return `${file.file_type}-${file.file_version}`;
                    }
                    break;
                case general.LANGUAGE.VERILOG:
                    if (file.file_version === general.VERILOG_LANG_VERSION.v2005) {
                        return `${file.file_type}-${file.file_version}`;
                    }
                    break;
            }

            return file.file_type.toString();
        }

        const edam_file: t_edam_file = {
            name: file.name,
            include_path: file.include_path,
            is_include_file: file.is_include_file,
            logical_name: file.logical_name,
            file_type: edam_file_type()
        };

        return edam_file;
    })

    const edam_json = {
        name: prj.name,
        project_disk_path: prj.project_disk_path,
        project_type: prj.project_type,
        toplevel: top_level,
        files: edam_files,
        hooks: prj.hook_manager.get(),
        watchers: prj.watcher_manager.get(refrence_path),
        configuration: prj.config,
        tool_options: tmp_edam_1
    };

    return edam_json;
}

export function get_edam_yaml(prj: t_project_definition, top_level_list: undefined | string[],
    reference_path?: string) {
    const edamJSON = get_edam_json(prj, top_level_list, reference_path);
    const edamYaml = jsYaml.dump(edamJSON);
    return edamYaml;
}

/**
 * Get the file type for projec manager in string format
 * @param filepath File path. E.g: /home/user/file.vhd
 * @returns File type in string format
**/
export function get_file_type(filepath: string): string {
    const extension = file_utils.get_file_extension(filepath);
    const language = file_utils.get_language_from_extension(extension);
    if (language === general.LANGUAGE.NONE) {
        return extension.substring(1).toLocaleUpperCase();
    }
    const default_version = file_utils.get_default_version_for_language(language);
    let file_type: string = language;
    if (default_version !== undefined) {
        file_type += `-${default_version}`;
    }
    return file_type;
}

/**
 * Open the database and return the object
 * @param bbddPath Path to the database
 * @returns Promise with the database object
 */
export async function openDatabase(bbddPath: string) {
    try {
        const fs = require('fs');
        const filebuffer = fs.readFileSync(bbddPath);
        const SQL = await initSqlJs();
        const db = new SQL.Database(filebuffer);
    
        return db;
    }
    catch (error) {
        return undefined;
    }
}

/**
 * Close the database
 * @param db Database object
 */
export async function closeDatabase(db: any) {
    db.close();
}

/**
 * Exec query in the database
 * @param db Database object
 * @param query Query to execute
 * @returns Promise with the result of the query
 */
export async function execQuery(db: any, query: string): Promise<any[]> {
    try {
        const result: any = db.exec(query);

        const tableKeys = result[0].columns;
        const tableValues = result[0].values;

        const rows = tableValues.map((fila: any) => {
            const objeto: any = {};
            tableKeys.forEach((key: any, index: any) => {
                objeto[key] = fila[index];
            });
            return objeto;
        });
        return rows;
    } catch (error) {
        return [];
    }
}