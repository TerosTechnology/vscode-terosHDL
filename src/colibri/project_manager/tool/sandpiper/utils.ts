import { e_config } from "../../../config/config_declaration";
import { ProjectEmitter } from "../../projectEmitter";
import { e_event } from "../../projectEmitter";
import axios from "axios";
import * as path from "path";
import * as fs from "fs";

const SANDPIPER_API_URL = "https://faas.makerchip.com/function/sandpiper-faas";

export async function runTLVerilogToVerilogConversion(
    config: e_config,
    projectPath: string,
    emitterProject: ProjectEmitter,
    currentFileContent: string,
    currentFileName: string
  ): Promise<void> {
    try {
      if (!currentFileName.toLowerCase().endsWith(".tlv")) {
        emitterProject.emitEventLog(
          "Selected file is not a TL-Verilog file. Please select a .tlv file.",
          e_event.STDOUT_WARNING
        );
        return;
      }
  
      const externSettings = config.sandpiper?.formattingSettings || [];
      const args = `-i ${currentFileName} -o ${currentFileName.replace(
        ".tlv",
        ".sv"
      )} --m5out out/m5out ${externSettings.join(" ")} --iArgs`;
  
      const response = await axios.post(
        SANDPIPER_API_URL,
        JSON.stringify({
          args,
          responseType: "json",
          sv_url_inc: true,
          files: {
            [currentFileName]: currentFileContent,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error(
          `SandPiper SaaS request failed with status ${response.status}`
        );
      }
  
      const data = response.data;
      const outputFileName = currentFileName.replace(".tlv", ".sv");
      if (data[`out/${outputFileName}`]) {
        const verilog = (data[`out/${outputFileName}`] as string)
          .replace(
            `\`include "${outputFileName.replace(".sv", "_gen.sv")}"`,
            "// gen included here\n" +
              data[`out/${outputFileName.replace(".sv", "_gen.sv")}`]
          )
          .split("\n")
          .filter((line) => !line.startsWith('`include "sp_default.vh"'))
          .join("\n");
  
        const outputFilePath = path.join(projectPath, outputFileName);
        const genFilePath = path.join(
          projectPath,
          outputFileName.replace(".sv", "_gen.sv")
        );
  
        fs.writeFileSync(outputFilePath, verilog);
        fs.writeFileSync(
          genFilePath,
          data[`out/${outputFileName.replace(".sv", "_gen.sv")}`]
        );
  
        emitterProject.emitEventLog(
          `Generated Verilog code saved to ${outputFilePath} and ${genFilePath}`,
          e_event.STDOUT_INFO
        );
      } else {
        throw new Error(
          "SandPiper SaaS compilation failed: No output generated."
        );
      }
    } catch (error) {
      let errorMessage = "SandPiper SaaS compilation failed: ";
      if (axios.isAxiosError(error)) {
        errorMessage += error.message;
      } else {
        errorMessage += String(error);
      }
      emitterProject.emitEventLog(errorMessage, e_event.STDOUT_ERROR);
      throw new Error(errorMessage);
    }
  }
  
  export async function generateSandpiperDiagram(
    config: e_config,
    projectPath: string,
    emitterProject: ProjectEmitter,
    currentFileContent: string,
    currentFileName: string
  ): Promise<string> {
    try {
      if (!currentFileName.toLowerCase().endsWith(".tlv")) {
        throw new Error("Selected file is not a TL-Verilog file. Please select a .tlv file.");
      }
  
      const externSettings = config.sandpiper?.formattingSettings || [];
      const args = `-i ${currentFileName} --graphTrans --svg ${externSettings.join(" ")} --iArgs`;
  
      const response = await axios.post(
        SANDPIPER_API_URL,
        JSON.stringify({
          args,
          responseType: "json",
          sv_url_inc: true,
          files: {
            [currentFileName]: currentFileContent,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error(`SandPiper SaaS request failed with status ${response.status}`);
      }
  
      const data = response.data;
      const svgOutputKeyM4 = `out/${currentFileName.replace('.tlv', '.m4out_graph.svg')}`;
      const svgOutputKeyM5 = `out/${currentFileName.replace('.tlv', '.m5out_graph.svg')}`;
      const svgOutputKey = data[svgOutputKeyM5] ? svgOutputKeyM5 : svgOutputKeyM4;
      if (data[svgOutputKey]) {
        const svgContent = data[svgOutputKey];
        const svgFilePath = path.join(projectPath, `${path.basename(currentFileName, '.tlv')}_diagram.svg`);
        fs.writeFileSync(svgFilePath, svgContent);
        emitterProject.emitEventLog(`Generated SVG diagram saved to ${svgFilePath}`, e_event.STDOUT_INFO);
        return svgFilePath;
      } else {
        throw new Error("SandPiper SaaS compilation failed: No SVG output generated.");
      }
    } catch (error) {
      let errorMessage = "SandPiper SaaS compilation failed: ";
      if (axios.isAxiosError(error)) {
        errorMessage += error.message;
      } else {
        errorMessage += String(error);
      }
      emitterProject.emitEventLog(errorMessage, e_event.STDOUT_ERROR);
      throw new Error(errorMessage);
    }
  }
  export async function generateNavTlv(
    config: e_config,
    _projectPath: string,
    emitterProject: ProjectEmitter,
    currentFileContent: string,
    currentFileName: string
  ): Promise<string> {
    try {
      if (!currentFileName.toLowerCase().endsWith(".tlv")) {
        throw new Error("Selected file is not a TL-Verilog file. Please select a .tlv file.");
      }
  
      const externSettings = config.sandpiper?.formattingSettings || [];
      const args = `-i ${currentFileName} -o gene.sv --dhtml ${externSettings.join(" ")} --iArgs`;
  
      const response = await axios.post(
        SANDPIPER_API_URL,
        JSON.stringify({
          args,
          responseType: "json",
          sv_url_inc: true,
          files: {
            [currentFileName]: currentFileContent,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error(`SandPiper SaaS request failed with status ${response.status}`);
      }
  
      const data = response.data;
      const htmlOutputKeyM4 = `out/${currentFileName.replace('.tlv', '.m4out.html')}`;
      const htmlOutputKeyM5 = `out/${currentFileName.replace('.tlv', '.m5out.html')}`;

      const htmlOutputKey =  data[htmlOutputKeyM5] ? htmlOutputKeyM5 : htmlOutputKeyM4;
      if (data[htmlOutputKey]) {
        const htmlContent = data[htmlOutputKey];
        emitterProject.emitEventLog(`Generated NavTLV HTML content`, e_event.STDOUT_INFO);
        return htmlContent;
      } else {
        throw new Error("SandPiper SaaS compilation failed: No HTML output generated.");
      }
    } catch (error) {
      let errorMessage = "SandPiper SaaS compilation failed: ";
      if (axios.isAxiosError(error)) {
        errorMessage += error.message;
      } else {
        errorMessage += String(error);
      }
      emitterProject.emitEventLog(errorMessage, e_event.STDOUT_ERROR);
      throw new Error(errorMessage);
    }
  }
