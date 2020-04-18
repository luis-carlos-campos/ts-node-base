/**
 * Load all routes from current directory into express app.
 */
import { Router } from "express";
import { lstatSync, readdirSync } from "fs";
import Runnable from "../interface/Runnable";

class RoutesInitializer implements Runnable {
    async run(): Promise<Router> {
        const router = Router();
        for (const fileName of readdirSync(__dirname)) {
            const originalFileName = fileName;

            // Removing .ts suffix
            const fileWithoutSufix = fileName.split(".")[0];

            // Ignore RoutesInitializer and AbstractRoute
            if (
                fileWithoutSufix === "RoutesInitializer" ||
                fileWithoutSufix === "AbstractRoute"
            ) {
                continue;
            }

            // Ignore Directories
            if (lstatSync(`${__dirname}/${originalFileName}`).isDirectory()) {
                continue;
            }
            // Mount router
            const routeRouter: Router = new (
                await import(`./${originalFileName}`)
            ).default().router;
            console.log(`Registering /${fileWithoutSufix}`);
            router.use(`/${fileWithoutSufix}`, routeRouter);
        }
        return router;
    }
}

export default RoutesInitializer;
