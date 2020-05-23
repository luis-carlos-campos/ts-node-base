import DBConfigFile from "../type/config/DBConfigFile";

/**
 * Database options according to each environment.
 */
const DBConfig: DBConfigFile = {
    development: {
        host: "127.0.0.1",
        port: 3306,
        username: "user",
        password: "user",
        database: "db",
    },
    test: {
        host: "127.0.0.1",
        port: 9306,
        username: "tester",
        password: "tester",
        database: "test-db",
    },
    production: {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || "user",
        password: process.env.DB_PASSWORD || "user",
        database: "db",
    },
};

export default DBConfig;
