/**
 * Load TypeORM connection pool.
 */
import { Application } from 'express';
import Runnable from '@interface/StartUpRunnable';
import LoggerUtil from '@util/LoggerUtil';
import TypeORMUtil from '@util/TypeORMUtil';

class RoutesInitializer implements Runnable {
    async run(server: Application): Promise<Application> {
        const logger = LoggerUtil.getLogger('DatabaseInitializer');
        logger.debug('Initializing TypeORM...');
        await TypeORMUtil.createConnection();
        logger.debug('TypeORM initialization was completed.');
        return server;
    }
}

export default RoutesInitializer;
