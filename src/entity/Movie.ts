import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Movie {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100,
    })
    name!: string;

    @Column("text")
    description!: string;

    @Column()
    time!: number;

    @Column("double")
    views!: number;

    @Column({
        name: "is_published",
    })
    isPublished!: boolean;

    // TODO: improve this any
    // TODO: do we need constructor? can we extend base entity?
    constructor(attributes: any) {
        if (attributes) {
            this.name = attributes.name;
            this.description = attributes.description;
            this.time = attributes.time;
            this.views = attributes.views;
            this.isPublished = attributes.isPublished;
        }
    }
}

export default Movie;
