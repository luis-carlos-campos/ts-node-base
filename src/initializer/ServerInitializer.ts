import Express, { Application, json } from "express";
import Compression from "compression";
import DBInitializer from "./DBInitializer";
import RoutesInitializer from "./RoutesInitializer";
import LogInitializer from "./LogInitializer";
import StartUpRunnable from "../interface/StartUpRunnable";

// TODO: Filter/Sort
class ServerInitializer {
    static async getServer(): Promise<Application> {
        let server: Application = Express();

        server.use(json());
        server.use(Compression());

        const initializersToRun: StartUpRunnable[] = [
            new LogInitializer(),
            new DBInitializer(),
            new RoutesInitializer(),
        ];

        for (const initializer of initializersToRun) {
            server = await initializer.run(server);
        }
        return server;
    }
}

export default ServerInitializer;
