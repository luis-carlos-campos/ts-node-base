import AbstractCrudController from "../controller/AbstractCrudController";
import HttpMethod from "../enum/HttpMethod";
import { Logger } from "winston";
import LoggerUtil from "../util/LoggerUtil";
import HttpStatusCode from "../enum/HttpStatusCode";
import AbstractRoute from "./AbstractRoute";

/**
 * This Route is meant to be extended whenever you want to create and endpoint with all basic CRUD operations.
 */
abstract class AbstractCrudRoute<
    T,
    RT,
    C extends AbstractCrudController<T, RT>
> extends AbstractRoute<C, RT> {
    protected allowedRouteMethods = [
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
    protected logger: Logger = LoggerUtil.getLogger("AbstractCrudRoute");
}

export default AbstractCrudRoute;
