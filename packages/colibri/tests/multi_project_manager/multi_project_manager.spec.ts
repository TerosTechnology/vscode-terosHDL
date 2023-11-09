// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

import { Multi_project_manager } from '../../src/project_manager/multi_project_manager';

describe('MultiProjectManager', () => {
    let multiProjectManager: Multi_project_manager;

    beforeEach(() => {
        multiProjectManager = new Multi_project_manager("", "", undefined);
    });

    describe('default scenario', () => {
        test('get_projects should return an empty array if no projects are created', () => {
            expect(multiProjectManager.get_projects()).toEqual([]);
        });
        test('get_selected_project should throw an exception', () => {
            expect(() => { multiProjectManager.get_selected_project() }).toThrow();
        });
        test('get_project_by_name should throw an exception when the project does not exit', () => {
            expect(() => { multiProjectManager.get_project_by_name("") }).toThrow();
        });
    });

    describe('initialize_project', () => {

        for (let num_projects = 1; num_projects <= 10; num_projects++) {
            test(`should initialize ${num_projects} project(s) with different name(s)`, () => {
                // Create each project, from 1 to num_projects
                for (let i = 1; i <= num_projects; i++) {
                    const project_name = `Project${i}`;
                    multiProjectManager.initialize_project(project_name);
                    // Assert created, last in the project_list and project_list size is ok
                    expect(multiProjectManager.get_project_by_name(project_name)).toBeDefined();
                    expect(multiProjectManager.get_projects()[i - 1].get_name()).toBe(project_name);
                    expect(multiProjectManager.get_projects().length).toBe(i);
                    // TODO check default values in Project object
                }
            });
        }

        test('should throw an error when initializing a project with a name that already exists', () => {
            const projectName = 'DuplicateProject';
            multiProjectManager.initialize_project(projectName);
            expect(() => {
                multiProjectManager.initialize_project(projectName);
            }).toThrow();
        });

        test('should throw an error when initializing a project with an empty name', () => {
            expect(() => {
                multiProjectManager.initialize_project('');
            }).toThrow();
        });

        test('should throw an error when initializing a project with a name that is only whitespace', () => {
            expect(() => {
                multiProjectManager.initialize_project('   ');
            }).toThrow();
        });

        test('should throw an error when initializing a project with a name containing only special characters', () => {
            expect(() => {
                multiProjectManager.initialize_project('!@#$%^&*()');
            }).toThrow();
        });

        test('should throw an error when initializing a project with a name longer than the maximum allowed length', () => {
            const longName = 'a'.repeat(129); // Suponiendo que el máximo permitido es 255 caracteres
            expect(() => {
                multiProjectManager.initialize_project(longName);
            }).toThrow();
        });

        test('should successfully initialize a project with a name of maximum allowed length', () => {
            const maxName = 'a'.repeat(128); // Suponiendo que el máximo permitido es 255 caracteres
            multiProjectManager.initialize_project(maxName);
            const projects = multiProjectManager.get_projects();
            expect(projects[projects.length - 1].get_name()).toBe(maxName);
        });

        test('should throw an error when initializing a project with a name that is a undefined', () => {
            expect(() => {
                multiProjectManager.initialize_project(undefined as any); // Casting a number to any to simulate wrong type input
            }).toThrow();
        });

        test('should throw an error when initializing a project with a name that is an object', () => {
            expect(() => {
                multiProjectManager.initialize_project({ name: 'ObjectProject' } as any); // Casting an object to any to simulate wrong type input
            }).toThrow();
        });


    });


});
