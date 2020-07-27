import JsonApiSingleErrorResponse from "./JsonApiSingleErrorResponse";
import JsonApiMultipleErrorsResponse from "./JsonApiMultipleErrorsResponse";
/**
 * Custom Type for HTTP Error responses.
 */
type JsonApiErrorResponse =
    | JsonApiSingleErrorResponse
    | JsonApiMultipleErrorsResponse;

export default JsonApiErrorResponse;
