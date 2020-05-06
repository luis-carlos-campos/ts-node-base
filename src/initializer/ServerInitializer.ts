import Express, { Application, json } from "express";
import Compression from "compression";
import DatabaseInitializer from "./DatabaseInitializer";
import RoutesInitializer from "./RoutesInitializer";
import MorganInitializer from "./MorganInitializer";
import StartUpRunnable from "../interface/StartUpRunnable";

// TODO: DB Migrations
// TODO: Filter/Sort/Pagination
// TODO: Tests
class NodeServer {
    server!: Application;

    async start(): Promise<void> {
        this.server = Express();
        this.server.listen(3000);

        this.server.use(json());
        this.server.use(Compression());

        const initializersToRun: StartUpRunnable[] = [
            new MorganInitializer(),
            new DatabaseInitializer(),
            new RoutesInitializer(),
        ];

        for (const initializer of initializersToRun) {
            this.server = await initializer.run(this.server);
        }
    }
}

export default NodeServer;
