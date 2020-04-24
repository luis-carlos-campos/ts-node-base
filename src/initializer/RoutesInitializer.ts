/**
 * Load all routes from current directory into express app.
 */
import { Application, Router } from "express";
import { lstatSync, readdirSync } from "fs";
import Runnable from "../interface/StartUpRunnable";
import path from "path";
import LoggerService from "../util/LoggerUtil";

class RoutesInitializer implements Runnable {
    async run(server: Application): Promise<Application> {
        const logger = LoggerService.getLogger("RoutesInitializer");

        logger.debug("Initializing Routing configuration...");

        const router = Router();
        const routesFolder = path.resolve(__dirname, "../route");
        for (const fileName of readdirSync(routesFolder)) {
            const originalFileName = fileName;

            // Removing .ts suffix
            const fileWithoutSufix = fileName.split(".")[0];

            // Ignore AbstractRoute
            if (fileWithoutSufix === "AbstractRoute") {
                logger.debug(`Skipping ${fileWithoutSufix}`);
                continue;
            }

            logger.debug(`Creating routing for ${fileWithoutSufix}`);

            const routeFile = `${routesFolder}/${originalFileName}`;

            // Ignore Directories
            if (lstatSync(routeFile).isDirectory()) {
                continue;
            }
            // Mount router
            // TODO: make sure we can new it.
            const routeRouter: Router = new (await import(routeFile)).default()
                .router;
            router.use(`/${fileWithoutSufix}`, routeRouter);
            logger.debug(`${fileWithoutSufix} route created.`);
        }
        server.use("/api", router);

        logger.debug("Routing initialization was completed.");
        return server;
    }
}

export default RoutesInitializer;
