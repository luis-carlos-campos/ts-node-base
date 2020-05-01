import DataBaseConfigFile from "../type/config/DataBaseConfigFile";
/**
 * Logger options according to each environment.
 */
const configs: DataBaseConfigFile = {
    development: {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || "user",
        password: process.env.DB_PASSWORD || "user",
        database: "db",
    },
    test: {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || "user",
        password: process.env.DB_PASSWORD || "user",
        database: "db",
    },
    production: {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || "user",
        password: process.env.DB_PASSWORD || "user",
        database: "db",
    },
};

export default configs;
