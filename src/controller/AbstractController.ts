import AbstractRepository from "../repository/AbstractRepository";
import { Request } from "express";
import EntityNotFoundError from "../errors/EntityNotFoundError";

abstract class AbstractController<T, R extends AbstractRepository<T>> {
    protected repository: R;

    // Properties that must be overwritten by Sub class.
    protected abstract allowedFieldsOnCreation: [string, ...string[]];
    protected abstract allowedFieldsOnUpdate: [string, ...string[]];
    protected abstract entity: new (entityData: unknown) => T;
    protected abstract requiredFieldsOnCreation: [string, ...string[]];
    protected abstract requiredFieldsOnUpdate: [string, ...string[]];

    protected constructor(repository: new () => R) {
        this.repository = new repository();
    }

    /**
     * Create a <T> element.
     * @param req: express.Request.
     * @returns Created <T> element.
     */
    async create(req: Request): Promise<T> {
        this._validateCreation(req);
        // TODO: Handle valdiation
        // TODO: Create loggers
        return await this.repository.save(new this.entity(req.body));
    }

    /**
     * Finds all T elements.
     * @returns List of <T> elements.
     */
    async findAll(): Promise<T[]> {
        return await this.repository.findAll();
    }

    /**
     * Fins a <T> element by its primary key.
     * @param req: express.Request
     * @returns <T> element.
     */
    async findByPk(req: Request): Promise<T> {
        const id = req.params.id;
        const entityFound: T | undefined = await this.repository.findByPk(id);
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
    async save(req: Request): Promise<T> {
        this._validateUpdate(req);
        const entity = await this.findByPk(req);
        // TODO: Handle valdiation
        return await this.repository.save({ ...entity, ...req.body });
    }

    /**
     * Removes a <T> element.
     * @param req: express.Request.
     * @returns Removed <T> element.
     */
    async remove(req: Request): Promise<T> {
        const entity = await this.findByPk(req);
        return await this.repository.remove(entity);
    }

    private _validateCreation(req: Request): void {
        this._validateRequest(
            req,
            this.requiredFieldsOnCreation,
            this.allowedFieldsOnCreation
        );
    }

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
