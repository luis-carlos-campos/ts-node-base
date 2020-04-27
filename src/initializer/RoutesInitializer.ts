/**
 * Load all routes from current directory into express app.
 */
import { Application, Router, Request, Response, NextFunction } from "express";
import { lstatSync, readdirSync } from "fs";
import Runnable from "../interface/StartUpRunnable";
import path from "path";
import LoggerService from "../util/LoggerUtil";
import ServerError from "../errors/ServerError";
import ResponseUtil from "../util/ResponseUtil";
import HttpStatusCode from "../enum/HttpStatusCode";

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

        // Adding routes to express.
        server.use("/api", router);

        // Error handling
        server.use(
            (err: Error, _$: Request, res: Response, next: NextFunction) => {
                let statusCode: HttpStatusCode =
                    HttpStatusCode.INTERNAL_SERVER_ERROR;
                let response;
                if (err instanceof ServerError) {
                    statusCode = err.statusCode;
                    logger.error("Error raised inside Server code");
                    response = ResponseUtil.createErrorResponse(err);
                } else {
                    logger.error("Unknown Error raised inside Server code");
                    const { name, message } = err;
                    response = ResponseUtil.createErrorResponse({
                        statusCode,
                        name,
                        message,
                    });
                }
                logger.error(`Error Code: ${statusCode}`);
                logger.error(`Error Name: ${err.name}`);
                logger.error(`Error Message: ${err.message}`);
                logger.error(`Error Stack\n ${err.stack}`);
                res.status(statusCode).json(response);
                next();
            }
        );

        logger.debug("Routing initialization was completed.");
        return server;
    }
}

export default RoutesInitializer;
