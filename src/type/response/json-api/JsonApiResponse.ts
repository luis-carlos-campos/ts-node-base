import JsonApiMultipleResoucesResponse from "./JsonApiMultipleResoucesResponse";
import JsonApiSingleResouceResponse from "./JsonApiSingleResouceResponse";
/**
 * Custom Type for JSON Api responses.
 */
type JsonApiResponse<T> =
    | JsonApiMultipleResoucesResponse<T>
    | JsonApiSingleResouceResponse<T>;

export default JsonApiResponse;
