import { Project_manager } from "../../src/project_manager/project_manager";
import { GlobalConfigManager } from "../../src/config/config_manager";
import { get_default_config } from "../../src/config/config_declaration";
import { ProjectEmitter } from "../../src/project_manager/projectEmitter";

describe('ProjectManager Configuration', () => {

    GlobalConfigManager.newInstance("");
    let projectManager: Project_manager;

    beforeEach(() => {
        GlobalConfigManager.getInstance().set_config(get_default_config()); // Restore default config before each test
        projectManager = new Project_manager("Project1", new ProjectEmitter());
    });

    it('should initialize configuration with default config', () => {
        expect(projectManager.get_config()).toEqual(get_default_config());
    });

    it('should successfully overwrite a config value', () => {
        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.general.general.pypath = "my/path";

        // Set new config. Only one key has changed
        projectManager.set_config(originalConfig);

        // Expected merged config
        const expectedConfig = get_default_config();
        expectedConfig.general.general.pypath = originalConfig.general.general.pypath;
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should successfully overwrite multiple values', () => {
        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.general.general.pypath = "my/py/path";
        originalConfig.documentation.general.magic_config_path = "my/magic/path";

        // Set new config
        projectManager.set_config(originalConfig);

        // Expected merged config
        const expectedConfig = get_default_config();
        expectedConfig.general.general.pypath = originalConfig.general.general.pypath;
        expectedConfig.documentation.general.magic_config_path = originalConfig.documentation.general.magic_config_path;
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should successfully overwrite a full config object', () => {
        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.general.general = {
            pypath: "A",
            makepath: "B",
            go_to_definition_vhdl: true,
            go_to_definition_verilog: false,
            developer_mode: true,
        };

        // Set new config. Only one key has changed
        projectManager.set_config(originalConfig);

        // Expected merged config
        const expectedConfig = get_default_config();
        expectedConfig.general.general = originalConfig.general.general;
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should successfully overwrite a partial config object', () => {
        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.general.general = {
            pypath: "AAAAAAAAAAAAAAAAAAAAAAAA",
            makepath: undefined as any,
            go_to_definition_vhdl: undefined as any,
            go_to_definition_verilog: undefined as any,
            developer_mode: true,
        };

        // Set new config. Only one key has changed
        projectManager.set_config(originalConfig);

        // Expected merged config
        const expectedConfig = get_default_config();
        expectedConfig.general.general.pypath = originalConfig.general.general.pypath;
        expectedConfig.general.general.developer_mode = originalConfig.general.general.developer_mode;
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should successfully overwrite an array', () => {
        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.tools.ghdl.run_options = ["1", "2"];

        // Set new config. Only one key has changed
        projectManager.set_config(originalConfig);

        // Expected merged config
        const expectedConfig = get_default_config();
        expectedConfig.tools.ghdl.run_options = originalConfig.tools.ghdl.run_options;
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should successfully overwrite an array, not merging it with the one set in global', () => {
        // Change global value
        GlobalConfigManager.getInstance().get_config().tools.ghdl.run_options = [0, 1, 2];

        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.tools.ghdl.run_options = ["A", "B"];

        // Set new config. Only one key has changed
        projectManager.set_config(originalConfig);

        // Expected merged config
        const expectedConfig = get_default_config();
        expectedConfig.tools.ghdl.run_options = originalConfig.tools.ghdl.run_options;
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should successfully overwrite a value after being changed in global config', () => {
        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.general.general.pypath = "my/path";

        // Set new config. Only one key has changed
        projectManager.set_config(originalConfig);

        // Change global config
        GlobalConfigManager.getInstance().get_config().general.general.pypath = "another/different/path.py";

        // Expected merged config
        const expectedConfig = get_default_config();
        expectedConfig.general.general.pypath = originalConfig.general.general.pypath;
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should not be lost after the global config is changed to project config, if project config is not set', () => {
        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.general.general.pypath = "first/path";

        // Set new config. Only one key has changed
        projectManager.set_config(originalConfig);

        // Change global config to same value
        GlobalConfigManager.getInstance().get_config().general.general.pypath = originalConfig.general.general.pypath;

        // Change global config to a different value
        GlobalConfigManager.getInstance().get_config().general.general.pypath = "second/path";

        // Project config is still the value specified for this project
        const expectedConfig = get_default_config();
        expectedConfig.general.general.pypath = originalConfig.general.general.pypath;
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should be lost after the global config is changed to project config, if project config is set', () => {
        // Change a value from default to a different one
        const originalConfig = projectManager.get_config();
        originalConfig.general.general.pypath = "first/path";

        // Set new config. Only one key has changed
        projectManager.set_config(originalConfig);

        // Change global config to same value
        GlobalConfigManager.getInstance().get_config().general.general.pypath = originalConfig.general.general.pypath;

        // Save project config again. It will only save the diff, so original change is lost.
        projectManager.set_config(originalConfig);

        // Change global config to a different value
        GlobalConfigManager.getInstance().get_config().general.general.pypath = "second/path";

        // Project config has now the new global value
        const expectedConfig = get_default_config();
        expectedConfig.general.general.pypath = "second/path";
        expect(projectManager.get_config()).toEqual(expectedConfig);
    });

    it('should save and load configuration successfully', async () => {
        // Change a config value
        const originalConfig = projectManager.get_config();
        originalConfig.general.general.pypath = "my/path";
        projectManager.set_config(originalConfig);

        const newProjectManager = await Project_manager.fromJson(projectManager.get_edam_json(), "", new ProjectEmitter());

        expect(newProjectManager.get_config()).toEqual(originalConfig);
    });

});

