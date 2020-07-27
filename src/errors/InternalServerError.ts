class InternalServerError extends Error {
    constructor(readonly message: string) {
        super(message);
    }
}

export default InternalServerError;
