import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanClinic1711307636094 implements MigrationInterface {
    name = 'CleanClinic1711307636094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`currentLongitude\``);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`currentLongitude\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`currentLatitude\``);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`currentLatitude\` float NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`currentLatitude\``);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`currentLatitude\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`currentLongitude\``);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`currentLongitude\` int NULL`);
    }

}
