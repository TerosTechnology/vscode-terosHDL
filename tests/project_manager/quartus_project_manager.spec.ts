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

import { GlobalConfigManager } from "../../src/colibri/config/config_manager";
import { p_result } from "../../src/colibri/process/common";
import { Process } from "../../src/colibri/process/process";
import { ProjectEmitter } from "../../src/colibri/project_manager/projectEmitter";
import { QuartusProjectManager } from "../../src/colibri/project_manager/tool/quartus/quartusProjectManager";


const DEFAULT_NAME = "def_name";
const CATEGORY_A = "category_a";
const CATEGORY_B = "category_b";
const CATEGORY_C = "category_c";
const FAMILY_A = "test_family_a";
const FAMILY_B = "test_family_b";
const FAMILY_C = "test_family_c";
const COMPONENT_A = "component_a";
const COMPONENT_B = "component_b";
const DISPLAY_NAME = "display_";

describe('quartusProjectManager', () => {
    let project_manager: QuartusProjectManager;

    beforeEach(() => {
        // Config setup
        try {
            GlobalConfigManager.getInstance();
        } catch (error) {
            GlobalConfigManager.newInstance("");
        }
        // Create project
        project_manager = new QuartusProjectManager(DEFAULT_NAME, "", "", new ProjectEmitter());
        // Mock project info
        const config = project_manager.get_config();
        config.tools.quartus.family = FAMILY_A;
        project_manager.set_config(config);
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should handle an empty catalog without raising an exception", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(0);
    });

    it("should handle an empty file without raising an exception", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: "",
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(0);
    });

    describe('should add a component', () => {

        it("with one category", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A} /// ${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);
            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);
            expect(ip_list[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        });

        it("with two categories", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);
            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(1);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A]);

        });

        it("with no supported family", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(0);

        });

        it("with another supported family", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(0);

        });

        it("with invalid supported family format", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}//${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(0);

        });


        it("without name nor display", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name=""
                                displayName=""
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);
            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);
            expect(ip_list[0].children[0].name).toBe("");
            expect(ip_list[0].children[0].display_name).toBe("");
            expect(ip_list[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        });

        it("without category", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name=""
                                displayName=""
                                categories=""
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);
            expect(ip_list[0].name).toBe("");
            expect(ip_list[0].display_name).toBe("");
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);
            expect(ip_list[0].children[0].name).toBe("");
            expect(ip_list[0].children[0].display_name).toBe("");
            expect(ip_list[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        });

    });

    it("should ignore a component with hide from quartus", async () => {

        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="true" />
                        </component>
                    </catalog>
                `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(0);


    });

    it("should ignore a component without hide from quartus param", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                        </component>
                    </catalog>
                `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(0);

    });

    describe("should add multiple components", () => {

        it("in same category", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                        <component
                                name="${COMPONENT_B}"
                                displayName="${DISPLAY_NAME}${COMPONENT_B}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);

            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(2);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

            expect(ip_list[0].children[0].children[1].name).toBe(COMPONENT_B);
            expect(ip_list[0].children[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
            expect(ip_list[0].children[0].children[1].is_group).toBe(false);
            expect(ip_list[0].children[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);
        });


        it("in a category with the same name but different level", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                        <component
                                name="${COMPONENT_B}"
                                displayName="${DISPLAY_NAME}${COMPONENT_B}"
                                categories="${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(2);

            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(1);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

            expect(ip_list[1].children[0].name).toBe(COMPONENT_B);
            expect(ip_list[1].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
            expect(ip_list[1].children[0].is_group).toBe(false);
            expect(ip_list[1].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);
        });


        it("in a different category", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                        <component
                                name="${COMPONENT_B}"
                                displayName="${DISPLAY_NAME}${COMPONENT_B}"
                                categories="${CATEGORY_C}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(2);

            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(1);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

            expect(ip_list[1].name).toBe(CATEGORY_C);
            expect(ip_list[1].display_name).toBe(CATEGORY_C);
            expect(ip_list[1].is_group).toBe(true);
            expect(ip_list[1].children.length).toBe(1);

            expect(ip_list[1].children[0].name).toBe(COMPONENT_B);
            expect(ip_list[1].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
            expect(ip_list[1].children[0].is_group).toBe(false);
            expect(ip_list[1].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);
        });


        it("in a category with different level", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                        <component
                                name="${COMPONENT_B}"
                                displayName="${DISPLAY_NAME}${COMPONENT_B}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);

            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(2);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(1);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

            expect(ip_list[0].children[1].name).toBe(COMPONENT_B);
            expect(ip_list[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
            expect(ip_list[0].children[1].is_group).toBe(false);
            expect(ip_list[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);
        });

    });

    it("should add a plugin", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <plugin
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A} /// ${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(1);
        expect(ip_list[0].name).toBe(CATEGORY_A);
        expect(ip_list[0].display_name).toBe(CATEGORY_A);
        expect(ip_list[0].is_group).toBe(true);
        expect(ip_list[0].children.length).toBe(1);
        expect(ip_list[0].children[0].name).toBe(COMPONENT_A);
        expect(ip_list[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
        expect(ip_list[0].children[0].is_group).toBe(false);
        expect(ip_list[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

    });

    it("should add multiple plugins", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <plugin
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                    <plugin
                            name="${COMPONENT_B}"
                            displayName="${DISPLAY_NAME}${COMPONENT_B}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(1);

        expect(ip_list[0].name).toBe(CATEGORY_A);
        expect(ip_list[0].display_name).toBe(CATEGORY_A);
        expect(ip_list[0].is_group).toBe(true);
        expect(ip_list[0].children.length).toBe(1);

        expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].is_group).toBe(true);
        expect(ip_list[0].children[0].children.length).toBe(2);

        expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
        expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
        expect(ip_list[0].children[0].children[0].is_group).toBe(false);
        expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        expect(ip_list[0].children[0].children[1].name).toBe(COMPONENT_B);
        expect(ip_list[0].children[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
        expect(ip_list[0].children[0].children[1].is_group).toBe(false);
        expect(ip_list[0].children[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);


    });

    it("should add components and plugins in the same catalog and category", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <plugin
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                    <component
                            name="${COMPONENT_B}"
                            displayName="${DISPLAY_NAME}${COMPONENT_B}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </component>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(1);

        expect(ip_list[0].name).toBe(CATEGORY_A);
        expect(ip_list[0].display_name).toBe(CATEGORY_A);
        expect(ip_list[0].is_group).toBe(true);
        expect(ip_list[0].children.length).toBe(1);

        expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].is_group).toBe(true);
        expect(ip_list[0].children[0].children.length).toBe(2);

        expect(ip_list[0].children[0].children[1].name).toBe(COMPONENT_A);
        expect(ip_list[0].children[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
        expect(ip_list[0].children[0].children[1].is_group).toBe(false);
        expect(ip_list[0].children[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_B);
        expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
        expect(ip_list[0].children[0].children[0].is_group).toBe(false);
        expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);

    });


    it("should handle multiple catalogs", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <plugin
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                </catalog>
                <catalog>
                    <component
                            name="${COMPONENT_B}"
                            displayName="${DISPLAY_NAME}${COMPONENT_B}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </component>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(1);

        expect(ip_list[0].name).toBe(CATEGORY_A);
        expect(ip_list[0].display_name).toBe(CATEGORY_A);
        expect(ip_list[0].is_group).toBe(true);
        expect(ip_list[0].children.length).toBe(1);

        expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].is_group).toBe(true);
        expect(ip_list[0].children[0].children.length).toBe(2);

        expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
        expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
        expect(ip_list[0].children[0].children[0].is_group).toBe(false);
        expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        expect(ip_list[0].children[0].children[1].name).toBe(COMPONENT_B);
        expect(ip_list[0].children[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
        expect(ip_list[0].children[0].children[1].is_group).toBe(false);
        expect(ip_list[0].children[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);

    });


    it("not should clean up the ip catalog list when it's empty and there was a previous one", async () => {

        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <component
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A} /// ${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </component>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list_0 = await project_manager.getIpCatalog();

        expect(ip_list_0.length).toBe(1);

        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list_1 = await project_manager.getIpCatalog();

        expect(ip_list_1.length).toBe(1);


    });


});

