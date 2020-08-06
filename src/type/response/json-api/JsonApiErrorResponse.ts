import JsonApiSingleErrorResponse from '@type/response/json-api/JsonApiSingleErrorResponse';
import JsonApiMultipleErrorsResponse from '@type/response/json-api/JsonApiMultipleErrorsResponse';
/**
 * Custom Type for HTTP Error responses@type/response/json-api
 */
type JsonApiErrorResponse =
    | JsonApiSingleErrorResponse
    | JsonApiMultipleErrorsResponse;

export default JsonApiErrorResponse;
