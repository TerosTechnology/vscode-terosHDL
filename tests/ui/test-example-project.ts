import { expect } from "chai";
import { InputBox } from "vscode-extension-tester";
import { deleteProjectFromTree, getProjectsSection, getReadyWorkbench, registerGlobalCleanup, runCommand, waitForQuickPicks } from "./helpers";

describe("TerosHDL Example Project", () => {
    let addedProjectName: string | undefined;
    const exampleOptionName = "GHDL";
    const expectedProjectNames = ["project_nvc", "project_ghdl"];

    before(async () => {
        await getReadyWorkbench();
        for (const projectName of expectedProjectNames) {
            await deleteProjectFromTree(projectName).catch(() => {
                // Project may not exist yet
            });
        }
    });

    registerGlobalCleanup();

    after(async function () {
        this.timeout(30000);
        if (!addedProjectName) {
            return;
        }
        try {
            await deleteProjectFromTree(addedProjectName);
        } catch (err) {
            console.warn(`[cleanup] Could not delete example project: ${err}`);
        }
    });

    it("can add the GHDL example project and it appears in the Projects tree", async function () {
        this.timeout(60000);

        await runCommand("teroshdl.view.project.add");

        const typePicker = await InputBox.create(15000);
        await waitForQuickPicks(typePicker);
        const typeOptions = await typePicker.getQuickPicks();
        const typeLabels = await Promise.all(typeOptions.map((p) => p.getLabel()));

        const exampleOptionIndex = typeLabels.findIndex((label) => label.toLowerCase().includes("example"));
        expect(exampleOptionIndex, `No \"example\" option found. Available: ${typeLabels.join(", ")}`).to.be.greaterThan(-1);
        await typeOptions[exampleOptionIndex].select();

        const examplePicker = await InputBox.create(15000);
        await waitForQuickPicks(examplePicker);
        const exampleOptions = await examplePicker.getQuickPicks();
        const exampleLabels = await Promise.all(exampleOptions.map((p) => p.getLabel()));

        const ghdlOptionIndex = exampleLabels.findIndex((label) => label.toLowerCase().includes(exampleOptionName.toLowerCase()));
        expect(ghdlOptionIndex, `No ${exampleOptionName} example found. Available: ${exampleLabels.join(", ")}`).to.be.greaterThan(-1);

        await exampleOptions[ghdlOptionIndex].select();

        const section = await getProjectsSection();
        await section.getDriver().wait(async () => {
            for (const projectName of expectedProjectNames) {
                const projectItem = await section.findItem(projectName);
                if (projectItem) {
                    addedProjectName = projectName;
                    return true;
                }
            }
            return false;
        }, 20000, "Example project did not appear in the Projects tree");

        expect(addedProjectName, `No example project found. Checked: ${expectedProjectNames.join(", ")}`).to.not.be.undefined;
    });
});