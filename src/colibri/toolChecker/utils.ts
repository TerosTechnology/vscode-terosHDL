// Copyright 2024
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import { OS } from '../process/common';
import { Process } from '../process/process';
import { get_os } from '../process/utils';
import { join } from 'path';
import * as path from 'path';

interface BinaryCheckResult {
    successful: boolean;
    command: string;
    binaryPath: string;
    messageList: string[];
}

export interface BinaryCheck {
    displayName: string;
    binaryPath: string;
    messageList: string[];
    successfulFind: boolean;
    successfulConfig: boolean;
}

export async function checkBinary(
    displayName: string,
    binaryFolder: string,
    binaryName: string,
    argumentList: string[]
): Promise<BinaryCheck> {
    let completeMsgList: string[] = [];
    let binaryFolderPath = binaryFolder;

    //check in system path
    if (binaryFolder === '') {
        const result = await checkBinaryInSystemPath(displayName, binaryName, argumentList);
        completeMsgList = [...completeMsgList, ...result.messageList];
        return {
            displayName: displayName,
            binaryPath: result.binaryPath,
            messageList: completeMsgList,
            successfulFind: result.successful,
            successfulConfig: result.successful,
        };
    } else {
        ////////////////////////////////////////////////////////////////////////
        // adding binary
        ////////////////////////////////////////////////////////////////////////
        // check adding the binary name to the end of the path
        let checkWithExe = get_os() === OS.WINDOWS;

        binaryFolderPath = `${binaryFolder}${path.sep}${binaryName}`;
        let result = await checkBinaryInCompletePath(displayName, binaryFolderPath, argumentList, checkWithExe);

        completeMsgList = [...completeMsgList, ...result.messageList];
        if (result.successful) {
            return {
                displayName: displayName,
                binaryPath: "",
                messageList: result.messageList,
                successfulFind: result.successful,
                successfulConfig: result.successful,
            };
        }
        // check adding the binary name to the end of the path
        binaryFolderPath = `${binaryFolder}${path.sep}${binaryName}`;
        result = await checkBinaryInCompletePath(displayName, binaryFolderPath, argumentList, !checkWithExe);

        completeMsgList = [...completeMsgList, ...result.messageList];
        if (result.successful) {
            return {
                displayName: displayName,
                binaryPath: binaryFolder,
                messageList: result.messageList,
                successfulFind: result.successful,
                successfulConfig: false,
            };
        }

        ////////////////////////////////////////////////////////////////////////
        // adding binary
        ////////////////////////////////////////////////////////////////////////
        // check directly with the path
        checkWithExe = get_os() === OS.WINDOWS;
        result = await checkBinaryInCompletePath(displayName, binaryFolder, argumentList, checkWithExe);
        completeMsgList = [...completeMsgList, ...result.messageList];
        if (result.successful) {
            return {
                displayName: displayName,
                binaryPath: binaryFolder,
                messageList: result.messageList,
                successfulFind: result.successful,
                successfulConfig: false,
            };
        }

        // check directly with the path adding exe
        result = await checkBinaryInCompletePath(displayName, binaryFolder, argumentList, !checkWithExe);
        completeMsgList = [...completeMsgList, ...result.messageList];
        if (result.successful) {
            return {
                displayName: displayName,
                binaryPath: binaryFolder,
                messageList: result.messageList,
                successfulFind: result.successful,
                successfulConfig: false,
            };
        }

        // try in system path
        result = await checkBinaryInSystemPath(displayName, binaryName, argumentList);
        completeMsgList = [...completeMsgList, ...result.messageList];
        if (result.successful) {
            return {
                displayName: displayName,
                binaryPath: "",
                messageList: completeMsgList,
                successfulFind: result.successful,
                successfulConfig: false,
            };
        }

        return {
            displayName: displayName,
            binaryPath: "",
            messageList: completeMsgList,
            successfulFind: false,
            successfulConfig: false,
        };
    }
}

export async function checkBinaryInSystemPath(
    displayName: string,
    binaryName: string,
    argumentList: string[]
): Promise<BinaryCheckResult> {
    const msgList = [getSearchedMessage(displayName, '')];
    const result = await runBinary(binaryName, argumentList);
    if (result.successful) {
        msgList.push(getFoundMessage(displayName, '', result.command));
        return { successful: true, command: result.command, messageList: msgList, binaryPath: binaryName };
    } else {
        msgList.push(getNotFoundMessage(displayName, '', result.command));
        return { successful: false, command: result.command, messageList: msgList, binaryPath: binaryName };
    }
}

export async function checkBinaryInFolder(
    binaryFolder: string,
    binaryName: string,
    argumentList: string[],
    addExe: boolean
): Promise<BinaryCheckResult> {
    
    const binaryPath = join(binaryFolder, binaryName + (addExe ? '.exe' : ''));
    const msgList = [getSearchedMessage(binaryName, binaryPath)];

    const result = await runBinary(binaryPath, argumentList);
    if (result.successful) {
        msgList.push(getFoundMessage(binaryName, binaryPath, result.command));
        return { successful: true, command: result.command, messageList: msgList, binaryPath: binaryPath };
    } else {
        msgList.push(getNotFoundMessage(binaryName, binaryPath, result.command));
        return { successful: false, command: result.command, messageList: msgList, binaryPath: binaryPath };
    }
}

export async function checkBinaryInCompletePath(
    displayName: string,
    binaryPath: string,
    argumentList: string[],
    addExe: boolean
): Promise<BinaryCheckResult> {
    
    binaryPath = binaryPath + (addExe ? '.exe' : '');
    const msgList = [getSearchedMessage(displayName, binaryPath)];

    const result = await runBinary(binaryPath, argumentList);
    if (result.successful) {
        msgList.push(getFoundMessage(displayName, binaryPath, result.command));
        return { successful: true, command: result.command, messageList: msgList, binaryPath: binaryPath };
    } else {
        msgList.push(getNotFoundMessage(displayName, binaryPath, result.command));
        return { successful: false, command: result.command, messageList: msgList, binaryPath: binaryPath };
    }
}

export async function runBinary(binaryPath: string, argumentList: string[]) {
    const process = new Process();
    const command = binaryPath + " " + argumentList.join(' ');
    const result = await process.exec_wait(command);
    return result;
}

function getSearchedMessage(displayName: string, binaryPath: string) {
    if (binaryPath === '') {
        return `🔎 Searching for the binary "${displayName}" in the system path`;
    }
    else {
        return `🔎 Searching for the binary ${displayName} at "${binaryPath}"`;
    }
}

function getFoundMessage(displayName: string, binaryPath: string, command: string) {
    if (binaryPath === '') {
        return `✅ ${displayName} Found in the system path using the command: "${command}"`;
    }
    else {
        return `✅ ${displayName} found at "${binaryPath}" using the command: "${command}"`;
    }
}

function getNotFoundMessage(displayName: string, binaryPath: string, command: string) {
    if (binaryPath === '') {
        return `❌ ${displayName} not found in the system path. Search executed with: "${command}"`
    }
    else {
        return `❌ ${displayName} not found at "${binaryPath}". Search executed with: "${command}"`;
    }
}