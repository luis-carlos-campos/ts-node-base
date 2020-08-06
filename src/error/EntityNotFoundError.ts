import RequestError from "@error/ServerError";
import HttpStatusCode from "@enum/HttpStatusCode";

class EntityNotFoundError extends RequestError {
    constructor(readonly entityId: string) {
        super(
            `Could not find item with id: ${entityId}`,
            HttpStatusCode.NOT_FOUND
        );
        this.name = "Entity Not Found";
    }
}

export default EntityNotFoundError;
