import LoggerConfigType from "../type/config/LoggerConfigFileOptions";
import LoggerConfigFile from "../config/LoggerConfigFile";
import EnvVariablesUtil from "./EnvVariablesUtil";

/**
 * Utillity for getting server config files
 */
class ServerConfigUtil {
    static getLogConfigs(): LoggerConfigType {
        return LoggerConfigFile[EnvVariablesUtil.getNodeEnv()];
    }
}

export default ServerConfigUtil;
