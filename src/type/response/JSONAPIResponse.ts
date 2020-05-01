/**
 * Custom Type for HTTP Error responses.
 */
type JSONAPIResponse = {
    data: {
        type: string;
        id: string;
    };
};

export default JSONAPIResponse;
