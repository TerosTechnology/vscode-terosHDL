import * as path from "path";
import * as fs from "fs";
import {
  runTLVerilogToVerilogConversion,
  generateNavTlv,
  generateSandpiperDiagram,
} from "../../src/project_manager/tool/quartus/utils";
import { get_default_config } from "../../src/config/config_declaration";
import axios from "axios";

jest.mock("axios");
jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(() => "Sample TLV content"),
}));

describe("Sandpiper", () => {
  const sampleTLVFile = path.join(__dirname, "helpers", "sample.tlv");
  const sampleTLVContent = fs.readFileSync(sampleTLVFile, "utf-8");
  const defaultConfig = get_default_config();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("converts TL-Verilog to Verilog", async () => {
    const mockResponse = {
      status: 200,
      data: {
        "out/sample.sv": "// Generated Verilog code",
        "out/sample_gen.sv": "// Generated helper code",
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    await expect(
      runTLVerilogToVerilogConversion(
        defaultConfig,
        __dirname,
        {
          emitEventLog: jest.fn(),
        } as any,
        sampleTLVContent,
        "sample.tlv"
      )
    ).resolves.not.toThrow();

    expect(axios.post).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
  });

  it("generates Sandpiper diagram", async () => {
    const mockResponse = {
      status: 200,
      data: {
        "out/sample.m4out_graph.svg": "<svg>Diagram content</svg>",
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await generateSandpiperDiagram(
      defaultConfig,
      __dirname,
      {
        emitEventLog: jest.fn(),
      } as any,
      sampleTLVContent,
      "sample.tlv"
    );

    expect(axios.post).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(result).toContain("_diagram.svg");
  });

  it("generates NavTLV HTML", async () => {
    const mockResponse = {
      status: 200,
      data: {
        "out/sample.m4out.html": "<html>NavTLV content</html>",
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await generateNavTlv(
      defaultConfig,
      __dirname,
      {
        emitEventLog: jest.fn(),
      } as any,
      sampleTLVContent,
      "sample.tlv"
    );

    expect(axios.post).toHaveBeenCalled();
    expect(result).toContain("<html>");
  });
});
