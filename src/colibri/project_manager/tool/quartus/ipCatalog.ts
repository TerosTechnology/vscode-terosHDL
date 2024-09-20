// This code only can be used for Quartus boards

import { XMLParser } from 'fast-xml-parser';
import { t_ipCatalogRep } from '../common';
import { getQsysPath } from './utils';

import * as path_lib from "path";
import { e_config } from '../../../config/config_declaration';
import { Process } from '../../../process/process';

type t_IP = {
    "name": string,
    "category": string,
    "displayName": string,
    "supportedDeviceFamily": string[],
    "command": string,
}

function convertToTree(components: t_IP[]): t_ipCatalogRep[] {
    const root: t_ipCatalogRep[] = [];
    const map: { [path: string]: t_ipCatalogRep } = {};

    components.forEach(component => {
        const categories = component.category.split('/');
        let currentLevel = root;
        let path = "";

        for (const category of categories) {
            if (path.length > 0) { path += '/'; }
            path += category;

            if (!map[path]) {
                const node: t_ipCatalogRep = {
                    name: category,
                    display_name: category,
                    is_group: true,
                    children: []
                };
                map[path] = node;
                currentLevel.push(node);
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            currentLevel = map[path].children!;
        }

        currentLevel.push({
            display_name: component.displayName,
            name: component.name,
            supportedDeviceFamily: component.supportedDeviceFamily,
            is_group: false,
            command: component.command,
            children: []
        });
    });

    return root;
}

function getTag2Value(obj: any, key: string): string | undefined {
    const tag2 = obj["tag2"];
    if (tag2 === undefined || tag2 === null) {
        return undefined;
    }

    if (Array.isArray(tag2)) {
        for (const tag of tag2) {
            if (tag["@_key"] === key) {
                return tag["@_value"];
            }
        }
    }
    else {
        if (tag2["@_key"] === key) {
            return tag2["@_value"];
        }
    }
    return undefined;
}

function isHideF(obj: any) {
    const tag2Value = getTag2Value(obj, "COMPONENT_HIDE_FROM_QUARTUS");
    if (tag2Value === "true" || tag2Value === undefined) {
        return true;
    }
    // else if (tag2Value === undefined) {
    //     const tag2Value = getTag2Value(obj, "COMPONENT_HIDE_FROM_QSYS");
    //     if (tag2Value === undefined) {
    //         return true;
    //     }
    // }
    return false;
}

function getSupportedDeviceFamily(obj: any) {
    const tag2Value = getTag2Value(obj, "SUPPORTED_DEVICE_FAMILIES");
    if (tag2Value === undefined) {
        return [];
    }
    return tag2Value.split('///').map(element => element.trim());
}

export async function getIpCatalog(config: e_config, family: string | undefined,
    projectPath: string): Promise<t_ipCatalogRep[]> {

    const qpfProjectPath = projectPath.replace(".qsf", ".qpf");
    const binPath = path_lib.join(getQsysPath(config), "ip-catalog");

    const qeditPath = path_lib.join(getQsysPath(config), "qsys-edit");
    const baseCommand = `${qeditPath} --quartus-project=${qpfProjectPath}`;


    const cmd = `${binPath} --xml`;
    const p = new Process();
    const result = await p.exec_wait(cmd, undefined);
    // if (!result.successful) {
    //     return [];
    // }

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        parseAttributeValue: false,
    });
    const obj = parser.parse(result.stdout);

    let component_array: any[] = [];
    let catalog_array = obj["catalog"];
    if (!Array.isArray(obj["catalog"])) {
        catalog_array = [obj["catalog"]];
    }
    for (const catalog of catalog_array) {
        for (const item of ["component", "plugin"]) {
            if (catalog[item] !== undefined) {
                if (!Array.isArray(catalog[item])) {
                    component_array = component_array.concat([catalog[item]]);
                } else {
                    component_array = component_array.concat(catalog[item]);
                }
            }
        }
    }

    const ipList: t_IP[] = [];
    for (const component of component_array) {
        try {
            const supportedDeviceFamily = getSupportedDeviceFamily(component);
            const name = component["@_name"];
            const ip: t_IP = {
                "name": name,
                "category": component["@_categories"].replace(/I\/O/g, "IO"),
                "displayName": component["@_displayName"],
                "supportedDeviceFamily": supportedDeviceFamily,
                "command": `${baseCommand} --new-component-type=${name}`,
            };
            const isHide = isHideF(component);
            if (!isHide) {
                if (family === undefined || supportedDeviceFamily.includes(family)) {
                    ipList.push(ip);
                }
            }
        }
        catch (e) { /* empty */ }
    }
    const treeCatalog = convertToTree(ipList);
    return treeCatalog;
}