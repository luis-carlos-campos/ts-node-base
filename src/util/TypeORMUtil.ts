import { createConnection, getConnection, Connection } from 'typeorm';
import LoggerUtil from '@util/LoggerUtil';
import TypeORMConfig from '@config/TypeORMConfig';

/**
 * Utillity class for TypeORM
 */
class TypeORMUtil {
    private static logger = LoggerUtil.getLogger('TypeORMUtil');

    /**
     * Creates a new TypeORM connection.
     * @returns TypeORM.Connection - Connection created
     */
    static async createConnection(): Promise<Connection> {
        this.logger.debug('Trying to create a new TypeORM connection.');
        const connection = await createConnection(TypeORMConfig);
        this.logger.debug('TypeORM connection was succescully created.');
        return connection;
    }

    /**
     * Closes current TypeORM connection.
     */
    static async closeConnection(): Promise<void> {
        // Closing Database connection.
        try {
            await getConnection().close();
            this.logger.info('TypeORM connection was closed.');
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(error.stack);
            }
            this.logger.warn(
                'It was not possible to close TypeORM connection.'
            );
        }
    }
}

export default TypeORMUtil;
