import LoggerConfigFileOptions from "@type/config/LoggerConfigFileOptions";

/**
 * Type definition for LoggerConfigFile
 */
type LoggerConfigFile = {
    development: LoggerConfigFileOptions;
    test: LoggerConfigFileOptions;
    production: LoggerConfigFileOptions;
};

export default LoggerConfigFile;
