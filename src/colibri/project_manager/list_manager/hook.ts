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

import { t_stage_script, t_script, e_script_stage, t_action_result } from "../common";
import { Manager } from "./manager";

/** Hooks are scripts that can be registered to execute during various phases of Edalize. The Hook 
 * structure contains a key for each of the four defined stages, and the value of each 
 * key is a list of Script to be executed. */
export class Hook_manager extends Manager<t_script, e_script_stage, t_script, e_script_stage>{

    private stage_list: t_stage_script = {
        pre_build: [],
        post_build: [],
        pre_run: [],
        post_run: []
    };

    clear() {
        this.stage_list = {
            pre_build: [],
            post_build: [],
            pre_run: [],
            post_run: []
        };
    }

    get(): t_stage_script {
        return this.stage_list;
    }

    add(script: t_script, script_stage: e_script_stage): t_action_result {
        // Check if script exists
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        const script_list = this.get_script_stage(script_stage);
        if (this.check_if_exists(script, script_list)) {
            result.successful = false;
            result.msg = "Script name is duplicated";
            return result;
        }
        this.add_script_to_stage(script, script_stage);
        return result;
    }

    delete(script: t_script, script_stage: e_script_stage): t_action_result {
        // Check if script exists
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        const script_list = this.get_script_stage(script_stage);
        if (this.check_if_exists(script, script_list) === false) {
            result.successful = false;
            result.msg = "Script name doesn't exist";
            return result;
        }
        this.delete_script_in_stage(script, script_stage);
        return result;
    }

    private check_if_exists(script: t_script, script_list: t_script[]) {
        for (let i = 0; i < script_list.length; i++) {
            const element = script_list[i];
            if (script.name === element.name) {
                return true;
            }
        }
        return false;
    }

    private add_script_to_stage(script: t_script, stage: e_script_stage) {

        if (stage === e_script_stage.POST_BUILD) {
            this.stage_list.post_build.push(script);
        }
        else if (stage === e_script_stage.POST_RUN) {
            this.stage_list.post_run.push(script);
        }
        else if (stage === e_script_stage.PRE_BUILD) {
            this.stage_list.pre_build.push(script);
        }
        else {
            this.stage_list.pre_run.push(script);
        }
    }

    private delete_script_in_stage(script: t_script, stage: e_script_stage) {

        const script_list = this.get_script_stage(stage);
        const new_script_list = [];

        for (let i = 0; i < script_list.length; i++) {
            const element = script_list[i];
            if (element.name !== script.name) {
                new_script_list.push(script);
            }
        }

        if (stage === e_script_stage.POST_BUILD) {
            this.stage_list.post_build = new_script_list;
        }
        else if (stage === e_script_stage.POST_RUN) {
            this.stage_list.post_run = new_script_list;
        }
        else if (stage === e_script_stage.PRE_BUILD) {
            this.stage_list.pre_build = new_script_list;
        }
        else {
            this.stage_list.pre_run = new_script_list;
        }
    }

    private get_script_stage(stage: e_script_stage): t_script[] {
        if (stage === e_script_stage.POST_BUILD) {
            return this.stage_list.post_build;
        }
        else if (stage === e_script_stage.POST_RUN) {
            return this.stage_list.post_run;
        }
        else if (stage === e_script_stage.PRE_BUILD) {
            return this.stage_list.pre_build;
        }
        else {
            return this.stage_list.pre_run;
        }
    }
}