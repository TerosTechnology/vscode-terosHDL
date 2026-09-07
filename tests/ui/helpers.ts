// Shared utilities + global cleanup hooks

import { ActivityBar, EditorView, InputBox, SideBarView, TreeItem, VSBrowser, ViewControl, ViewSection, Workbench } from "vscode-extension-tester";

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

// Return the Projects section from the TerosHDL sidebar
export async function getProjectsSection(): Promise<ViewSection> {
  const sidebar = await openTerosHdlSidebar();
  const content = await sidebar.getContent();
  const section = await content.getSection("Projects");
  if (!section) {
    throw new Error("Projects section not found in TerosHDL sidebar");
  }
  await section.expand();
  return section;
}

// Return the labels of the currently visible project items in the Projects tree
export async function getVisibleProjectLabels(): Promise<string[]> {
  const section = await getProjectsSection();
  const items = await section.getVisibleItems() as TreeItem[];
  return Promise.all(items.map((item) => item.getLabel()));
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

// Wait for a project item to appear in the Projects tree and return it
export async function waitForProjectItem(projectName: string, timeout = 10000) {
  const section = await getProjectsSection();
  await section.getDriver().wait(async () => {
    try {
      const projectItem = await section.findItem(projectName);
      return !!projectItem;
    } catch {
      return false;
    }
  }, timeout, `Project ${projectName} did not appear in time`);

  const projectItem = await section.findItem(projectName) as TreeItem | undefined;
  if (!projectItem) {
    throw new Error(`Project ${projectName} not found after waiting`);
  }
  return projectItem;
}

// Delete a project from the Projects tree using its inline action button
export async function deleteProjectFromTree(projectName: string, timeout = 10000): Promise<void> {
  const section = await getProjectsSection();
  const projectItem = await section.findItem(projectName) as TreeItem | undefined;
  if (!projectItem) {
    return;
  }

  await projectItem.select();
  const deleteAction = await projectItem.getActionButton("Delete project");
  if (!deleteAction) {
    throw new Error(`Delete action not found for project ${projectName}`);
  }
  await deleteAction.safeClick();

  await section.getDriver().wait(async () => {
    try {
      const item = await section.findItem(projectName);
      return !item;
    } catch {
      return true;
    }
  }, timeout, `Project ${projectName} was not deleted in time`);
}

// Hook: run after each test to leave UI clean
export function registerGlobalCleanup(): void {
  afterEach(async function () {
    await dismissOpenDialogs();
    try {
      await new EditorView().closeAllEditors();
    } catch {
      // No open editors
    }
  });
}