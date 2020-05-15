import Express, { Application, json } from "express";
import Compression from "compression";
import DatabaseInitializer from "./DatabaseInitializer";
import RoutesInitializer from "./RoutesInitializer";
import LogInitializer from "./LogInitializer";
import StartUpRunnable from "../interface/StartUpRunnable";

// TODO: DB Migrations
// TODO: Filter/Sort/Pagination
// TODO: Tests
// TODO: Improve import
class ServerInitializer {
    static async getServer(): Promise<Application> {
        let server: Application = Express();

        server.use(json());
        server.use(Compression());

        const initializersToRun: StartUpRunnable[] = [
            new LogInitializer(),
            new DatabaseInitializer(),
            new RoutesInitializer(),
        ];

        for (const initializer of initializersToRun) {
            server = await initializer.run(server);
        }
        return server;
    }
}

export default ServerInitializer;
