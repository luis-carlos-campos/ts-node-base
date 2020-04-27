import RequestError from "./ServerError";
import HttpStatusCode from "../enum/HttpStatusCode";

class EntityNotFoundError extends RequestError {
    constructor(entityId: string) {
        super(
            `Could not find item with id: ${entityId}`,
            HttpStatusCode.NOT_FOUND
        );
        this.name = "Entity Not Found";
    }
}

export default EntityNotFoundError;
