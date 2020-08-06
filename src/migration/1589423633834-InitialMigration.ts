import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1589423633834 implements MigrationInterface {
    name = 'InitialMigration1589423633834';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `project` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(30) NOT NULL, `description` text NOT NULL, `start_date` datetime NOT NULL, `end_date` datetime NOT NULL, `email` varchar(255) NOT NULL, `teamSize` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `project`', undefined);
    }
}
