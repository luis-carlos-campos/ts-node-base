import ServerConfigFileOptions from "@type/config/ServerConfigFileOptions";

/**
 * Type definition for ServerConfigFile
 */
type ServerConfigFile = {
    development: ServerConfigFileOptions;
    test: ServerConfigFileOptions;
    production: ServerConfigFileOptions;
};

export default ServerConfigFile;
