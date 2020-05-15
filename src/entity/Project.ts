import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {
    IsEmail,
    IsNotEmpty,
    Length,
    IsPositive,
    IsString,
    IsDate,
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
    @IsDate()
    startDate!: Date;

    @Column({
        name: "end_date",
    })
    @IsNotEmpty()
    @IsDate()
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

    // TypeORM calls constructor on entity initialization so we need to accept an empty constructor.
    constructor(readonly project?: Project) {
        if (project) {
            const {
                id,
                name,
                description,
                startDate,
                endDate,
                email,
                teamSize,
            } = project;
            this.id = id;
            this.name = name;
            this.description = description;

            if (!startDate || startDate instanceof Date) {
                this.startDate = startDate;
            } else {
                this.startDate = new Date(startDate);
            }

            if (!endDate || endDate instanceof Date) {
                this.endDate = endDate;
            } else {
                this.endDate = new Date(endDate);
            }

            this.email = email;
            this.teamSize = teamSize;
        }
    }
}

export default Project;
