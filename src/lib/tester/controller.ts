/* ------------------------------------------------------------------------------------------
 * MIT License
 * Copyright (c) 2020 Henrik Bohlin
 * Full license text can be found in /LICENSE or at https://opensource.org/licenses/MIT.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import {
    TestAdapter,
    TestEvent,
    TestLoadStartedEvent,
    TestLoadFinishedEvent,
    TestRunStartedEvent,
    TestRunFinishedEvent,
    TestSuiteInfo,
    TestSuiteEvent,
} from 'vscode-test-adapter-api';
import { Log } from 'vscode-test-adapter-util';
// import {
//     cancelRunVunitTests,
//     getVunitVersion,
//     loadVunitTests,
//     runVunitTests,
//     runVunitTestInGui,
// } from './vunit';
import { performance } from 'perf_hooks';
import * as path from 'path';

export class VUnitAdapter implements TestAdapter {
    private disposables: { dispose(): void }[] = [];
    private watchedFiles = new Map<string, vscode.FileSystemWatcher>();

    private readonly testsEmitter = new vscode.EventEmitter<
        TestLoadStartedEvent | TestLoadFinishedEvent
    >();
    private readonly testStatesEmitter = new vscode.EventEmitter<
        TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent
    >();
    private readonly autorunEmitter = new vscode.EventEmitter<void>();

    private loadedTests: TestSuiteInfo = {
        type: 'suite',
        id: 'vunit',
        label: 'VUnit',
        children: [],
    };

    get tests(): vscode.Event<TestLoadStartedEvent | TestLoadFinishedEvent> {
        return this.testsEmitter.event;
    }
    get testStates(): vscode.Event<
        TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent
    > {
        return this.testStatesEmitter.event;
    }
    get autorun(): vscode.Event<void> | undefined {
        return this.autorunEmitter.event;
    }

    constructor(
        public readonly workspace: vscode.WorkspaceFolder,
        private readonly workDir: string,
        private readonly log: Log
    ) {
        this.disposables.push(this.testsEmitter);
        this.disposables.push(this.testStatesEmitter);
        this.disposables.push(this.autorunEmitter);
    }

    async load(): Promise<void> {
        this.log.info('Loading VUnit tests...');
        let loadStart = performance.now();
        this.testsEmitter.fire(<TestLoadStartedEvent>{ type: 'started' });
        // this._load()
        //     .then((res) => {
        //         this.loadedTests = res;
        //         this.testsEmitter.fire(<TestLoadFinishedEvent>{
        //             type: 'finished',
        //             suite: this.loadedTests,
        //         });
        //     })
        //     .catch((err) => {
        //         this.testsEmitter.fire(<TestLoadFinishedEvent>{
        //             type: 'finished',
        //             suite: undefined,
        //             errorMessage: err.toString(),
        //         });
        //     });
        let loadTime = performance.now() - loadStart;
        this.log.info(
            `Loading VUnit tests finished in ${(loadTime / 1000).toFixed(
                3
            )} seconds.`
        );
    }

    // private async _load(): Promise<TestSuiteInfo> {
    //     if (this.loadedTests.children.length === 0) {
    //         await getVunitVersion()
    //             .then((res) => {
    //                 this.log.info(`Found VUnit version ${res}`);
    //             })
    //             .catch((err) => {
    //                 this.log.error(err);
    //             });
    //     }

    //     // let vunitData = await loadVunitTests(this.workDir);

    //     const watch = vscode.workspace.getConfiguration().get('vunit.watch');
    //     if (watch) {
    //         for (let file of vunitData.testFiles.concat(vunitData.runPy)) {
    //             if (!this.watchedFiles.has(file) && this.inWorkspace(file)) {
    //                 let fileWatcher = vscode.workspace.createFileSystemWatcher(
    //                     file
    //                 );
    //                 this.log.info(`Watching ${file}`);
    //                 fileWatcher.onDidChange(() => {
    //                     this.log.info(`${file} changed`);
    //                     if (
    //                         vscode.workspace
    //                             .getConfiguration()
    //                             .get('vunit.watch')
    //                     ) {
    //                         this.load();
    //                     }
    //                 });
    //                 fileWatcher.onDidDelete(() => {
    //                     this.log.info(`${file} was deleted`);
    //                     this.watchedFiles.get(file)?.dispose();
    //                     this.watchedFiles.delete(file);
    //                     if (
    //                         vscode.workspace
    //                             .getConfiguration()
    //                             .get('vunit.watch')
    //                     ) {
    //                         this.load();
    //                     }
    //                 });
    //                 this.watchedFiles.set(file, fileWatcher);
    //             }
    //         }
    //     } else {
    //         this.watchedFiles.forEach((element) => {
    //             element.dispose();
    //         });
    //         this.watchedFiles.clear();
    //     }
    //     return vunitData.testSuiteInfo;
    // }

    async run(tests: string[]): Promise<void> {
        this.log.info(`Running VUnit tests ${JSON.stringify(tests)}`);

        this.testStatesEmitter.fire(<TestRunStartedEvent>{
            type: 'started',
            tests,
        });

        // await runVunitTests(
        //     tests,
        //     this.testStatesEmitter,
        //     this.loadedTests
        // ).catch((err) => {
        //     this.log.error(err);
        // });

        this.testStatesEmitter.fire(<TestRunFinishedEvent>{ type: 'finished' });
    }

    async debug(tests: string[]): Promise<void> {
        if (tests.length > 1) {
            this.log.warn(
                'Multiple test cases selected, only the first will be run in GUI.'
            );
        }
        let test = tests[0];
        let msg = `Starting test case ${test} in GUI`;
        vscode.window.showInformationMessage(msg);
        this.log.info(msg);
        // runVunitTestInGui(test, this.loadedTests);
    }

    cancel(): void {
        this.log.info('Canceling tests...');
        // cancelRunVunitTests();
    }

    dispose(): void {
        this.cancel();
        this.disposables.forEach((element) => {
            element.dispose();
        });
        this.disposables = [];
        this.watchedFiles.forEach((element) => {
            element.dispose();
        });
        this.watchedFiles.clear();
    }

    private inWorkspace(file: string) {
        const relative = path.relative(this.workspace.uri.fsPath, file);
        return (
            relative && !relative.startsWith('..') && !path.isAbsolute(relative)
        );
    }
}