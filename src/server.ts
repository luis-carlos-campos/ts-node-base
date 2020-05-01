import Express, { Application, json } from "express";
import DatabaseInitializer from "./initializer/DatabaseInitializer";
import RoutesInitializer from "./initializer/RoutesInitializer";
import MorganInitializer from "./initializer/MorganInitializer";
import StartUpRunnable from "./interface/StartUpRunnable";

// TODO: Error hanlding
// TODO: 404
// TODO: DB Migrations
class NodeServer {
    server!: Application;

    async start(): Promise<void> {
        this.createServer();

        this.server.use(json());

        const initializersToRun: StartUpRunnable[] = [
            new MorganInitializer(),
            new DatabaseInitializer(),
            new RoutesInitializer(),
        ];

        for (const initializer of initializersToRun) {
            this.server = await initializer.run(this.server);
        }
    }

    createServer(): void {
        this.server = Express();
        this.server.listen(3000);
    }
}

const nodeServer = new NodeServer();
(async (): Promise<void> => {
    await nodeServer.start();
})();
