import ServerInitializer from "./initializer/ServerInitializer";

(async (): Promise<void> => {
    const server = await ServerInitializer.getServer();
    server.listen(3000);
})();
