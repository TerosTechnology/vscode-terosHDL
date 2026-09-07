import { expect } from "chai";
import { EditorView, VSBrowser } from "vscode-extension-tester";
import { getReadyWorkbench, registerGlobalCleanup, runCommand } from "./helpers";

describe("TerosHDL Module Documenter", () => {
    before(async () => {
        await getReadyWorkbench();
    });

    registerGlobalCleanup();

    it("opens the documentation tab for a VHDL file", async function () {
        this.timeout(30000);

        await VSBrowser.instance.openResources("tests/ui/fixtures/counter.vhd");

        const editorView = new EditorView();
        const sourceEditor = await editorView.openEditor("counter.vhd");
        await sourceEditor.click();

        await runCommand("teroshdl.documentation.module");

        await editorView.getDriver().wait(async () => {
            const titles = await editorView.getOpenEditorTitles();
            return titles.some((t) =>
                t.toLowerCase().includes("documentation") ||
                t.toLowerCase().includes("documenter") ||
                t.toLowerCase().includes("module documentation")
            );
        }, 15000, "Documentation viewer tab did not open");

        const titles = await editorView.getOpenEditorTitles();
        expect(
            titles.some((t) =>
                t.toLowerCase().includes("documentation") ||
                t.toLowerCase().includes("documenter") ||
                t.toLowerCase().includes("module documentation")
            )
        ).to.be.true;
    });
});