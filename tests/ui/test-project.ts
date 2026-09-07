// Verify that the TerosHDL extension can create a new project and that it appears in the TerosHDL Projects tree view

import { expect } from "chai";
import { InputBox } from "vscode-extension-tester";
import { deleteProjectFromTree, getReadyWorkbench, registerGlobalCleanup, runCommand, waitForProjectItem, waitForQuickPicks } from "./helpers";

describe("TerosHDL Project Creation", () => {
  const testProjectName = "teroshdl-extester-test";

  before(async () => {
    await getReadyWorkbench();
    await deleteProjectFromTree(testProjectName).catch(() => {
      // Project may not exist yet
    });
  });

  registerGlobalCleanup();

  after(async function () {
    this.timeout(30000);
    try {
      await deleteProjectFromTree(testProjectName);
    } catch (err) {
      console.warn(`[cleanup] Could not delete test project: ${err}`);
    }
  });

  it("Add Project command creates a project in the tree", async function () {
    this.timeout(60000);
    await runCommand("teroshdl.view.project.add");

    // Select a project type from the InputBox that appears after running the Add Project command
    const picker = await InputBox.create(15000);
    await waitForQuickPicks(picker);
    const quickPicks = await picker.getQuickPicks();
    expect(quickPicks.length).to.be.greaterThan(0);
    await quickPicks[0].select();

    // Name project in the InputBox that appears after selecting a project type  
    const nameInput = await InputBox.create(15000);
    await nameInput.setText(testProjectName);
    await nameInput.confirm();

    const projectItem = await waitForProjectItem(testProjectName);
    expect(projectItem).to.not.be.undefined;
  });
});