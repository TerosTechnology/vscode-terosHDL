// This test suite checks the activation of the TerosHDL extension in Visual Studio Code

import { expect } from "chai";
import { ActivityBar } from "vscode-extension-tester";
import { getReadyWorkbench, getTerosHdlControl, registerGlobalCleanup } from "./helpers";

describe("TerosHDL Activation", () => {
  before(async () => {
    await getReadyWorkbench();
  });

  registerGlobalCleanup();

  it("VS Code workbench loads", async function () {
    this.timeout(30000);
    const activityBar = new ActivityBar();
    const controls = await activityBar.getViewControls();
    expect(controls.length).to.be.greaterThan(0);
  });

  it("TerosHDL extension is installed and workbench loads", async function () {
    this.timeout(20000);
    const teroshdlControl = await getTerosHdlControl();
    const title = await teroshdlControl.getTitle();
    expect(title).to.include("TerosHDL");
  });

});