import LoggerConfig from "./LoggerConfigFileOptions";

/**
 * Type definition for LoggerConfigFile
 */
type LoggerConfigFile = {
    development: LoggerConfig;
    test: LoggerConfig;
    production: LoggerConfig;
};

export default LoggerConfigFile;
