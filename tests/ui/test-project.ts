// Verify that the TerosHDL extension can create a new project and that it appears in the TerosHDL Projects tree view

import { expect } from "chai";
import { Workbench, InputBox } from "vscode-extension-tester";
import { getReadyWorkbench, getTerosHdlControl, registerGlobalCleanup, runCommand, waitForQuickPicks } from "./helpers";

describe("TerosHDL Project Creation", () => {
  let workbench: Workbench;
  const testProjectName = "teroshdl-extester-test";

  async function waitForProjectItem(section: any, timeout = 10000): Promise<void> {
    await section.getDriver().wait(async () => {
      try {
        await section.findItem(testProjectName);
        return true;
      } catch {
        return false;
      }
    }, timeout, `Project ${testProjectName} did not appear in time`);
  }

  before(async () => {
    workbench = await getReadyWorkbench();
  });

  registerGlobalCleanup();

  // Cleans up any existing test project after the test to ensure a clean state
  after(async function () {
    this.timeout(30000); // 30 seconds timeout for cleanup
    try {
      await runCommand("teroshdl.view.project.delete");
      // 800 ms timeout for InputBox to appear
      const input = await InputBox.create(800);
      const picks = await input.getQuickPicks();
      for (const pick of picks) {
        if ((await pick.getLabel()).includes(testProjectName)) {
          await pick.select();
          return;
        }
      }
      await input.cancel();
    } catch {
      // If the project doesn't exist, there's nothing to clean up
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

    // Save project in the InputBox that appears after naming the project
    const teroshdlControl = await getTerosHdlControl();
    const sidebar = await teroshdlControl.openView();
    const content = await sidebar.getContent();
    const section = await content.getSection("Projects");
    expect(section).to.not.be.undefined;

    await section.expand();
    await waitForProjectItem(section);
    const projectItem = await section.findItem(testProjectName);
    expect(projectItem).to.not.be.undefined;
  });
});