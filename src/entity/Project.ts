import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {
    IsEmail,
    IsNotEmpty,
    Length,
    IsPositive,
    IsString,
    IsDate,
    IsISO8601,
} from "class-validator";

@Entity()
class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 30,
    })
    @Length(2, 30)
    @IsNotEmpty()
    @IsString()
    name!: string;

    @Column("text")
    @IsString()
    description!: string;

    @Column({
        name: "start_date",
    })
    @IsNotEmpty()
    @IsISO8601()
    startDate!: Date;

    @Column({
        name: "end_date",
    })
    @IsNotEmpty()
    @IsISO8601()
    endDate!: Date;

    @Column({
        length: 255,
    })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @Column("int")
    @IsPositive()
    teamSize!: number;

    // TODO: improve this any
    // TODO: do we need constructor? can we extend base entity?
    constructor(attributes: any) {
        if (attributes) {
            this.name = attributes.name;
            this.description = attributes.description;
            this.startDate = attributes.startDate;
            this.endDate = attributes.endDate;
            this.email = attributes.email;
            this.teamSize = attributes.teamSize;
        }
    }
}

export default Project;
