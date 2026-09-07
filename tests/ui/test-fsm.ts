import { expect } from "chai";
import { EditorView, VSBrowser } from "vscode-extension-tester";
import { getReadyWorkbench, registerGlobalCleanup, runCommand } from "./helpers";

describe("TerosHDL State Machine Viewer", () => {
    before(async () => {
        await getReadyWorkbench();
    });

    registerGlobalCleanup();

    it("opens the FSM viewer tab for a VHDL file with a state machine", async function () {
        this.timeout(30000);

        await VSBrowser.instance.openResources("tests/ui/fixtures/fsm_example.vhd");

        const editorView = new EditorView();
        const sourceEditor = await editorView.openEditor("fsm_example.vhd");
        await sourceEditor.click();

        await runCommand("teroshdl.state_machine.viewer");

        await editorView.getDriver().wait(async () => {
            const titles = await editorView.getOpenEditorTitles();
            return titles.some((t) => t.toLowerCase().includes("state machine"));
        }, 15000, "State Machine viewer tab did not open");

        const titles = await editorView.getOpenEditorTitles();
        expect(titles.some((t) => t.toLowerCase().includes("state machine"))).to.be.true;
    });
});