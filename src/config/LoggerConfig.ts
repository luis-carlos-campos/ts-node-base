import LoggerConfigFile from '@type/config/LoggerConfigFile';
/**
 * Logger options according to each environment.
 */
const LoggerConfig: LoggerConfigFile = {
    development: {
        dateFormat: 'YYYY-MM-DD',
        level: 'debug',
        logsFileName: 'logs/%DATE%.log',
        requestsFileName: 'logs/%DATE%-request.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    test: {
        dateFormat: 'YYYY-MM-DD',
        level: 'debug',
        logsFileName: 'logs/%DATE%.log',
        requestsFileName: 'logs/%DATE%-request.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    production: {
        dateFormat: 'YYYY-MM-DD',
        level: 'debug',
        logsFileName: 'logs/%DATE%.log',
        requestsFileName: 'logs/%DATE%-request.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    },
};

export default LoggerConfig;
