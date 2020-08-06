require('module-alias/register');
import { Server } from 'http';
import ServerInitializer from '@initializer/ServerInitializer';
import ConfigUtil from '@util/ConfigUtil';
import LoggerUtil from '@util/LoggerUtil';
import TypeORMUtil from '@util/TypeORMUtil';

const logger = LoggerUtil.getLogger('Index');

/**
 * Configures a gracefull shutdown whenever server crashes.
 * @param server - The server that could crash.
 */
const _configureGracefulShutdown = (server: Server) => {
    const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignals.forEach((signal) => {
        process.on(signal, () => {
            logger.info(
                `Event ${signal} was emitted forcing the server to shut down...`
            );
            // Trying to close server
            server.close((serverError) => {
                // Closing DB connection
                void TypeORMUtil.closeConnection().then(() => {
                    if (serverError) {
                        logger.error(
                            'Un unexpected error ocurred while trying to shut down...\n'
                        );
                        logger.error(serverError);
                        process.exit(1);
                    } else {
                        logger.info('Server was shut down.');
                        process.exit(0);
                    }
                });
            });
        });
    });
};

void (async (): Promise<void> => {
    try {
        logger.info('Starting server...');
        const { port } = ConfigUtil.getServerConfigs();
        const app = await ServerInitializer.getServer();
        const server = app.listen(port);
        _configureGracefulShutdown(server);
        logger.info(`Server is ready and listening on port ${port}.`);
    } catch (error) {
        logger.error(
            'Un unexpected error prevented the server from starting up.'
        );
        if (error instanceof Error) {
            logger.error(error.stack);
        }
        await TypeORMUtil.closeConnection();
        logger.info('Server was shut down.');
        process.exit(1);
    }
})();
