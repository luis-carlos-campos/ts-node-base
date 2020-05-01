import DataBaseConfigFileOptions from "./DataBaseConfigFileOptions";

/**
 * Type definition for DataBaseConfigFile
 */
type DataBaseConfigFile = {
    development: DataBaseConfigFileOptions;
    test: DataBaseConfigFileOptions;
    production: DataBaseConfigFileOptions;
};

export default DataBaseConfigFile;
