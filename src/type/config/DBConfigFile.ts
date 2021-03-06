import DBConfigFileOptions from '@type/config/DBConfigFileOptions';

/**
 * Type definition for DBConfigFile
 */
type DBConfigFile = {
    development: DBConfigFileOptions;
    test: DBConfigFileOptions;
    production: DBConfigFileOptions;
};

export default DBConfigFile;
