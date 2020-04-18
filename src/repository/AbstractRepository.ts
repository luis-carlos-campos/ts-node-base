import { getManager, ObjectType } from "typeorm";

abstract class AbstractRepository<T> {
    protected abstract type: ObjectType<T>;

    async save(newEntityObject: T): Promise<T> {
        return await getManager().save(this.type, newEntityObject);
    }

    async findAll(): Promise<T[]> {
        return await getManager().find(this.type);
    }

    async findByPk(id: string | number | Date): Promise<T | undefined> {
        return await getManager().findOne(this.type, id);
    }

    async remove(entity: T): Promise<T> {
        return await getManager().remove(this.type, entity);
    }
}

export default AbstractRepository;
