import RequestError from "./ServerError";
import HttpStatusCode from "../enum/HttpStatusCode";

class UnknownAttributeError extends RequestError {
    constructor(fieldName: string) {
        super(
            `Attribute '${fieldName}' is not a valid field name.`,
            HttpStatusCode.BAD_REQUEST
        );
        this.name = "Unknown attribute";
    }
}

export default UnknownAttributeError;
