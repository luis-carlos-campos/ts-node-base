import JsonApiSingleErrorResponse from '@type/response/json-api/JsonApiSingleErrorResponse';
/**
 * Custom Type for HTTP Error responses.
 */
type JsonApiMultipleErrorsResponse = JsonApiSingleErrorResponse[];

export default JsonApiMultipleErrorsResponse;
