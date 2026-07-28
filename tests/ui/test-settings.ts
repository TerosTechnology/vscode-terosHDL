// Check that the global settings menu opens a webview/tab

import { expect } from "chai";
import { EditorView } from "vscode-extension-tester";
import { getReadyWorkbench, registerGlobalCleanup, runCommand } from "./helpers";

describe("TerosHDL Global Settings", () => {
  before(async () => {
    await getReadyWorkbench();
  });

  registerGlobalCleanup();

  it("opens the global settings editor tab", async function () {
    this.timeout(30000);
    const editorView = new EditorView();

    await runCommand("teroshdl.configuration.global");

    await editorView.getDriver().wait(async () => {
      const titles = await editorView.getOpenEditorTitles();
      return titles.some((title) => title.includes("TerosHDL Global Settings"));
    }, 15000, "Global settings webview did not open");

    expect(await editorView.getOpenEditorTitles()).to.satisfy((titles: string[]) =>
      titles.some((title) => title.includes("TerosHDL Global Settings"))
    );
  });

  afterEach(async () => {
    try {
      await new EditorView().closeAllEditors();
    } catch {
      // There aren't any open editors.
    }
  });
});