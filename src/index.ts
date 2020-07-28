import ServerInitializer from "./initializer/ServerInitializer";
import ConfigUtil from "./util/ConfigUtil";

(async (): Promise<void> => {
    const { port } = ConfigUtil.getServerConfigs();
    const server = await ServerInitializer.getServer();
    server.listen(port);
})().catch((error) => {
    console.error(
        "Un unexpected error occurred while server was starting up.\n"
    );
    console.error(error);
});
