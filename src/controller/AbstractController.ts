import { Request, Response, NextFunction } from "express";
import { Repository, EntityManager } from "typeorm";
import EntityNotFoundError from "../errors/EntityNotFoundError";
import { validate } from "class-validator";
import MultipleValidationError from "../errors/MultipleValidationError";

abstract class AbstractController<T, RT> {
    // Properties that must be overwritten by Sub class.
    protected abstract entity: new (entityData?: T) => T;

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
        const newEntity = new this.entity(req.body);
        await this._validate(newEntity);
        const repository: Repository<T> = manager.getRepository(this.entity);
        return this.responseParser(await repository.save(newEntity));
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
        req: Request,
        _res: Response,
        _next: NextFunction,
        manager: EntityManager
    ): Promise<RT[]> {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        // TODO: Move take to config file (default pagination)
        let skip = 0,
            take = 500;
        if (pageSize > 0 && page >= 0) {
            skip = page * pageSize;
            take = pageSize;
        }
        const repository: Repository<T> = manager.getRepository(this.entity);
        const entities = await repository.find({
            skip,
            take,
        });
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
        const updatedEntity = new this.entity({
            ...(await this._findByPk(req, res, next, manager)),
            ...req.body,
        });
        await this._validate(updatedEntity);
        const repository: Repository<T> = manager.getRepository(this.entity);
        return this.responseParser(await repository.save(updatedEntity));
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
        // .remove() will remove primary key from entity
        // So we are preparing the response before calling .remove()
        const response = this.responseParser(entityFound);
        await repository.remove(entityFound);
        return response;
    }

    protected abstract responseParser(entity: T): RT;

    /**
     * Validates incoming request.
     * @param req - express.Request
     * @param requiredFields - Request required field list.
     * @param allowedFields - Request allowed field list.
     */
    private async _validate(entity: T): Promise<void> {
        const errors = await validate(entity, {
            validationError: { target: false },
        });
        if (errors.length) {
            throw new MultipleValidationError(errors);
        }
    }
}

export default AbstractController;
