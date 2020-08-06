import RequestError from "@error/ServerError";
import HttpStatusCode from "@enum/HttpStatusCode";

class MandatoryAttributeError extends RequestError {
    constructor(readonly fieldName: string) {
        super(
            `Attribute '${fieldName}' is mandatory.`,
            HttpStatusCode.BAD_REQUEST
        );
        this.name = "Mandatory attribute";
    }
}

export default MandatoryAttributeError;
