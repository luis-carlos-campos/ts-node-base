import ServerInitializer from "./initializer/ServerInitializer";
import ConfigUtil from "./util/ConfigUtil";

(async (): Promise<void> => {
    const server = await ServerInitializer.getServer();
    server.listen(ConfigUtil.getServerConfigs().port);
})();
