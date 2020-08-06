import { EntityManager } from 'typeorm';

/**
 * This Controller is meant to be extended by all other controller.
 * It'll provide the transactional entity manager
 */
abstract class AbstractController {
    /**
     * TypeORM transactional entity manager
     */
    private readonly _entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        this._entityManager = entityManager;
    }

    get entityManager(): EntityManager {
        return this._entityManager;
    }
}

export default AbstractController;
