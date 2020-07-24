import { EntityManager } from "typeorm";

/**
 * This Controller is meant to be extended by all other controller.
 * It'll provide the transactional entity manager
 */
abstract class AbstractController {
    /**
     * TypeORM transactional entity manager
     */
    private _entityManager!: EntityManager;

    get entityManager(): EntityManager {
        return this._entityManager;
    }

    set entityManager(entityManager: EntityManager) {
        this._entityManager = entityManager;
    }
}

export default AbstractController;
