import JsonApiMultipleResoucesResponse from '@type/response/json-api/JsonApiMultipleResoucesResponse';
import JsonApiSingleResouceResponse from '@type/response/json-api/JsonApiSingleResouceResponse';
/**
 * Custom Type for JSON Api responses.
 */
type JsonApiResponse<T> =
    | JsonApiMultipleResoucesResponse<T>
    | JsonApiSingleResouceResponse<T>;

export default JsonApiResponse;
