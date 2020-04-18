import express, { Application, json, Router } from "express";
import RoutesInitializer from "./routes/RoutesInitializer";
import { createConnection } from "typeorm";

class NodeServer {
    _server!: Application;

    async start(): Promise<void> {
        this.createServer();
        this._server.use(json());
        const routes: Router = await new RoutesInitializer().run();
        this._server.use("/api", routes);
        await createConnection({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "user",
            password: "user",
            database: "db",
            entities: [__dirname + "/entity/**/*.ts"],
        });
    }

    createServer(): void {
        this._server = express();
        this._server.listen(3000);
    }
}

const nodeServer = new NodeServer();
(async (): Promise<void> => {
    await nodeServer.start();
})();
