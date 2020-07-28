import express, { Request, Response, Router, NextFunction } from "express";
import RouteMethod from "../type/RouteMethod";
import { Logger } from "winston";
import LoggerService from "../util/LoggerUtil";
import { getConnection, EntityManager } from "typeorm";
import NotImplementedError from "../errors/NotImplementedError";
import AbstractController from "../controller/AbstractController";
import JsonApiResponse from "../type/response/json-api/JsonApiResponse";

/**
 * This Route is meant to be extended by all other routes.
 * It'll provide error handling and transactional entity manager
 */
abstract class AbstractRoute<C extends AbstractController, RT> {
    protected abstract allowedRouteMethods: RouteMethod[];
    protected controller: new (entityManager: EntityManager) => C;
    protected logger: Logger = LoggerService.getLogger("AbstractRoute");
    protected _router: Router;

    constructor(readonly controllerT: new (entityManager: EntityManager) => C) {
        this.controller = controllerT;
        this._router = express.Router({ mergeParams: true });
    }

    /**
     * Configures router according to allowedRouteMethods.
     */
    setupRoutes(): void {
        this.allowedRouteMethods.forEach(
            ({ httpMethod, methodName, path, standardCode }) => {
                this._router[httpMethod](path, async (req, res, next) => {
                    // Getting a connection and create a new query runner
                    const connection = getConnection();
                    const queryRunner = connection.createQueryRunner();

                    // Establishing real database connection using our new query runner
                    await queryRunner.connect();
                    // Opening transaction
                    await queryRunner.startTransaction();

                    try {
                        const controller: C = new this.controller(
                            queryRunner.manager
                        );
                        const methodToBeCalled = Reflect.get(
                            controller,
                            methodName
                        ) as (
                            req: Request,
                            res: Response,
                            next: NextFunction
                        ) => RT | Promise<RT> | RT[] | Promise<RT[]>;
                        if (
                            !methodToBeCalled ||
                            typeof methodToBeCalled !== "function"
                        ) {
                            throw new NotImplementedError(
                                `Method ${methodName} was not implemented in controller class`
                            );
                        }
                        const data = await methodToBeCalled(req, res, next);

                        // Commiting transaction
                        await queryRunner.commitTransaction();

                        const response: JsonApiResponse<RT | RT[]> = {
                            links: {
                                self: `${req.protocol}://${req.hostname}${req.originalUrl}`,
                            },
                            data,
                        };
                        res.status(standardCode).send(response);
                    } catch (e) {
                        // Rolling back changes
                        await queryRunner.rollbackTransaction();
                        next(e);
                    } finally {
                        // Releasing connection.
                        await queryRunner.release();
                    }
                });
                this.logger.debug(
                    `Created route [${httpMethod.toUpperCase()}] ${path}`
                );
            }
        );
    }

    get router(): Router {
        return this._router;
    }
}

export default AbstractRoute;
