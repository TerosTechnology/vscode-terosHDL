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

import { e_project_type } from '../../src/project_manager/common';
import { Multi_project_manager } from '../../src/project_manager/multi_project_manager';
import { Project_manager } from '../../src/project_manager/project_manager';
import { QuartusProjectManager } from '../../src/project_manager/tool/quartus/quartusProjectManager';
import { save_file_sync, read_file_sync } from '../../src/utils/file_utils';

const sync_file_path = "/tmp/sync_file_path.json";

jest.mock('../../src/utils/file_utils', () => ({
    ...jest.requireActual('../../src/utils/file_utils'),
    save_file_sync: jest.fn((file_path: string, content: string) => {
        expect(file_path).toBe(sync_file_path);
        return JSON.parse(content);
    }),
    read_file_sync: jest.fn((file_path: string): string => {
        expect(file_path).toBe("");
        return file_path;
    }),
}));

jest.mock('../../src/project_manager/project_manager', () => {
    const originalModule = jest.requireActual('../../src/project_manager/project_manager');

    originalModule.Project_manager.fromJson = jest.fn(async (_config, jsonContent, emitter) => {
        return new originalModule.Project_manager(jsonContent.name, emitter);
    });

    return originalModule;
});

jest.mock('../../src/project_manager/tool/quartus/quartusProjectManager', () => {
    const originalModule = jest.requireActual('../../src/project_manager/tool/quartus/quartusProjectManager');

    originalModule.QuartusProjectManager.fromJson = jest.fn(async (_config, jsonContent, emitter) => {
        return new originalModule.QuartusProjectManager(jsonContent.name, emitter);
    });

    return originalModule;
});

