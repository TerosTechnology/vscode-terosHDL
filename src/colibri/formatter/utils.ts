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

interface BinaryCheckResult {
    successful: boolean;
    command: string;
    binaryPath: string;
    errorMessage: string[];
}

interface BinaryCheck {
    displayName: string;
    binaryPath: string;
    errorMessageList: string[];
    successful: boolean;
}

export async function checkBinary(
    displayName: string,
    binaryFolder: string,
    binaryName: string,
    argumentList: string[]
): Promise<BinaryCheck> {
    let errorList: string[] = [];
    let binaryFolderPath = binaryFolder;

    //check in system path
    if (binaryFolder === '') {
        const result = await checkBinaryInSystemPath(displayName, binaryName, argumentList);
        errorList = [...errorList, ...result.errorMessage];
        return {
            displayName: displayName,
            binaryPath: result.binaryPath,
            errorMessageList: errorList,
            successful: result.successful
        };
    } else {
        if (!check_if_path_exist(binaryFolderPath)) {
            errorList.push(
                `${displayName} was configured with the folder ${binaryFolderPath} but the folder does not exist.`
            );
            errorList.push('Trying to find the binary in the system path.');
            const result = await checkBinaryInSystemPath(displayName, binaryName, argumentList);
            errorList = [...errorList, ...result.errorMessage];
            return {
                displayName: displayName,
                binaryPath: result.binaryPath,
                errorMessageList: errorList,
                successful: result.successful
            };
        }
        if (check_if_directory(binaryFolderPath)) {
            errorList.push(
                `${displayName} was configured with the folder ${binaryFolderPath} but this is a path to a binary.`
            );
            binaryFolderPath = get_directory(binaryFolderPath);
            errorList.push('Trying to find the binary in the binary folder ' + binaryFolderPath);
        }

        let checkWithExe = get_os() === OS.WINDOWS;
        let result = await checkBinaryInFolder(binaryFolderPath, binaryName, argumentList, checkWithExe);
        // not found with exe in the OS, try reverse
        if (!result.successful) {
            errorList = [...errorList, ...result.errorMessage];
            result = await checkBinaryInFolder(binaryFolderPath, binaryName, argumentList, !checkWithExe);
            // not found with reverse exe, try in sytem path
            if (!result.successful) {
                errorList = [...errorList, ...result.errorMessage];
                result = await checkBinaryInSystemPath(displayName, binaryName, argumentList);
                errorList = [...errorList, ...result.errorMessage];
                if (!result.successful) {
                    errorList.push(`${displayName} was not found in the system path.`);
                } else {
                    errorList.push(`${displayName} was found in the system path.`);
                }
            }
        }
    }
}

export async function checkBinaryInSystemPath(
    displayName: string,
    binaryName: string,
    argumentList: string[]
): Promise<BinaryCheckResult> {
    const binaryPath = binaryName;
    const result = await runBinary(binaryPath, argumentList);
    if (result.successful) {
        return { successful: true, command: result.command, errorMessage: [''], binaryPath: binaryName };
    } else {
        // eslint-disable-next-line max-len
        const errorMessage = `${displayName} was configured to be in the system path but it was not found using the command: ${result.command}`;
        return { successful: false, command: result.command, errorMessage: [errorMessage], binaryPath: binaryName };
    }
}

export async function checkBinaryInFolder(
    binaryFolder: string,
    binaryName: string,
    argumentList: string[],
    addExe: boolean
): Promise<BinaryCheckResult> {
    const binaryPath = join(binaryFolder, binaryName + (addExe ? '.exe' : ''));
    const result = await runBinary(binaryPath, argumentList);
    if (result.successful) {
        return { successful: true, command: result.command, errorMessage: [''], binaryPath: binaryPath };
    } else {
        // eslint-disable-next-line max-len
        const errorMessage = `${binaryName} was configured to be in the folder ${binaryFolder} but it was not found using the command: ${result.command}`;
        return { successful: false, command: result.command, errorMessage: [errorMessage], binaryPath: binaryPath };
    }
}

export async function runBinary(binaryPath: string, argumentList: string[]) {
    const process = new Process();
    const command = binaryPath + argumentList.join(' ');
    const result = await process.exec_wait(command);
    return result;
}
