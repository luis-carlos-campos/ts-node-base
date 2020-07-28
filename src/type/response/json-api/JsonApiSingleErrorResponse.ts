/**
 * Custom Type for HTTP Error responses.
 */
type JsonApiSingleErrorResponse = {
    status: number;
    title: string;
    detail: string;
};

export default JsonApiSingleErrorResponse;
