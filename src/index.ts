import NodeServer from "./initializer/ServerInitializer";

const nodeServer = new NodeServer();
(async (): Promise<void> => {
    await nodeServer.start();
})();