describe('MultiProjectManager', () => {
    let multiProjectManager: Multi_project_manager;

    beforeEach(() => {
        multiProjectManager = new Multi_project_manager("", sync_file_path);
    });

    function create_project_with_name_and_add(prj_name: string): Project_manager {
        const prj = new Project_manager(prj_name, undefined);
        multiProjectManager.add_project(prj);
        return prj;
    }

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

    describe('add_project', () => {

        for (let num_projects = 1; num_projects <= 10; num_projects++) {
            test(`should add ${num_projects} project(s) with different name(s)`, () => {
                for (let i = 1; i <= num_projects; i++) {
                    // Create each project, from 1 to num_projects
                    const project_name = `Project${i}`;

                    create_project_with_name_and_add(project_name);

                    // Assert created, last in the project_list and project_list size is ok
                    expect(multiProjectManager.get_project_by_name(project_name)).toBeDefined();
                    expect(multiProjectManager.get_projects()[i - 1].get_name()).toBe(project_name);
                    expect(multiProjectManager.get_projects().length).toBe(i);
                    // TODO check default values in Project object
                }
            });
        }

        test('should throw an error when adding a project with a name that already exists', () => {
            const projectName = 'DuplicateProject';
            create_project_with_name_and_add(projectName);

            expect(() => {
                create_project_with_name_and_add(projectName);
            }).toThrow();
        });

        test('should throw an error when adding a project with an empty name', () => {
            expect(() => {
                create_project_with_name_and_add('');
            }).toThrow();
        });

        test('should throw an error when adding a project with a name that is only whitespace', () => {
            expect(() => {
                create_project_with_name_and_add('   ');
            }).toThrow();
        });

        test('should throw an error when adding a project with a name containing only special characters', () => {
            expect(() => {
                create_project_with_name_and_add('!@#$%^&*()');
            }).toThrow();
        });

        test('should throw an error when adding a project with a name longer than the maximum allowed length', () => {
            const longName = 'a'.repeat(129);
            expect(() => {
                create_project_with_name_and_add(longName);
            }).toThrow();
        });

        test('should successfully add a project with a name of maximum allowed length', () => {
            const maxName = 'a'.repeat(128);

            create_project_with_name_and_add(maxName);
            expect(multiProjectManager.get_projects()[multiProjectManager.get_projects().length - 1].get_name()).toBe(maxName);
        });

        test('should throw an error when adding a project with a name that is undefined', () => {
            expect(() => {
                create_project_with_name_and_add(undefined as any);
            }).toThrow();
        });

        test('should throw an error when adding a project with a name that is an object', () => {
            expect(() => {
                create_project_with_name_and_add({ name: 'ObjectProject' } as any);
            }).toThrow();
        });

        test('should throw an error when adding a project that is undefined', () => {
            expect(() => {
                multiProjectManager.add_project(undefined as any);
            }).toThrow();
        });

        test('should throw an error when adding a project multiple times', () => {
            const projectName = 'DuplicateProject';
            const prj = new Project_manager(projectName, undefined);
            multiProjectManager.add_project(prj);

            for (let i = 0; i < 5; i++) {
                expect(() => {
                    multiProjectManager.add_project(prj);
                }).toThrow();
            }
        });

    });

    describe('rename_project', () => {

        test('should rename an existing project successfully', () => {
            // Create project
            const prj = create_project_with_name_and_add('OldName');
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
            const prj1 = create_project_with_name_and_add('Project1');

            create_project_with_name_and_add('Project2');

            expect(() => {
                multiProjectManager.rename_project(prj1, 'Project2');
            }).toThrow();
        });

        test('should not change the project name and raise an exception if the old and new names are the same', () => {
            const prj = create_project_with_name_and_add('ProjectName');

            expect(() => {
                multiProjectManager.rename_project(prj, 'ProjectName');
            }).toThrow();

            expect(multiProjectManager.get_project_by_name('ProjectName').get_name()).toBe('ProjectName');
            expect(prj.get_name()).toBe('ProjectName');
        });

        describe("name validation", () => {

            let prj: Project_manager;

            beforeEach(() => {
                prj = create_project_with_name_and_add('ProjectName');
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
            const prj = create_project_with_name_and_add('ProjectToDelete');

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
                    create_project_with_name_and_add(`Project${i}`);
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
                    create_project_with_name_and_add(`Project${i}`);
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
                    create_project_with_name_and_add(`Project${i}`);
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
            const prj = create_project_with_name_and_add('ProjectToSelect');

            multiProjectManager.set_selected_project(prj);

            expect(multiProjectManager.get_selected_project()).toBe(prj);
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
            const prj1 = create_project_with_name_and_add('Project1');
            const prj2 = create_project_with_name_and_add('Project2');

            multiProjectManager.set_selected_project(prj1);
            multiProjectManager.set_selected_project(prj2);

            expect(multiProjectManager.get_selected_project()).toBe(prj2);
        });
    });

    describe('integration', () => {

        test('delete_project should unset the selected project if it is deleted', () => {
            const prj = create_project_with_name_and_add('Project1');

            multiProjectManager.set_selected_project(prj);
            multiProjectManager.delete_project(prj);

            expect(() => {
                multiProjectManager.get_selected_project();
            }).toThrow();
        });

        test('delete_project should keep the selected project unchanged if it is not the one being deleted', () => {
            const prj1 = create_project_with_name_and_add('Project1');
            const prj2 = create_project_with_name_and_add('Project2');

            multiProjectManager.set_selected_project(prj1);
            multiProjectManager.delete_project(prj2);

            expect(multiProjectManager.get_selected_project()).toBe(prj1);
        });

        test('rename_project should update the selected project name if it is the one being renamed', () => {
            const prj = create_project_with_name_and_add('Project1');

            multiProjectManager.set_selected_project(prj);
            const selectedProject = multiProjectManager.get_selected_project();
            multiProjectManager.rename_project(prj, 'Project1New');

            expect(selectedProject.get_name()).toBe('Project1New');
            expect(multiProjectManager.get_selected_project().get_name()).toBe('Project1New');
        });

        test('rename_project should keep the selected project unchanged if it is not the one being renamed', () => {
            const prj1 = create_project_with_name_and_add('Project1');
            const prj2 = create_project_with_name_and_add('Project2');

            multiProjectManager.set_selected_project(prj1);
            multiProjectManager.rename_project(prj2, 'Project2New');

            expect(multiProjectManager.get_selected_project().get_name()).toBe('Project1');
        });

        test('rename_project should fail after trying to rename a deleted project', () => {
            const prj1 = create_project_with_name_and_add('Project1');

            multiProjectManager.delete_project(prj1);

            expect(() => {
                multiProjectManager.rename_project(prj1, "NewProject1");
            }).toThrow();
        });

        test('set_selected_project should fail after trying to select a deleted project', () => {
            const prj1 = create_project_with_name_and_add('Project1');

            multiProjectManager.delete_project(prj1);

            expect(() => {
                multiProjectManager.set_selected_project(prj1);
            }).toThrow();
        });

    });

    describe('save', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('should handle save correctly when the project list is empty', () => {
            multiProjectManager.save();

            expect(save_file_sync).toHaveBeenCalled();
            const returnedValue = (<jest.Mock>save_file_sync).mock.results[0].value;
            expect(returnedValue.project_list).toEqual([]);
        });

        for (let num_projects = 1; num_projects <= 15; num_projects++) {
            test(`should save the current state with selected project and a project list of size ${num_projects}`, () => {
                for (let i = 1; i <= num_projects; i++) {
                    create_project_with_name_and_add(`Project${i}`);
                }
                multiProjectManager.set_selected_project(multiProjectManager.get_project_by_name("Project1"));

                multiProjectManager.save();

                expect(save_file_sync).toHaveBeenCalled();
                const returnedValue = (<jest.Mock>save_file_sync).mock.results[0].value;
                expect(returnedValue.selected_project).toBe("Project1");
                expect(returnedValue.project_list.length).toBe(num_projects);
                for (let i = 1; i <= num_projects; i++) {
                    expect(returnedValue.project_list[i - 1].name).toBe(`Project${i}`);
                }
            });
        }

        for (let num_projects = 1; num_projects <= 15; num_projects++) {
            test(`should save correctly with ${num_projects} projects and none selected`, () => {
                for (let i = 1; i <= num_projects; i++) {
                    create_project_with_name_and_add(`Project${i}`);
                }
                multiProjectManager.save();

                expect(save_file_sync).toHaveBeenCalled();
                const returnedValue = (<jest.Mock>save_file_sync).mock.results[0].value;
                expect(returnedValue.selected_project).toBe("");
                expect(returnedValue.project_list.length).toBe(num_projects);
                for (let i = 1; i <= num_projects; i++) {
                    expect(returnedValue.project_list[i - 1].name).toBe(`Project${i}`);
                }
            });
        }

        test('should save correctly after a project deleted', () => {
            create_project_with_name_and_add("Project1");
            const prj2 = create_project_with_name_and_add("Project2");
            multiProjectManager.delete_project(prj2);

            multiProjectManager.save();

            expect(save_file_sync).toHaveBeenCalled();
            const returnedValue = (<jest.Mock>save_file_sync).mock.results[0].value;
            expect(returnedValue.project_list.length).toBe(1);
            expect(returnedValue.project_list[0].name).toBe("Project1");
        });

        test('should save correctly after a project rename', () => {
            const prj1 = create_project_with_name_and_add("Project1");
            create_project_with_name_and_add("Project2");
            multiProjectManager.rename_project(prj1, "NewName");

            multiProjectManager.save();

            expect(save_file_sync).toHaveBeenCalled();
            const returnedValue = (<jest.Mock>save_file_sync).mock.results[0].value;
            expect(returnedValue.project_list.length).toBe(2);
            expect(returnedValue.project_list[0].name).toBe("NewName");
            expect(returnedValue.project_list[1].name).toBe("Project2");
        });

        test('should save correctly multiple times', () => {
            const prj1 = create_project_with_name_and_add("Project1");
            create_project_with_name_and_add("Project2");
            multiProjectManager.set_selected_project(prj1);

            multiProjectManager.save();

            expect(save_file_sync).toHaveBeenCalled();
            const returnedValue = (<jest.Mock>save_file_sync).mock.results[0].value;
            expect(returnedValue.selected_project).toBe("Project1");
            expect(returnedValue.project_list.length).toBe(2);
            expect(returnedValue.project_list[0].name).toBe("Project1");
            expect(returnedValue.project_list[1].name).toBe("Project2");

            multiProjectManager.save();
            const returnedValueSecond = (<jest.Mock>save_file_sync).mock.results[1].value;

            expect(returnedValue).toStrictEqual(returnedValueSecond);

        });

    });


    describe('load', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('should load correctly when the project list is empty', async () => {
            (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                selected_project: "",
                project_list: [],
            }));

            await multiProjectManager.load(undefined as any);

            expect(() => {
                multiProjectManager.get_selected_project();
            }).toThrow();
            expect(multiProjectManager.get_projects().length).toBe(0);

        });

        for (let num_projects = 1; num_projects <= 15; num_projects++) {
            test(`should handle load with a selected project and a project list of size ${num_projects}`, async () => {
                (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                    selected_project: "Project1",
                    project_list: Array.from({ length: num_projects }, (_, i) => ({ name: `Project${i + 1}` })),
                }));

                await multiProjectManager.load(undefined as any);

                expect(multiProjectManager.get_selected_project().get_name()).toBe("Project1");
                for (let i = 1; i <= num_projects; i++) {
                    expect(multiProjectManager.get_projects()[i - 1].get_name()).toBe(`Project${i}`);
                }

            });
        }

        for (let num_projects = 1; num_projects <= 15; num_projects++) {
            test(`should handle load with ${num_projects} projects and none selected`, async () => {
                (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                    selected_project: "",
                    project_list: Array.from({ length: num_projects }, (_, i) => ({ name: `Project${i + 1}` })),
                }));

                await multiProjectManager.load(undefined as any);

                expect(() => {
                    multiProjectManager.get_selected_project();
                }).toThrow();
                for (let i = 1; i <= num_projects; i++) {
                    expect(multiProjectManager.get_projects()[i - 1].get_name()).toBe(`Project${i}`);
                }

            });
        }

        test('should fail if selected project does not exist', async () => {
            (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                selected_project: "Project",
                project_list: [],
            }));

            await expect(multiProjectManager.load(undefined as any)).rejects.toThrow();

            expect(() => {
                multiProjectManager.get_selected_project();
            }).toThrow();
            expect(multiProjectManager.get_projects().length).toBe(0);

        });

        describe("should handle load incorrect project and valid projects", () => {

            test("with a valid project selected", async () => {
                (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                    selected_project: "Project3",
                    project_list: [{ name: "Project1" }, { no_name: "Project2" }, { name: "Project3" }, { no_name: "Project4" }],
                }));

                await expect(multiProjectManager.load(undefined as any)).rejects.toThrow();

                expect(multiProjectManager.get_selected_project().get_name()).toBe("Project3");
                expect(multiProjectManager.get_projects().length).toBe(2);
                expect(multiProjectManager.get_project_by_name("Project1")).toBeDefined();
                expect(() => {
                    multiProjectManager.get_project_by_name("Project2");
                }).toThrow();
                expect(multiProjectManager.get_project_by_name("Project3")).toBeDefined();
                expect(() => {
                    multiProjectManager.get_project_by_name("Project4");
                }).toThrow();

            });

            test("with a non valid project selected", async () => {
                (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                    selected_project: "Project4",
                    project_list: [{ name: "Project1" }, { no_name: "Project2" }, { name: "Project3" }, { no_name: "Project4" }],
                }));

                await expect(multiProjectManager.load(undefined as any)).rejects.toThrow();

                expect(() => {
                    multiProjectManager.get_selected_project();
                }).toThrow();

                expect(multiProjectManager.get_projects().length).toBe(2);
                expect(multiProjectManager.get_project_by_name("Project1")).toBeDefined();
                expect(() => {
                    multiProjectManager.get_project_by_name("Project2");
                }).toThrow();
                expect(multiProjectManager.get_project_by_name("Project3")).toBeDefined();
                expect(() => {
                    multiProjectManager.get_project_by_name("Project4");
                }).toThrow();

            });
        });

        test("should report failure if selected project has invalid type", async () => {
            (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                selected_project: 17,
                project_list: [{ name: "Project1" }, { name: "Project2" }],
            }));

            await expect(multiProjectManager.load(undefined as any)).rejects.toThrow();

            expect(() => {
                multiProjectManager.get_selected_project();
            }).toThrow();
            expect(multiProjectManager.get_projects().length).toBe(2);
            expect(multiProjectManager.get_project_by_name("Project1")).toBeDefined();
            expect(multiProjectManager.get_project_by_name("Project2")).toBeDefined();

        });

        test("should report failure if project_list has invalid type", async () => {
            (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                selected_project: "Project1",
                project_list: { name: "Project1" },
            }));

            await expect(multiProjectManager.load(undefined as any)).rejects.toThrow();

            expect(() => {
                multiProjectManager.get_selected_project();
            }).toThrow();
            expect(multiProjectManager.get_projects().length).toBe(0);

        });

        test("should fail if there are projects with duplicated names, only processing the fist one", async () => {
            (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                selected_project: "Project1",
                project_list: [{ name: "Project1" }, { name: "Project2" }, { name: "Project1" }],
            }));

            await expect(multiProjectManager.load(undefined as any)).rejects.toThrow();

            expect(multiProjectManager.get_selected_project().get_name()).toBe("Project1");
            expect(multiProjectManager.get_projects().length).toBe(2);
            expect(multiProjectManager.get_project_by_name("Project1")).toBeDefined();
            expect(multiProjectManager.get_project_by_name("Project2")).toBeDefined();

        });

        describe("should delete previous data", () => {

            test("when info to load is empty", async () => {
                (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                    selected_project: "",
                    project_list: [],
                }));
                create_project_with_name_and_add("Project1");

                await multiProjectManager.load(undefined as any);

                expect(() => {
                    multiProjectManager.get_selected_project();
                }).toThrow();
                expect(multiProjectManager.get_projects().length).toBe(0);

            });

            test("when load is correct", async () => {
                (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                    selected_project: "Project2",
                    project_list: [{ name: "Project2" }],
                }));
                create_project_with_name_and_add("Project1");

                await multiProjectManager.load(undefined as any);

                expect(multiProjectManager.get_selected_project().get_name()).toBe("Project2");
                expect(multiProjectManager.get_projects().length).toBe(1);
                expect(multiProjectManager.get_project_by_name("Project2")).toBeDefined();
                expect(() => {
                    multiProjectManager.get_project_by_name("Project1");
                }).toThrow();

            });

            test("when load is invalid", async () => {
                (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                    selected_project: "Project2",
                    project_list: [{ no_name: "Project2" }, { name: "Project3" }],
                }));
                create_project_with_name_and_add("Project1");

                await expect(multiProjectManager.load(undefined as any)).rejects.toThrow();

                expect(() => {
                    multiProjectManager.get_selected_project();
                }).toThrow();
                expect(multiProjectManager.get_projects().length).toBe(1);
                expect(multiProjectManager.get_project_by_name("Project3")).toBeDefined();
                expect(() => {
                    multiProjectManager.get_project_by_name("Project1");
                }).toThrow();
                expect(() => {
                    multiProjectManager.get_project_by_name("Project2");
                }).toThrow();
            });

        });

        test("should call fromJSON factory of the proper class", async () => {
            (<jest.Mock>read_file_sync).mockReturnValue(JSON.stringify({
                selected_project: "Project1",
                project_list: [{ name: "Project1", project_type: e_project_type.QUARTUS.valueOf() }, { name: "Project2", project_type: e_project_type.GENERIC.valueOf() }],
            }));

            await multiProjectManager.load(undefined as any);

            expect(QuartusProjectManager.fromJson).toHaveBeenCalledTimes(1);
            expect(Project_manager.fromJson).toHaveBeenCalledTimes(1);
            expect(multiProjectManager.get_selected_project().get_name()).toBe("Project1");
            expect(multiProjectManager.get_projects().length).toBe(2);
            expect(multiProjectManager.get_project_by_name("Project1")).toBeInstanceOf(QuartusProjectManager);
            expect(multiProjectManager.get_project_by_name("Project2")).toBeInstanceOf(Project_manager);
        });

    });

});
