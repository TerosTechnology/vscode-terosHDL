import { get_default_config } from "../../src/config/config_declaration";

const sync_file_path = 'path/to/config.json';

function setupFileMocks(customConfig = {}) {
    const save_file_sync = jest.fn((file_path: string, content: string) => {
        expect(file_path).toBe(sync_file_path);
        return JSON.parse(content);
    });

    jest.mock('../../src/utils/file_utils', () => ({
        ...jest.requireActual('../../src/utils/file_utils'),
        save_file_sync: save_file_sync,
        ...customConfig,
    }));

    return save_file_sync;
}

async function importGlobalConfigManager() {
    // GlobalConfigManager is a Singleton, so it will keep the state between tests
    // Instead of a regular import, it's imported here after using jest.resetModules.
    // That forces to behave each time like the first one
    jest.mock('../../src/config/config_declaration', () => ({
        ...jest.requireActual('../../src/config/config_declaration'),
        get_config_from_json: jest.fn((item) => {
            return item;
        })
    }));

    jest.resetModules(); // Needs to be called after setting up all mocks !!!!
    const module = await import("../../src/config/config_manager");
    return module.GlobalConfigManager;
}

describe('GlobalConfigManager', () => {

    it('should create a new instance', async () => {
        const GlobalConfigManager = await importGlobalConfigManager();

        const configManager = GlobalConfigManager.newInstance(sync_file_path);

        expect(configManager).toBeInstanceOf(GlobalConfigManager);
    });

    it('should always return the same instance', async () => {
        const GlobalConfigManager = await importGlobalConfigManager();

        const firstInstance = GlobalConfigManager.newInstance(sync_file_path);
        const secondInstance = GlobalConfigManager.getInstance();

        expect(firstInstance).toBe(secondInstance);
    });

    it('should throw an error if getInstance is called without newInstance', async () => {
        const GlobalConfigManager = await importGlobalConfigManager();

        expect(() => GlobalConfigManager.getInstance()).toThrow();
    });

    it('should start with the default config', async () => {
        const GlobalConfigManager = await importGlobalConfigManager();
        GlobalConfigManager.newInstance(sync_file_path);

        expect(GlobalConfigManager.getInstance().get_config()).toEqual(get_default_config());
    });

    it('should load configuration from file', async () => {
        const my_config = {
            general: true,
            list: [1, 2],
            child: {
                path: "",
            }
        };
        setupFileMocks({
            read_file_sync: jest.fn().mockReturnValue(JSON.stringify(my_config)),
        });
        const GlobalConfigManager = await importGlobalConfigManager();
        GlobalConfigManager.newInstance(sync_file_path);

        GlobalConfigManager.getInstance().load();

        expect(GlobalConfigManager.getInstance().get_config()).toEqual(my_config);
    });

    it('should save configuration to file', async () => {
        const save_file_sync = setupFileMocks();
        const GlobalConfigManager = await importGlobalConfigManager();
        GlobalConfigManager.newInstance(sync_file_path);

        GlobalConfigManager.getInstance().save();

        expect(save_file_sync).toHaveBeenCalled();
    });

});
