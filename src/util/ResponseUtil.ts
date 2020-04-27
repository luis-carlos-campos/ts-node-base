import ErrorResponse from "../type/ErrorResponse";
import RequestError from "../errors/ServerError";

class ResponseUtil {
    static createErrorResponse({
        message,
        name,
        statusCode,
    }: RequestError): ErrorResponse {
        return {
            status: statusCode,
            detail: message,
            title: name,
        };
    }
}

export default ResponseUtil;
