import HttpStatusCode from "../enum/HttpStatusCode";

class ServerError extends Error {
    constructor(readonly message: string, readonly statusCode: HttpStatusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ServerError;
