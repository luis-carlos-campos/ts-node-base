/**
 * Load all routes from current directory into express app.
 */
import { Application } from "express";
import { createConnection } from "typeorm";
import Runnable from "../interface/StartUpRunnable";
import LoggerUtil from "../util/LoggerUtil";

class RoutesInitializer implements Runnable {
    async run(server: Application): Promise<Application> {
        const logger = LoggerUtil.getLogger("DatabaseInitializer");
        logger.debug("Initializing TypeORM...");
        await createConnection();
        logger.debug("TypeORM initialization was completed.");
        return server;
    }
}

export default RoutesInitializer;
