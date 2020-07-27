/**
 * Custom Type for JSON Api responses.
 */
type JsonApiResponse<T> = {
    links: {
        self: string;
    };
    data: T;
};

export default JsonApiResponse;
