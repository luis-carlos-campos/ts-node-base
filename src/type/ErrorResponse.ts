/**
 * Custom Type for HTTP Error responses.
 */
type ErrorResponse = {
    status: number;
    title: string;
    detail: string;
};

export default ErrorResponse;
