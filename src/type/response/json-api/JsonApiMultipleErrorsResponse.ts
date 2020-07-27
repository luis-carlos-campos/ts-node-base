import JsonApiSingleErrorResponse from "./JsonApiSingleErrorResponse";
/**
 * Custom Type for HTTP Error responses.
 */
type JsonApiMultipleErrorsResponse = JsonApiSingleErrorResponse[];

export default JsonApiMultipleErrorsResponse;
