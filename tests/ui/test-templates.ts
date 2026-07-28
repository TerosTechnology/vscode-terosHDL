// Check the template generation command, which opens a quick pick for the template type

import { expect } from "chai";
import { InputBox, VSBrowser } from "vscode-extension-tester";
import { getReadyWorkbench, registerGlobalCleanup, runCommand, waitForQuickPicks } from "./helpers";

describe("TerosHDL Template Generation", () => {
    before(async () => {
      await getReadyWorkbench();
    });

    registerGlobalCleanup();

    it("offers template options when invoked", async function () {
      this.timeout(30000);

      await VSBrowser.instance.openResources("tests/ui/fixtures/counter.vhd");

      await runCommand("teroshdl.generate_template");

      const input = await InputBox.create(15000);
      await waitForQuickPicks(input);
      const picks = await input.getQuickPicks();
      expect(picks.length).to.be.greaterThan(0);

      await input.cancel();
    });
});