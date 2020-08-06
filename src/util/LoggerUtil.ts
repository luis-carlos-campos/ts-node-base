import Winston, { Logger } from "winston";
import WinstonUtils from "@util/WinstonUtil";
import ConfigService from "@util/ConfigUtil";

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
        const { level } = ConfigService.getLogConfigs();
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
