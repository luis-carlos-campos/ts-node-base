/**
 * Load all routes from current directory into express app.
 */
import { Application } from "express";
import { createConnection } from "typeorm";
import Runnable from "../interface/StartUpRunnable";

class RoutesInitializer implements Runnable {
    async run(server: Application): Promise<Application> {
        await createConnection({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "user",
            password: "user",
            database: "db",
            entities: [__dirname + "/entity/**/*.ts"],
        });
        return server;
    }
}

export default RoutesInitializer;
