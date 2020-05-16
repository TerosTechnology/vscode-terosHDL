import * as fs from "fs";
import * as util from "util";

export const readFileAsync = util.promisify(fs.readFile);
export const writeFileAsync = util.promisify(fs.writeFile);

