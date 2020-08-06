/**
 * Load all routes from current directory into express app.
 */
import { Application, Router, Request, Response, NextFunction } from 'express';
import { lstatSync, readdirSync } from 'fs';
import Runnable from '@interface/StartUpRunnable';
import path from 'path';
import LoggerService from '@util/LoggerUtil';
import ServerError from '@error/ServerError';
import ResponseUtil from '@util/ResponseUtil';
import HttpStatusCode from '@enum/HttpStatusCode';
import AbstractRoute from '@route/AbstractRoute';

class RoutesInitializer implements Runnable {
    async run(server: Application): Promise<Application> {
        const logger = LoggerService.getLogger('RoutesInitializer');

        logger.debug('Initializing Routing configuration...');

        const router = Router();
        const routesFolder = path.resolve(__dirname, '../route');
        for (const fileName of readdirSync(routesFolder)) {
            const originalFileName = fileName;

            // Removing .ts suffix
            const fileWithoutSufix = fileName.split('.')[0];

            // Ignore AbstractRoute
            const ignoredRoutes = ['AbstractRoute', 'AbstractCrudRoute'];
            if (ignoredRoutes.includes(fileWithoutSufix)) {
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

            // Can not predict import.
            /* eslint-disable */
            const routeToBeCreated = new (await import(routeFile)).default();
            /* eslint-enable */

            if (routeToBeCreated instanceof AbstractRoute) {
                const customRouteName = Reflect.get(
                    routeToBeCreated,
                    'routeName'
                ) as unknown;
                const routeName =
                    customRouteName && typeof customRouteName === 'string'
                        ? customRouteName
                        : fileWithoutSufix;

                router.use(`/${routeName}`, routeToBeCreated.router);
                routeToBeCreated.setupRoutes();
                logger.debug(`${routeName} route created.`);
                continue;
            } else {
                logger.warn(
                    `Skipping ${fileWithoutSufix}. It's not an instance of AbstractRoute.`
                );
            }
        }

        // Adding routes to express.
        server.use('/api', router);

        // Error handling
        server.use(
            // Next parameter will not be used, however express requires the definition otherwise the error handling will not work.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (err: Error, _1: Request, res: Response, _2: NextFunction) => {
                let statusCode: HttpStatusCode =
                    HttpStatusCode.INTERNAL_SERVER_ERROR;
                let response;
                const { name, message, stack } = err;
                if (err instanceof ServerError) {
                    statusCode = err.statusCode;
                    logger.error('Error raised inside Server code');
                    response = ResponseUtil.createErrorResponse(err);
                } else {
                    logger.error('Unknown Error raised inside Server code');
                    response = ResponseUtil.createErrorResponse({
                        statusCode,
                        name,
                        message,
                    });
                }
                logger.error(`Error Code: ${statusCode}`);
                logger.error(`Error Name: ${name}`);
                logger.error(`Error Message: ${message}`);
                if (stack) {
                    logger.error(`Error Stack\n
                    "************************* START STACK *************************\n
                    ${stack}\n
                    *************************   END STACK  *************************
                    `);
                }
                res.status(statusCode).json(response);
            }
        );

        logger.debug('Configuring default 404 response.');
        server.use(function (req: Request, res: Response) {
            res.status(HttpStatusCode.NOT_FOUND).send([
                ResponseUtil.createErrorResponse({
                    statusCode: HttpStatusCode.NOT_FOUND,
                    name: 'Not Found',
                    message: `Could not find endpoint: ${req.url}`,
                }),
            ]);
        });

        logger.debug('Routing initialization was completed.');
        return server;
    }
}

export default RoutesInitializer;
