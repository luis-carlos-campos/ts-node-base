import HttpMethod from "../enum/HttpMethod";

type RouteMethod = {
    httpMethod: HttpMethod;
    methodName: string;
    path: string;
};

export default RouteMethod;
