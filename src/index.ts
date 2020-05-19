import ServerInitializer from "./initializer/ServerInitializer";

(async (): Promise<void> => {
    const server = await ServerInitializer.getServer();
    // TODO: Move port to server config file
    server.listen(3000);
})();
