import AbstractController from "../controller/AbstractController";
import express, { Router } from "express";
import HttpMethod from "../enum/HttpMethod";
import RouteMethod from "../type/RouteMethod";
import { Logger } from "winston";
import LoggerService from "../util/LoggerUtil";
import { getConnection } from "typeorm";
import NotImplementedError from "../errors/NotImplementedError";

abstract class AbstractRoute<T, C extends AbstractController<T>> {
    private allowedRouteMethods: RouteMethod[] = [
        {
            httpMethod: HttpMethod.GET,
            methodName: "findAll",
            path: "/",
        },
        {
            httpMethod: HttpMethod.GET,
            methodName: "findByPk",
            path: "/:id",
        },
        {
            httpMethod: HttpMethod.PATCH,
            methodName: "save",
            path: "/:id",
        },
        {
            httpMethod: HttpMethod.POST,
            methodName: "create",
            path: "/",
        },
        {
            httpMethod: HttpMethod.DELETE,
            methodName: "remove",
            path: "/:id",
        },
    ];
    protected controller: C;
    protected logger: Logger = LoggerService.getLogger("AbstractRoute");
    protected router: Router;

    constructor(controller: new () => C, allowedRouteMethods?: RouteMethod[]) {
        if (allowedRouteMethods) {
            this.allowedRouteMethods = allowedRouteMethods;
        }
        this.controller = new controller();
        this.router = express.Router({ mergeParams: true });
        this.configureRouter();
    }

    configureRouter(): void {
        this.allowedRouteMethods.forEach(({ httpMethod, methodName, path }) => {
            this.router[httpMethod](path, async (req, res, next) => {
                // TODO: Handle response
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
                    const methodToBeCalled: unknown = controller[methodName];
                    if (
                        !methodToBeCalled ||
                        typeof methodToBeCalled !== "function"
                    ) {
                        throw new NotImplementedError(
                            `Method ${methodName} was not implemented in controller class`
                        );
                    }
                    await methodToBeCalled(req, res, next, queryRunner.manager);

                    // Commiting transaction
                    await queryRunner.commitTransaction();
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
        });
    }
}

export default AbstractRoute;
