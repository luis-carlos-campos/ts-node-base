/**
 * Load all routes from current directory into express app.
 */
import { Application } from "express";
import Runnable from "@interface/StartUpRunnable";
import Morgan, { StreamOptions } from "morgan";
import Winston from "winston";
import WinstonUtils from "@util/WinstonUtil";
import LoggerUtil from "@util/LoggerUtil";
import EnvVariablesUtil from "@util/EnvVariablesUtil";

class RoutesInitializer implements Runnable {
    run(server: Application): Application {
        const logger = LoggerUtil.getLogger("LogInitializer");
        logger.debug("Initializing Logging support...");

        Winston.loggers.add("consoleMorgan", {
            transports: [WinstonUtils.getConsoleTransport("Server")],
        });
        Winston.loggers.add("fileMorgan", {
            transports: [
                WinstonUtils.getMorganFileTransport("Server"),
                WinstonUtils.getFileTransport("Server"),
            ],
        });

        // Configuring Morgan colored logs in console.
        const consoleStream: StreamOptions = {
            write(message: string): void {
                // Removing break line that morgans add by default.
                Winston.loggers
                    .get("consoleMorgan")
                    .info(message.substring(0, message.length - 1));
            },
        };
        server.use(Morgan("dev", { stream: consoleStream }));

        // Configuring Morgan uncolored logs in files.
        const fileStream: StreamOptions = {
            write(message: string): void {
                // Removing break line that morgans add by default.
                Winston.loggers
                    .get("fileMorgan")
                    .info(message.substring(0, message.length - 1));
            },
        };
        server.use(
            Morgan("tiny", {
                stream: fileStream,
                skip: () => EnvVariablesUtil.isTestEnv(),
            })
        );

        logger.debug("Logging support initialization was completed.");
        return server;
    }
}

export default RoutesInitializer;
