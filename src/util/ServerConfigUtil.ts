import LoggerConfigFileOptions from "../type/config/LoggerConfigFileOptions";
import LoggerConfigFile from "../config/LoggerConfigFile";
import DataBaseConfigFileOptions from "../type/config/DataBaseConfigFileOptions";
import DataBaseConfigFile from "../config/DataBaseConfigFile";
import EnvVariablesUtil from "./EnvVariablesUtil";

/**
 * Utillity for getting server config files
 */
class ServerConfigUtil {
    static getLogConfigs(): LoggerConfigFileOptions {
        return LoggerConfigFile[EnvVariablesUtil.getNodeEnv()];
    }

    static getDataBaseConfigs(): DataBaseConfigFileOptions {
        return DataBaseConfigFile[EnvVariablesUtil.getNodeEnv()];
    }
}

export default ServerConfigUtil;
