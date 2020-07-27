/**
 * Custom Type for JSON Api responses.
 */
type JsonApiResponse<T> = {
    links: {
        self: string;
    };
    data: T[];
    meta: {
        total_count?: number;
    };
};

export default JsonApiResponse;
