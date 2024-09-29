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

import { OS } from 'colibri/process/common';
import { Process } from 'colibri/process/process';
import { get_os } from 'colibri/process/utils';
import { check_if_directory, check_if_path_exist, get_directory } from 'colibri/utils/file_utils';
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
    const msgList = ["🔎 Trying to find the binary in the system path."];
    const result = await runBinary(binaryName, argumentList);
    if (result.successful) {
        msgList.push(`✅ ${displayName} was found in the system path using the command: "${result.command}"`);
        return { successful: true, command: result.command, messageList: msgList, binaryPath: binaryName };
    } else {
        // eslint-disable-next-line max-len
        msgList.push(`❌ ${displayName} was not found in the system path. Tried to find it using the command: "${result.command}"`);
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
    const msgList = [`🔎 Trying to find the binary in the path ${binaryPath}`];

    const result = await runBinary(binaryPath, argumentList);
    if (result.successful) {
        msgList.push(`✅ ${binaryName} was found in the path ${binaryPath} using the command: "${result.command}"`);
        return { successful: true, command: result.command, messageList: msgList, binaryPath: binaryPath };
    } else {
        // eslint-disable-next-line max-len
        msgList.push(`❌ ${binaryName} was not found in the path ${binaryPath}. Tried to find it using the command: "${result.command}"`);
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
    const msgList = [`🔎 Trying to find the binary in the path ${binaryPath}`];

    const result = await runBinary(binaryPath, argumentList);
    if (result.successful) {
        msgList.push(`✅ ${displayName} was found in the path ${binaryPath} using the command: "${result.command}"`);
        return { successful: true, command: result.command, messageList: msgList, binaryPath: binaryPath };
    } else {
        // eslint-disable-next-line max-len
        msgList.push(`❌ ${displayName} was not found in the path ${binaryPath}. Tried to find it using the command: "${result.command}"`);
        return { successful: false, command: result.command, messageList: msgList, binaryPath: binaryPath };
    }
}

export async function runBinary(binaryPath: string, argumentList: string[]) {
    const process = new Process();
    const command = binaryPath + " " + argumentList.join(' ');
    const result = await process.exec_wait(command);
    return result;
}
