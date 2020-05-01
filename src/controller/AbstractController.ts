import { Request, Response, NextFunction } from "express";
import { Repository, EntityManager } from "typeorm";
import EntityNotFoundError from "../errors/EntityNotFoundError";
import { validate } from "class-validator";
import MultipleValidationError from "../errors/MultipleValidationError";

// sucrase ???
abstract class AbstractController<T, RT> {
    // Properties that must be overwritten by Sub class.
    protected abstract allowedFieldsOnCreation: [string, ...string[]];
    protected abstract allowedFieldsOnUpdate: [string, ...string[]];
    protected abstract entity: new (entityData: unknown) => T;
    protected abstract requiredFieldsOnCreation: [string, ...string[]];
    protected abstract requiredFieldsOnUpdate: [string, ...string[]];

    /**
     * Create a <T> element.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @param manager: TypeORM transactional entity manager
     * @returns Created <T> element.
     */
    async create(
        req: Request,
        _res: Response,
        _next: NextFunction,
        manager: EntityManager
    ): Promise<RT> {
        this._validateCreation(req);
        // TODO: Create loggers
        let newEntity = new this.entity(req.body);
        const errors = await validate(newEntity);
        if (errors.length) {
            throw new MultipleValidationError(errors);
        }
        const repository: Repository<T> = manager.getRepository(this.entity);
        newEntity = await repository.save(newEntity);
        return this.responseParser(newEntity);
    }

    /**
     * Finds all T elements.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @param manager: TypeORM transactional entity manager
     * @returns List of <T> elements.
     */
    async findAll(
        _req: Request,
        _res: Response,
        _next: NextFunction,
        manager: EntityManager
    ): Promise<RT[]> {
        const repository: Repository<T> = manager.getRepository(this.entity);
        const entities = await repository.find();
        return entities.map((entity) => this.responseParser(entity));
    }

    /**
     * Finds a <T> element by its primary key.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @param manager: TypeORM transactional entity manager
     * @returns <T> element.
     */
    async _findByPk(
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
     * Finds a <T> element by its primary key.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @param manager: TypeORM transactional entity manager
     * @returns <RT> Response Type.
     */
    async findByPk(
        req: Request,
        res: Response,
        next: NextFunction,
        manager: EntityManager
    ): Promise<RT> {
        const entityFound = await this._findByPk(req, res, next, manager);
        return this.responseParser(entityFound);
    }

    /**
     * Saves a <T> element.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @param manager: TypeORM transactional entity manager
     * @returns <RT> Response Type.
     */
    async save(
        req: Request,
        res: Response,
        next: NextFunction,
        manager: EntityManager
    ): Promise<RT> {
        this._validateUpdate(req);
        // TODO: ADD loggers

        let entityFound = await this._findByPk(req, res, next, manager);
        const errors = await validate(
            new this.entity({ ...entityFound, ...req.body })
        );
        if (errors.length) {
            throw new MultipleValidationError(errors);
        }
        const repository: Repository<T> = manager.getRepository(this.entity);
        entityFound = await repository.save({ ...entityFound, ...req.body });
        return this.responseParser(entityFound);
    }

    /**
     * Removes a <T> element.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @param manager: TypeORM transactional entity manager
     * @returns <RT> Response Type.
     */
    async remove(
        req: Request,
        res: Response,
        next: NextFunction,
        manager: EntityManager
    ): Promise<RT> {
        const entityFound = await this._findByPk(req, res, next, manager);
        const repository: Repository<T> = manager.getRepository(this.entity);
        return this.responseParser(await repository.remove(entityFound));
    }

    protected abstract responseParser(entity: T): RT;

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
