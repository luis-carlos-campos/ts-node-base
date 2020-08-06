import { Application } from 'express';

/**
 * This interfaces describes something that can run on server initialization.
 */
interface StartUpRunnable {
    beforeRun?: void;
    run(server: Application): Promise<Application> | Application;
    afterRun?: void;
}

export default StartUpRunnable;
