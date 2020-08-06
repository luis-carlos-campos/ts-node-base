import ConfigUtil from '@util/ConfigUtil';
import { ConnectionOptions } from 'typeorm';
const {
    database,
    host,
    password,
    port,
    username,
} = ConfigUtil.getDataBaseConfigs();
import path from 'path';

/**
 * TypeORM Configuration.
 */
const TypeORMConfig: ConnectionOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || host,
    port: Number(process.env.DB_PORT) || port,
    username: process.env.DB_USERNAME || username,
    password: process.env.DB_PASSWORD || password,
    database: process.env.DB_NAME || database,
    synchronize: false,
    logging: false,
    entities: [path.resolve(__dirname, '../entity/*.*')],
    migrations: [path.resolve(__dirname, '../migration/*.*')],
    cli: {
        migrationsDir: path.resolve(__dirname, '../migration'),
    },
};

export = TypeORMConfig;
