import LoggerConfigFileOptions from "./LoggerConfigFileOptions";

/**
 * Type definition for LoggerConfigFile
 */
type LoggerConfigFile = {
    development: LoggerConfigFileOptions;
    test: LoggerConfigFileOptions;
    production: LoggerConfigFileOptions;
};

export default LoggerConfigFile;
