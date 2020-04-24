/**
 * Environment variables utillity static class
 */
class EnvVariablesUtil {
    /**
     * Gets current node environment
     * @returns "production" | "development" | "test"
     */
    static getNodeEnv(): "production" | "development" | "test" {
        const nodeEnv = process.env.NODE_ENV;
        if (
            nodeEnv !== "production" &&
            nodeEnv !== "development" &&
            nodeEnv !== "test"
        ) {
            // Whenever current NODE_ENV has an invalid value we default to "development"
            return "development";
        }
        return nodeEnv;
    }
}
export default EnvVariablesUtil;
