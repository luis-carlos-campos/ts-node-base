/**
 * Load all routes from current directory into express app.
 */
import { Application } from "express";
import { createConnection } from "typeorm";
import Runnable from "../interface/StartUpRunnable";
import ServerConfigUtil from "../util/ServerConfigUtil";
import LoggerUtil from "../util/LoggerUtil";
import path from "path";

class RoutesInitializer implements Runnable {
    async run(server: Application): Promise<Application> {
        const logger = LoggerUtil.getLogger("DatabaseInitializer");
        logger.debug("Initializing TypeORM...");
        const {
            host,
            port,
            username,
            password,
            database,
        } = ServerConfigUtil.getDataBaseConfigs();
        const con = await createConnection({
            type: "mysql",
            host,
            port,
            username,
            password,
            database,
            entities: [path.resolve(__dirname, "../entity/**/*.ts")],
        });
        await con.synchronize();
        logger.debug("TypeORM initialization was completed.");
        return server;
    }
}

export default RoutesInitializer;
