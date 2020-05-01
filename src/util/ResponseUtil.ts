import ErrorResponse from "../type/response/ErrorResponse";
import RequestError from "../errors/ServerError";
import MultipleValidationError from "../errors/MultipleValidationError";

/**
 * Utillity class for creating responses.
 */
class ResponseUtil {
    /**
     * Creates an error response
     * @param error - Error object for creating response.
     */
    static createErrorResponse(
        error: RequestError
    ): ErrorResponse | ErrorResponse[] {
        if (error instanceof MultipleValidationError) {
            return ResponseUtil.createMultipleErrorResponse(error);
        }
        return ResponseUtil.createSingleErrorResponse(error);
    }

    /**
     * Creates a multiple error response
     * @param error - Error object for creating response.
     */
    private static createMultipleErrorResponse(
        error: MultipleValidationError
    ): ErrorResponse[] {
        const { name, statusCode, attributeErrors } = error;
        const errors: ErrorResponse[] = [];
        attributeErrors.forEach((attrError) => {
            const { constraints, property, value } = attrError;
            if (constraints) {
                Object.values(constraints).forEach((reason) => {
                    errors.push({
                        status: statusCode,
                        title: `${name}: ${property} = ${value}`,
                        detail: reason,
                    });
                });
            }
        });
        return errors;
    }

    /**
     * Creates a default error response
     * @param error - Error object for creating response.
     */
    private static createSingleErrorResponse(
        error: RequestError
    ): ErrorResponse {
        const { message, name, statusCode } = error;
        return {
            status: statusCode,
            title: name,
            detail: message,
        };
    }
}

export default ResponseUtil;
