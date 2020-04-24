import Winston, { Logger } from "winston";
import WinstonUtils from "./WinstonUtil";
import ServerConfigService from "./ServerConfigUtil";

/**
 * Utillity class for logging
 */
class LoggerUtil {
    /**
     * Gets a logger instance.
     * @param module  - The name of the module in which log was generated.
     * @returns Winston.logger instance
     */
    static getLogger(label: string): Logger {
        const { level } = ServerConfigService.getLogConfigs();
        const transports = [
            WinstonUtils.getConsoleTransport(label),
            WinstonUtils.getFileTransport(label),
        ];

        return Winston.createLogger({
            level,
            transports,
        });
    }
}

export default LoggerUtil;
