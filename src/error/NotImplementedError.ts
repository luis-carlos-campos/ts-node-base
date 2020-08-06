import ServerError from "@error/ServerError";
import HttpStatusCode from "@enum/HttpStatusCode";

class NotImplementedError extends ServerError {
    constructor(readonly message: string) {
        super(message, HttpStatusCode.NOT_IMPLEMENTED);
        this.name = "Not Implemented";
    }
}

export default NotImplementedError;
