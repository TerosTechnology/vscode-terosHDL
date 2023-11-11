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
import { Project_manager } from '../../src/project_manager/project_manager';

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
                for (let i = 1; i <= num_projects; i++) {
                    // Create each project, from 1 to num_projects
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
            const longName = 'a'.repeat(129);
            expect(() => {
                multiProjectManager.initialize_project(longName);
            }).toThrow();
        });

        test('should successfully initialize a project with a name of maximum allowed length', () => {
            const maxName = 'a'.repeat(128);

            multiProjectManager.initialize_project(maxName);
            expect(multiProjectManager.get_projects()[multiProjectManager.get_projects().length - 1].get_name()).toBe(maxName);
        });

        test('should throw an error when initializing a project with a name that is a undefined', () => {
            expect(() => {
                multiProjectManager.initialize_project(undefined as any);
            }).toThrow();
        });

        test('should throw an error when initializing a project with a name that is an object', () => {
            expect(() => {
                multiProjectManager.initialize_project({ name: 'ObjectProject' } as any);
            }).toThrow();
        });
    });

    describe('rename_project', () => {

        test('should rename an existing project successfully', () => {
            // Create project
            const prj = multiProjectManager.initialize_project('OldName');
            const new_name = 'NewName';

            // Rename
            multiProjectManager.rename_project(prj, new_name);

            // Check renamed ...
            expect(prj.get_name()).toBe(new_name);
            expect(multiProjectManager.get_project_by_name(new_name)).toBeDefined();
            expect(() => {
                multiProjectManager.get_project_by_name('OldName');
            }).toThrow();
            // and not duplicated
            const allProjectNames = multiProjectManager.get_projects().map(p => p.get_name())
            expect(allProjectNames.filter(name => name === new_name).length).toBe(1);
        });

        test('should throw an error when trying to rename a non-existing project', () => {
            expect(() => {
                multiProjectManager.rename_project(undefined as any, 'NewName');
            }).toThrow();
        });

        test('should throw an error when trying to rename a project object created outside the multi project manager', () => {
            expect(() => {
                multiProjectManager.rename_project(new Project_manager("OldName", undefined), 'NewName');
            }).toThrow();
        });

        test('should throw an error when the new name is already taken by another project', () => {
            const prj1 = multiProjectManager.initialize_project('Project1');

            multiProjectManager.initialize_project('Project2');

            expect(() => {
                multiProjectManager.rename_project(prj1, 'Project2');
            }).toThrow();
        });

        test('should not change the project name and raise an exception if the old and new names are the same', () => {
            const prj = multiProjectManager.initialize_project('ProjectName');

            expect(() => {
                multiProjectManager.rename_project(prj, 'ProjectName');
            }).toThrow();

            expect(multiProjectManager.get_project_by_name('ProjectName').get_name()).toBe('ProjectName');
            expect(prj.get_name()).toBe('ProjectName');
        });

        describe("name validation", () => {

            let prj: Project_manager;

            beforeEach(() => {
                prj = multiProjectManager.initialize_project('ProjectName');
            });

            test('should throw an error when renaming a project with an empty name', () => {
                expect(() => {
                    multiProjectManager.rename_project(prj, '');
                }).toThrow();
            });

            test('should throw an error when renaming a project with a name that is only whitespace', () => {
                expect(() => {
                    multiProjectManager.rename_project(prj, '   ');
                }).toThrow();
            });

            test('should throw an error when renaming a project with a name containing only special characters', () => {
                expect(() => {
                    multiProjectManager.rename_project(prj, '!@#$%^&*()');
                }).toThrow();
            });

            test('should throw an error when renaming a project with a name longer than the maximum allowed length', () => {
                const longName = 'a'.repeat(129);
                expect(() => {
                    multiProjectManager.rename_project(prj, longName);
                }).toThrow();
            });

            test('should successfully rename a project with a name of maximum allowed length', () => {
                const maxName = 'a'.repeat(128);
                multiProjectManager.rename_project(prj, maxName);

                const projects = multiProjectManager.get_projects();
                expect(projects[projects.length - 1].get_name()).toBe(maxName);
            });

        });
    });

    describe('delete_project', () => {

        test('should delete an existing project successfully', () => {
            const prj = multiProjectManager.initialize_project('ProjectToDelete');

            multiProjectManager.delete_project(prj);

            expect(() => {
                multiProjectManager.get_project_by_name('ProjectToDelete');
            }).toThrow();
            expect(multiProjectManager.get_projects().length).toBe(0);
        });

        for (let num_projects = 1; num_projects <= 5; num_projects++) {
            test(`should correctly update the list of ${num_projects} projects after deletion the first one`, () => {
                // Initialize num_projects
                for (let i = 1; i <= num_projects; i++) {
                    multiProjectManager.initialize_project(`Project${i}`);
                }

                for (let i = 1; i <= num_projects; i++) {
                    // Delete first one
                    multiProjectManager.delete_project(multiProjectManager.get_project_by_name(`Project${i}`));

                    // Check can't be get
                    expect(() => {
                        multiProjectManager.get_project_by_name(`Project${i}`);
                    }).toThrow();
                    // Check size of project list has decreased the amount of deleted items
                    expect(multiProjectManager.get_projects().length).toBe(num_projects - i);
                    // Check order of the other items hasn't changed
                    for (let j = 0; j < num_projects - i; j++) {
                        expect(multiProjectManager.get_projects()[j].get_name()).toBe(`Project${i + j + 1}`);
                    }
                }
            });
        }

        for (let num_projects = 1; num_projects <= 5; num_projects++) {
            test(`should correctly update the list of ${num_projects} projects after deletion the last one`, () => {
                // Initialize num_projects
                for (let i = 1; i <= num_projects; i++) {
                    multiProjectManager.initialize_project(`Project${i}`);
                }

                for (let i = num_projects; i >= 1; i--) {
                    // Delete last one
                    multiProjectManager.delete_project(multiProjectManager.get_project_by_name(`Project${i}`));

                    // Check can't be get
                    expect(() => {
                        multiProjectManager.get_project_by_name(`Project${i}`);
                    }).toThrow();
                    // Check size of project list has decreased the amount of deleted items
                    expect(multiProjectManager.get_projects().length).toBe(i - 1);
                    // Check order of the other items hasn't changed
                    for (let j = 1; j < i; j++) {
                        expect(multiProjectManager.get_projects()[j - 1].get_name()).toBe(`Project${j}`);
                    }
                }
            });
        }

        for (let num_projects = 3; num_projects <= 5; num_projects++) {
            test(`should correctly update the list of ${num_projects} projects after deletion the middle one`, () => {
                // Initialize num_projects
                for (let i = 1; i <= num_projects; i++) {
                    multiProjectManager.initialize_project(`Project${i}`);
                }

                for (let i = 2; i <= num_projects - 1; i++) {
                    // Delete middle one
                    multiProjectManager.delete_project(multiProjectManager.get_project_by_name(`Project${i}`));

                    // Check can't be get
                    expect(() => {
                        multiProjectManager.get_project_by_name(`Project${i}`);
                    }).toThrow();
                    // Check size of project list has decreased the amount of deleted items
                    expect(multiProjectManager.get_projects().length).toBe(num_projects - i + 1);
                    // Check order of the other items hasn't changed
                    expect(multiProjectManager.get_projects()[0].get_name()).toBe(`Project1`);
                    for (let j = 1; j < num_projects - 1; j++) {
                        expect(multiProjectManager.get_projects()[1].get_name()).toBe(`Project${i + 1}`);
                    }
                    expect(multiProjectManager.get_projects()[multiProjectManager.get_projects().length - 1].get_name()).toBe(`Project${num_projects}`);
                }
            });
        }

        test('should throw an error when trying to delete a non-existing project', () => {
            expect(() => {
                multiProjectManager.delete_project(undefined as any);
            }).toThrow();
        });

        test('should throw an error when trying to delete a project object created outside the multi project manager', () => {
            expect(() => {
                multiProjectManager.delete_project(new Project_manager("OldName", undefined));
            }).toThrow();
            expect(() => {
                multiProjectManager.delete_project(new Project_manager("", undefined));
            }).toThrow();
        });
    });

    describe('set_current_project', () => {

        test('should set an existing project as selected successfully', () => {
            const prj = multiProjectManager.initialize_project('ProjectToSelect');

            multiProjectManager.set_selected_project(prj);

            expect(multiProjectManager.get_selected_project()).toBe(prj)
        });

        test('should throw an error when trying to select a non-existing project', () => {
            expect(() => {
                multiProjectManager.set_selected_project(undefined as any);
            }).toThrow();
        });

        test('should throw an error when trying to select a project object created outside the multi project manager', () => {
            expect(() => {
                multiProjectManager.set_selected_project(new Project_manager("OldName", undefined));
            }).toThrow();
            expect(() => {
                multiProjectManager.set_selected_project(new Project_manager("", undefined));
            }).toThrow();
        });

        test('should only have one selected project at a time', () => {
            const prj1 = multiProjectManager.initialize_project('Project1');
            const prj2 = multiProjectManager.initialize_project('Project2');

            multiProjectManager.set_selected_project(prj1);
            multiProjectManager.set_selected_project(prj2);

            expect(multiProjectManager.get_selected_project()).toBe(prj2);
        });
    });

    describe('integration', () => {

        test('delete_project should unset the selected project if it is deleted', () => {
            const prj = multiProjectManager.initialize_project('Project1');

            multiProjectManager.set_selected_project(prj);
            multiProjectManager.delete_project(prj);

            expect(() => {
                multiProjectManager.get_selected_project();
            }).toThrow();
        });

        test('delete_project should keep the selected project unchanged if it is not the one being deleted', () => {
            const prj1 = multiProjectManager.initialize_project('Project1');
            const prj2 = multiProjectManager.initialize_project('Project2');

            multiProjectManager.set_selected_project(prj1);
            multiProjectManager.delete_project(prj2);

            expect(multiProjectManager.get_selected_project()).toBe(prj1);
        });

        test('rename_project should update the selected project name if it is the one being renamed', () => {
            const prj = multiProjectManager.initialize_project('Project1');

            multiProjectManager.set_selected_project(prj);
            const selectedProject = multiProjectManager.get_selected_project();
            multiProjectManager.rename_project(prj, 'Project1New');

            expect(selectedProject.get_name()).toBe('Project1New');
            expect(multiProjectManager.get_selected_project().get_name()).toBe('Project1New');
        });

        test('rename_project should keep the selected project unchanged if it is not the one being renamed', () => {
            const prj1 = multiProjectManager.initialize_project('Project1');
            const prj2 = multiProjectManager.initialize_project('Project2');

            multiProjectManager.set_selected_project(prj1);
            multiProjectManager.rename_project(prj2, 'Project2New');

            expect(multiProjectManager.get_selected_project().get_name()).toBe('Project1');
        });

        test('rename_project should fail after trying to rename a deleted project', () => {
            const prj1 = multiProjectManager.initialize_project('Project1');

            multiProjectManager.delete_project(prj1);

            expect(() => {
                multiProjectManager.rename_project(prj1, "NewProject1");
            }).toThrow();
        });

        test('set_selected_project should fail after trying to select a deleted project', () => {
            const prj1 = multiProjectManager.initialize_project('Project1');

            multiProjectManager.delete_project(prj1);

            expect(() => {
                multiProjectManager.set_selected_project(prj1);
            }).toThrow();
        });

    });
});
