import LoggerConfigFileOptions from "../type/config/LoggerConfigFileOptions";
import LoggerConfigFile from "../config/LoggerConfigFile";
import EnvVariablesUtil from "./EnvVariablesUtil";

/**
 * Utillity for getting server config files
 */
class ServerConfigUtil {
    static getLogConfigs(): LoggerConfigFileOptions {
        return LoggerConfigFile[EnvVariablesUtil.getNodeEnv()];
    }
}

export default ServerConfigUtil;
