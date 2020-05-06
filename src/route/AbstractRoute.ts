import AbstractController from "../controller/AbstractController";
import express, { Router } from "express";
import HttpMethod from "../enum/HttpMethod";
import RouteMethod from "../type/RouteMethod";
import { Logger } from "winston";
import LoggerService from "../util/LoggerUtil";
import { getConnection } from "typeorm";
import NotImplementedError from "../errors/NotImplementedError";
import HttpStatusCode from "../enum/HttpStatusCode";

abstract class AbstractRoute<T, RT, C extends AbstractController<T, RT>> {
    protected allowedRouteMethods: RouteMethod[] = [
        {
            httpMethod: HttpMethod.GET,
            methodName: "findAll",
            path: "/",
            standardCode: HttpStatusCode.SUCCESS,
        },
        {
            httpMethod: HttpMethod.GET,
            methodName: "findByPk",
            path: "/:id",
            standardCode: HttpStatusCode.SUCCESS,
        },
        {
            httpMethod: HttpMethod.PATCH,
            methodName: "save",
            path: "/:id",
            standardCode: HttpStatusCode.SUCCESS,
        },
        {
            httpMethod: HttpMethod.POST,
            methodName: "create",
            path: "/",
            standardCode: HttpStatusCode.CREATED,
        },
        {
            httpMethod: HttpMethod.DELETE,
            methodName: "remove",
            path: "/:id",
            standardCode: HttpStatusCode.SUCCESS,
        },
    ];
    protected controller: C;
    protected logger: Logger = LoggerService.getLogger("AbstractRoute");
    protected _router: Router;

    constructor(readonly controllerT: new () => C) {
        this.controller = new controllerT();
        this._router = express.Router({ mergeParams: true });
        // TODO: How to improve this?? Call it later?? Should property overwrite would work?...
        this._configureRouter();
    }

    /**
     * Configures router according to allowedRouteMethods.
     */
    _configureRouter(): void {
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
                        const response = await controller[methodName](
                            req,
                            res,
                            next,
                            queryRunner.manager
                        );

                        // Commiting transaction
                        await queryRunner.commitTransaction();

                        res.status(standardCode).send({
                            links: {
                                self:
                                    req.protocol +
                                    "://" +
                                    req.hostname +
                                    req.originalUrl,
                            },
                            data: response,
                        });
                        next();
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
