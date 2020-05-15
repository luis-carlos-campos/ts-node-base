module.exports = {
    type: "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "user",
    password: process.env.DB_PASSWORD || "user",
    database: process.env.DB_NAME || "db",
    synchronize: false,
    logging: false,
    entities: ["./src/entity/*.ts"],
    migrations: ["./src/migration/*.ts"],
    cli: {
        migrationsDir: "./src/migration",
    },
};
