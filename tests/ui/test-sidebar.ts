// Verify that sidebar views are present and functional

import { expect } from "chai";
import { getReadyWorkbench, openTerosHdlSidebar, registerGlobalCleanup } from "./helpers";

describe("TerosHDL Sidebar", () => {
  before(async () => {
    await getReadyWorkbench();
  });

  registerGlobalCleanup();

  it("shows all expected views in the sidebar", async function () {
    this.timeout(30000);
    const sidebar = await openTerosHdlSidebar();
    const content = await sidebar.getContent();
    const sections = await content.getSections();
    const titles = await Promise.all(sections.map((s) => s.getTitle()));

    // Core views that should always be present on activation
    const expectedViews = ["Projects", "Files", "Hierarchy"];
    for (const view of expectedViews) {
      expect(titles, `Missing view "${view}"`).to.include(view);
    }
  });

  it("Projects view is present and expandable", async function () {
    this.timeout(20000);
    const sidebar = await openTerosHdlSidebar();
    const content = await sidebar.getContent();
    const projects = await content.getSection("Projects");
    expect(projects).to.not.be.undefined;
    await projects.expand();
    expect(await projects.isExpanded()).to.be.true;
  });
});