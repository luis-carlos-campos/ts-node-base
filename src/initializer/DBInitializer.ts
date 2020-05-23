/**
 * Load TypeORM connection pool.
 */
import { Application } from "express";
import { createConnection } from "typeorm";
import Runnable from "../interface/StartUpRunnable";
import LoggerUtil from "../util/LoggerUtil";
import TypeORMConfig from "../config/TypeORMConfig";

class RoutesInitializer implements Runnable {
    async run(server: Application): Promise<Application> {
        const logger = LoggerUtil.getLogger("DatabaseInitializer");
        logger.debug("Initializing TypeORM...");
        await createConnection(TypeORMConfig);
        logger.debug("TypeORM initialization was completed.");
        return server;
    }
}

export default RoutesInitializer;
