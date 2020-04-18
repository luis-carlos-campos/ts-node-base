import AbstractController from "../controller/AbstractController";
import AbstractRepository from "../repository/AbstractRepository";
import express, { Router } from "express";
import HttpMethod from "../enum/HttpMethod";
import RouteMethod from "../type/RouteMethod";

class AbstractRoute<
    T,
    R extends AbstractRepository<T>,
    C extends AbstractController<T, R>
> {
    protected controller: C;
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
            path: "/:id",
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
                try {
                    const ccc: any = this.controller;
                    await ccc[methodName](req, res, next);
                } catch (e) {
                    console.log(e);
                }
                res.send("Ok!");
                next();
            });
        });
    }
}

export default AbstractRoute;
