import JsonApiErrorResponse from "@type/response/json-api/JsonApiErrorResponse";
import RequestError from "@error/ServerError";
import MultipleValidationError from "@error/MultipleValidationError";

/**
 * Utillity class for creating responses.
 */
class ResponseUtil {
    /**
     * Creates an error response
     * @param error - Error object for creating response.
     */
    static createErrorResponse(error: RequestError): JsonApiErrorResponse {
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
    ): JsonApiErrorResponse {
        const { name, statusCode, attributeErrors } = error;
        const errors: JsonApiErrorResponse = [];
        attributeErrors.forEach((attrError) => {
            const { constraints, property } = attrError;
            if (constraints) {
                const value = attrError.value as unknown;
                Object.values(constraints).forEach((reason) => {
                    errors.push({
                        status: statusCode,
                        title: `${name}: ${property} = ${String(value)}`,
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
    ): JsonApiErrorResponse {
        const { message, name, statusCode } = error;
        return {
            status: statusCode,
            title: name,
            detail: message,
        };
    }
}

export default ResponseUtil;
