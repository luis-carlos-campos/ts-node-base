import LoggerConfigFileOptions from "../type/config/LoggerConfigFileOptions";
import LoggerConfig from "../config/LoggerConfig";
import EnvVariablesUtil from "./EnvVariablesUtil";
import DBConfigFileOptions from "../type/config/DBConfigFileOptions";
import DBConfig from "../config/DBConfig";

/**
 * Utillity for getting server config files
 */
class ServerConfigUtil {
    static getLogConfigs(): LoggerConfigFileOptions {
        return LoggerConfig[EnvVariablesUtil.getNodeEnv()];
    }

    static getDataBaseConfigs(): DBConfigFileOptions {
        return DBConfig[EnvVariablesUtil.getNodeEnv()];
    }
}

export default ServerConfigUtil;
