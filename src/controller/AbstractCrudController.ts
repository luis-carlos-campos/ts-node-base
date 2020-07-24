import { Request, Response, NextFunction } from "express";
import { Repository, EntityManager } from "typeorm";
import EntityNotFoundError from "../errors/EntityNotFoundError";
import { validate } from "class-validator";
import MultipleValidationError from "../errors/MultipleValidationError";
import ConfigUtil from "../util/ConfigUtil";
import AbstractController from "./AbstractController";

abstract class CrudController<T, RT> extends AbstractController {
    // Properties that must be overwritten by Sub class.
    protected abstract entity: new (entityData?: T) => T;

    /**
     * Create a <T> element.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @returns Created <T> element.
     */
    async create(
        req: Request,
        _res: Response,
        _next: NextFunction
    ): Promise<RT> {
        const newEntity = new this.entity(req.body);
        await this._validate(newEntity);
        const repository: Repository<T> = this.entityManager.getRepository(
            this.entity
        );
        return this.responseParser(await repository.save(newEntity));
    }

    /**
     * Finds all T elements.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @returns List of <T> elements.
     */
    async findAll(
        req: Request,
        _res: Response,
        _next: NextFunction
    ): Promise<RT[]> {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const { maxRequestItems } = ConfigUtil.getServerConfigs();
        let skip = 0,
            take = maxRequestItems;
        if (pageSize > 0 && page >= 0) {
            skip = page * pageSize;
            take = pageSize;
        }
        const repository: Repository<T> = this.entityManager.getRepository(
            this.entity
        );

        const { sort } = req.query;
        let order: T | undefined;
        if (sort) {
            const orderObject: { [k: string]: "DESC" | "ASC" } = {};
            String(sort)
                .split(",")
                .forEach((sortCriteria) => {
                    const isDescendingOrder = sortCriteria.startsWith("-");
                    const fieldName = isDescendingOrder
                        ? sortCriteria.substr(1, sortCriteria.length)
                        : sortCriteria;
                    orderObject[fieldName] = isDescendingOrder ? "DESC" : "ASC";
                });
            order = (orderObject as unknown) as T;
        }

        const entities = await repository.find({
            skip,
            take,
            order,
        });
        return entities.map((entity) => this.responseParser(entity));
    }

    /**
     * Finds a <T> element by its primary key.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @returns <T> element.
     */
    async _findByPk(
        req: Request,
        _res: Response,
        _next: NextFunction
    ): Promise<T> {
        const id = req.params.id;
        const repository: Repository<T> = this.entityManager.getRepository(
            this.entity
        );
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
     * @returns <RT> Response Type.
     */
    async findByPk(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<RT> {
        const entityFound = await this._findByPk(req, res, next);
        return this.responseParser(entityFound);
    }

    /**
     * Saves a <T> element.
     * @param req: express.Request.
     * @param res: express.Response.
     * @param next: express.NextFunction
     * @returns <RT> Response Type.
     */
    async save(req: Request, res: Response, next: NextFunction): Promise<RT> {
        const updatedEntity = new this.entity({
            ...(await this._findByPk(req, res, next)),
            ...req.body,
        });
        await this._validate(updatedEntity);
        const repository: Repository<T> = this.entityManager.getRepository(
            this.entity
        );
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
    async remove(req: Request, res: Response, next: NextFunction): Promise<RT> {
        const entityFound = await this._findByPk(req, res, next);
        const repository: Repository<T> = this.entityManager.getRepository(
            this.entity
        );
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

export default CrudController;
