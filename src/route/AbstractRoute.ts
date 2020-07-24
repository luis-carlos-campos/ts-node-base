import express, { Router } from "express";
import RouteMethod from "../type/RouteMethod";
import { Logger } from "winston";
import LoggerService from "../util/LoggerUtil";
import { getConnection } from "typeorm";
import NotImplementedError from "../errors/NotImplementedError";
import AbstractController from "../controller/AbstractController";

/**
 * This Route is meant to be extended by all other routes.
 * It'll provide error handling and transactional entity manager
 */
abstract class AbstractRoute<C extends AbstractController> {
    protected abstract allowedRouteMethods: RouteMethod[];
    protected controller: C;
    protected logger: Logger = LoggerService.getLogger("AbstractRoute");
    protected _router: Router;

    constructor(readonly controllerT: new () => C) {
        this.controller = new controllerT();
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
                        // We can not tell which methods this controller so
                        // eslint-disable-next-line
                        const controller: any = this.controller;
                        const methodToBeCalled: unknown =
                            controller[methodName];
                        if (
                            !methodToBeCalled ||
                            typeof methodToBeCalled !== "function"
                        ) {
                            throw new NotImplementedError(
                                `Method ${methodName} was not implemented in controller class`
                            );
                        }
                        this.controller.entityManager = queryRunner.manager;
                        const response = await controller[methodName](
                            req,
                            res,
                            next
                        );

                        // Commiting transaction
                        await queryRunner.commitTransaction();

                        res.status(standardCode).send({
                            links: {
                                self: `${req.protocol}://${req.hostname}${req.originalUrl}`,
                            },
                            data: response,
                        });
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
