import RequestError from "./ServerError";
import HttpStatusCode from "../enum/HttpStatusCode";
import { ValidationError } from "class-validator";

class MultipleValidationError extends RequestError {
    attributeErrors: ValidationError[];

    constructor(errors: ValidationError[]) {
        super("Entity has invalid attributes", HttpStatusCode.BAD_REQUEST);
        this.name = "Invalid Attributes";
        this.attributeErrors = errors;
    }
}

export default MultipleValidationError;
