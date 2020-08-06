import RequestError from "@error/ServerError";
import HttpStatusCode from "@enum/HttpStatusCode";
import { ValidationError } from "class-validator";

class MultipleValidationError extends RequestError {
    readonly attributeErrors: ValidationError[];

    constructor(readonly errors: ValidationError[]) {
        super("Entity has invalid attributes", HttpStatusCode.BAD_REQUEST);
        this.name = "Invalid Attributes";
        this.attributeErrors = errors;
    }
}

export default MultipleValidationError;
