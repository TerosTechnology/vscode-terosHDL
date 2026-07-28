// Verify that TerosHDL commands are available in the Command Palette and can be executed

import { expect } from "chai";
import { InputBox, Workbench } from "vscode-extension-tester";
import { getReadyWorkbench, registerGlobalCleanup, waitForQuickPicks } from "./helpers";

describe("TerosHDL Commands", () => {
  before(async () => {
    // Await VS Code workbench to be ready before running tests
    await getReadyWorkbench();
  });

registerGlobalCleanup();
  
  it("TerosHDL commands appear in Command Palette", async function () {
    this.timeout(20000);
    const workbench = new Workbench();
    await workbench.openCommandPrompt();
    
    const input = await InputBox.create();
    await input.setText(">TerosHDL");
    await waitForQuickPicks(input);

    const quickPicks = await input.getQuickPicks();
    const texts = await Promise.all(quickPicks.map((p) => p.getLabel()));
    const hasTerosCommand = texts.some(
      (t) => t.toLowerCase().includes("teroshdl"));
    expect(hasTerosCommand).to.be.true;
    // Cancel the input box to clean up after the test
    await input.cancel();
  });

  it("exposes the Verify Setup command", async function () {
    this.timeout(20000);
    const workbench = new Workbench();
    await workbench.openCommandPrompt();

    const input = await InputBox.create();
    await input.setText(">TerosHDL: Verify Setup");
    await waitForQuickPicks(input);

    const picks = await input.getQuickPicks();
    const labels = await Promise.all(picks.map((p) => p.getLabel()));
    // Verify that the "Verify Setup" command is present in the quick picks
    expect(labels.some((l) => l.includes("Verify Setup"))).to.be.true;
    // Cancel the input box to clean up after the test
    await input.cancel();
  });
});