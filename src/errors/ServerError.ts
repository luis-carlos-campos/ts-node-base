import HttpStatusCode from "../enum/HttpStatusCode";

class ServerError extends Error {
    statusCode: HttpStatusCode;

    constructor(message: string, statusCode: HttpStatusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ServerError;
