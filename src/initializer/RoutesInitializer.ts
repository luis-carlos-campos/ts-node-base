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
import AbstractRoute from "../route/AbstractRoute";

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
            const routeClass: unknown = new (await import(routeFile)).default();
            if (routeClass instanceof AbstractRoute) {
                router.use(`/${fileWithoutSufix}`, routeClass.router);
                logger.debug(`${fileWithoutSufix} route created.`);
                continue;
            } else {
                logger.warn(
                    `Skipping ${fileWithoutSufix}. It's not an instance of AbstractRoute.`
                );
            }
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
                logger.error(`Error Stack\n
                "************************* START STACK *************************\n
                ${err.stack}\n
                *************************   END STACK  *************************
                `);
                res.status(statusCode).json(response);
                next();
            }
        );

        logger.debug("Configuring default 404 response.");
        server.use(function (req: Request, res: Response) {
            res.status(HttpStatusCode.NOT_FOUND).send([
                ResponseUtil.createErrorResponse({
                    statusCode: HttpStatusCode.NOT_FOUND,
                    name: "Not Found",
                    message: `Could not find endpoint: ${req.url}`,
                }),
            ]);
        });

        logger.debug("Routing initialization was completed.");
        return server;
    }
}

export default RoutesInitializer;
