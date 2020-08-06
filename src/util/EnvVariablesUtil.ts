/**
 * Environment variables utillity static class
 */
class EnvVariablesUtil {
    /**
     * Gets current node environment
     * @returns "production" | "development" | "test"
     */
    static getNodeEnv(): 'production' | 'development' | 'test' {
        const nodeEnv = process.env.NODE_ENV;
        if (
            nodeEnv !== 'production' &&
            nodeEnv !== 'development' &&
            nodeEnv !== 'test'
        ) {
            // Whenever current NODE_ENV has an invalid value we default to "development"
            return 'development';
        }
        return nodeEnv;
    }

    /**
     * Returns true is current environment is development.
     */
    static isDevelopmentEnv(): boolean {
        return EnvVariablesUtil.getNodeEnv() === 'development';
    }

    /**
     * Returns true is current environment is production.
     */
    static isProductionEnv(): boolean {
        return EnvVariablesUtil.getNodeEnv() === 'production';
    }

    /**
     * Returns true is current environment is test.
     */
    static isTestEnv(): boolean {
        return EnvVariablesUtil.getNodeEnv() === 'test';
    }
}
export default EnvVariablesUtil;
