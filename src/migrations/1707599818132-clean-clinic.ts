import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanClinic1707599818132 implements MigrationInterface {
    name = 'CleanClinic1707599818132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_1e3d0240b49c40521aaeb95329\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_31358a1a133482b25fe81b021e\` ON \`employees\``);
        await queryRunner.query(`DROP INDEX \`IDX_5a397d481bad751781fa1adfab\` ON \`employees\``);
        await queryRunner.query(`DROP INDEX \`IDX_765bc1ac8967533a04c74a9f6a\` ON \`employees\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`service-types\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`branches\` ADD \`deleted_at\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`branches\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`service-types\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_765bc1ac8967533a04c74a9f6a\` ON \`employees\` (\`email\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_5a397d481bad751781fa1adfab\` ON \`employees\` (\`phoneNumber\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_31358a1a133482b25fe81b021e\` ON \`employees\` (\`username\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\` (\`username\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_1e3d0240b49c40521aaeb95329\` ON \`users\` (\`phoneNumber\`)`);
    }

}
