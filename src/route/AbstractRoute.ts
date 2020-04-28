import AbstractController from "../controller/AbstractController";
import express, { Router } from "express";
import HttpMethod from "../enum/HttpMethod";
import RouteMethod from "../type/RouteMethod";
import { Logger } from "winston";
import LoggerService from "../util/LoggerUtil";

abstract class AbstractRoute<T, C extends AbstractController<T>> {
    protected controller: C;
    protected logger: Logger = LoggerService.getLogger("AbstractRoute");
    protected router: Router;
    protected allowedMethods: RouteMethod[] = [
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

    constructor(controller: new () => C) {
        this.controller = new controller();
        this.router = express.Router({ mergeParams: true });
        this.configureRouter();
    }

    configureRouter(): void {
        this.allowedMethods.forEach(({ httpMethod, methodName, path }) => {
            this.router[httpMethod](path, async (req, res, next) => {
                // TODO: Handle response
                try {
                    // TODO: Remove this any
                    const ccc: any = this.controller;
                    // TODO: make sure it's a function, otherwise throw error.
                    await ccc[methodName](req, res, next);
                    next();
                } catch (e) {
                    next(e);
                }
            });
            this.logger.debug(
                `Created route [${httpMethod.toUpperCase()}] ${path}`
            );
        });
    }
}

export default AbstractRoute;
