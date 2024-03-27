import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanClinic1711566661318 implements MigrationInterface {
    name = 'CleanClinic1711566661318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employees\` MODIFY \`currentLongitude\` decimal(11,7) NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` MODIFY \`currentLatitude\` decimal(11,7) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` MODIFY \`lat\` decimal(11,7) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` MODIFY \`lon\` decimal(11,7) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`addresses\` MODIFY \`lon\` float(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` MODIFY \`lat\` float(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` MODIFY \`currentLatitude\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` MODIFY \`currentLongitude\` float NULL`);
    }

}
