import { ConsoleTransportInstance } from "winston/lib/winston/transports";
import { Format } from "logform";
import ConfigService from "./ConfigUtil";
import Winston from "winston";
import WinstonDailyRotateFile from "Winston-daily-rotate-file";
import EnvVariablesUtil from "./EnvVariablesUtil";
import InternalServerError from "../errors/InternalServerError";

/**
 * Winston utillity class
 */
class WinstonUtil {
    /**
     * Creates a console transport for logs.
     * @param module  - The name of the module in which log was generated.
     * @returns ConsoleTransportInstance instance.
     */
    static getConsoleTransport(module: string): ConsoleTransportInstance {
        return new Winston.transports.Console({
            format: WinstonUtil.getColoredLogFormat(module),
            silent: EnvVariablesUtil.isTestEnv(),
        });
    }

    /**
     * Creates a file transport for morgan logs.
     * @param module - The name of the module in which log was generated.
     * @returns WinstonDailyRotateFile instance.
     */
    static getMorganFileTransport(module: string): WinstonDailyRotateFile {
        const { requestsFileName } = ConfigService.getLogConfigs();
        return WinstonUtil.getDefaultFileTransport(module, requestsFileName);
    }

    /**
     * Creates a default file transport in which all logs should be stored.
     * @param module - The name of the module in which log was generated.
     * @returns WinstonDailyRotateFile instance.
     */
    static getFileTransport(module: string): WinstonDailyRotateFile {
        const { logsFileName } = ConfigService.getLogConfigs();
        return WinstonUtil.getDefaultFileTransport(module, logsFileName);
    }

    /**
     * Creates a colored formatter for logs.
     * @param module - The name of the module in which log was generated.
     * @returns Format instance.
     */
    private static getColoredLogFormat(module: string): Format {
        return Winston.format.combine(
            Winston.format.colorize(),
            WinstonUtil.getUnColoredLogFormat(module)
        );
    }

    /**
     * Creates an uncolored formatter for logs.
     * @param module - The name of the module in which log was generated.
     * @returns Format instance.
     */
    private static getUnColoredLogFormat(module: string): Format {
        const { timestampFormat } = ConfigService.getLogConfigs();
        return Winston.format.combine(
            Winston.format.label({ label: module }),
            Winston.format.timestamp({
                format: timestampFormat,
            }),
            Winston.format.printf((info) => {
                const { message, level, timestamp } = info;
                if (timestamp && typeof timestamp === "string") {
                    return `${timestamp} ${process.pid} [${module}] \t${level}: ${message}`;
                }
                throw new InternalServerError(
                    "Winston did not set up timestamp."
                );
            })
        );
    }

    /**
     * Creates a default winston transport for files.
     * @param module -
     * @param module - The name of the module in which log was generated.
     * @returns WinstonDailyRotateFile instance.
     */
    private static getDefaultFileTransport(
        module: string,
        filename: string
    ): WinstonDailyRotateFile {
        const { dateFormat } = ConfigService.getLogConfigs();
        return new WinstonDailyRotateFile({
            filename,
            datePattern: dateFormat,
            format: WinstonUtil.getUnColoredLogFormat(module),
            silent: EnvVariablesUtil.isTestEnv(),
        });
    }
}

export default WinstonUtil;
