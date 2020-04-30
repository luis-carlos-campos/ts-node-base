import { Request, Response, NextFunction } from "express";
import { Repository, EntityManager } from "typeorm";
import EntityNotFoundError from "../errors/EntityNotFoundError";

// sucrase ???
abstract class AbstractController<T> {
    // Properties that must be overwritten by Sub class.
    protected abstract allowedFieldsOnCreation: [string, ...string[]];
    protected abstract allowedFieldsOnUpdate: [string, ...string[]];
    protected abstract entity: new (entityData: unknown) => T;
    protected abstract requiredFieldsOnCreation: [string, ...string[]];
    protected abstract requiredFieldsOnUpdate: [string, ...string[]];

    /**
     * Create a <T> element.
     * @param req: express.Request.
     * @returns Created <T> element.
     */
    async create(
        req: Request,
        _res: Response,
        _next: NextFunction,
        manager: EntityManager
    ): Promise<T> {
        this._validateCreation(req);
        // TODO: Handle valdiation
        // TODO: Create loggers
        const repository: Repository<T> = manager.getRepository(this.entity);
        return await repository.save(new this.entity(req.body));
    }

    /**
     * Finds all T elements.
     * @returns List of <T> elements.
     */
    async findAll(
        _req: Request,
        _res: Response,
        _next: NextFunction,
        manager: EntityManager
    ): Promise<T[]> {
        const repository: Repository<T> = manager.getRepository(this.entity);
        return await repository.find();
    }

    /**
     * Fins a <T> element by its primary key.
     * @param req: express.Request
     * @returns <T> element.
     */
    async findByPk(
        req: Request,
        _res: Response,
        _next: NextFunction,
        manager: EntityManager
    ): Promise<T> {
        const id = req.params.id;
        const repository: Repository<T> = manager.getRepository(this.entity);
        const entityFound: T | undefined = await repository.findOne(id);
        if (entityFound) {
            return entityFound;
        }
        throw new EntityNotFoundError(id);
    }

    /**
     * Saves a <T> element.
     * @param req: express.Request.
     * @returns Updated <T> element.
     */
    async save(
        req: Request,
        res: Response,
        next: NextFunction,
        manager: EntityManager
    ): Promise<T> {
        this._validateUpdate(req);
        const entity = await this.findByPk(req, res, next, manager);
        // TODO: Handle valdiation
        const repository: Repository<T> = manager.getRepository(this.entity);
        return await repository.save({ ...entity, ...req.body });
    }

    /**
     * Removes a <T> element.
     * @param req: express.Request.
     * @returns Removed <T> element.
     */
    async remove(
        req: Request,
        res: Response,
        next: NextFunction,
        manager: EntityManager
    ): Promise<T> {
        const entity = await this.findByPk(req, res, next, manager);
        const repository: Repository<T> = manager.getRepository(this.entity);
        return await repository.remove(entity);
    }

    /**
     * Validation to be run before creation.
     * @param req: express.Request.
     */
    private _validateCreation(req: Request): void {
        this._validateRequest(
            req,
            this.requiredFieldsOnCreation,
            this.allowedFieldsOnCreation
        );
    }

    /**
     * Validation to be run before update.
     * @param req: express.Request.
     */
    private _validateUpdate(req: Request): void {
        this._validateRequest(
            req,
            this.requiredFieldsOnUpdate,
            this.allowedFieldsOnUpdate
        );
    }

    /**
     * Validates incoming request.
     * @param req - express.Request
     * @param requiredFields - Request required field list.
     * @param allowedFields - Request allowed field list.
     */
    private _validateRequest(
        req: Request,
        requiredFields: string[],
        allowedFields: string[]
    ): void {
        const foundMissingRequiredField = requiredFields.find(
            (field) => !req.body[field]
        );
        if (foundMissingRequiredField) {
            throw new Error(
                `Missing required field: ${foundMissingRequiredField}`
            );
        }

        for (const key in req.body) {
            const fieldFound = allowedFields.find((field) => field === key);
            if (fieldFound) {
                continue;
            }
            throw new Error(`Field ${key} is not allowed.`);
        }
    }
}

export default AbstractController;
