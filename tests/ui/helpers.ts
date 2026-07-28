// Shared utilities + global cleanup hooks

import { ActivityBar, InputBox, SideBarView, VSBrowser, ViewControl, Workbench } from "vscode-extension-tester";

// Wait for the workbench to be ready and return a Workbench object
export async function getReadyWorkbench(): Promise<Workbench> {
  await VSBrowser.instance.waitForWorkbench();
  return new Workbench();
}

// Open (and return) the TerosHDL sidebar. Throw if the extension is not active
export async function openTerosHdlSidebar(): Promise<SideBarView> {
  const control = await getTerosHdlControl();
  return control.openView();
}

// Return the TerosHDL view control in the Activity Bar, or throw if it does not exist
export async function getTerosHdlControl(): Promise<ViewControl> {
  const activityBar = new ActivityBar();
  const control = await activityBar.getViewControl("TerosHDL");
  if (!control) {
    throw new Error("TerosHDL view control not found - extension may not be active");
  }
  return control;
}

// Execute a TerosHDL command by id through the Command Palette
export async function runCommand(commandId: string): Promise<void> {
  const workbench = new Workbench();
  await workbench.openCommandPrompt();
  const input = await InputBox.create();
  await input.setText(`>${commandId}`);
  await input.confirm();
}

// Wait for at least one quick pick to appear in the InputBox
export async function waitForQuickPicks(input: InputBox, timeout = 8000): Promise<void> {
  await input.getDriver().wait(async () => {
    const picks = await input.getQuickPicks();
    return picks.length > 0;
  }, timeout, "No quick picks appeared in time");
}

// Close any open input box. Safe even when there is none open
export async function dismissOpenDialogs(): Promise<void> {
  try {
    const input = await InputBox.create(1000);
    await input.cancel();
  } catch {
    // No open input boxes
  }
}

// Hook: run after each test to leave UI clean
export function registerGlobalCleanup(): void {
  afterEach(async function () {
    await dismissOpenDialogs();
  });
}