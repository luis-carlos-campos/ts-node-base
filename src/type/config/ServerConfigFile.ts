import ServerConfigFileOptions from "./ServerConfigFileOptions";

/**
 * Type definition for ServerConfigFile
 */
type ServerConfigFile = {
    development: ServerConfigFileOptions;
    test: ServerConfigFileOptions;
    production: ServerConfigFileOptions;
};

export default ServerConfigFile;
