/**
 * Type definition for each entry of LoggerConfigFile.
 */
type LoggerConfig = {
    dateFormat: string;
    level: string;
    logsFileName: string;
    requestsFileName: string;
    timestampFormat: string;
};

export default LoggerConfig;
