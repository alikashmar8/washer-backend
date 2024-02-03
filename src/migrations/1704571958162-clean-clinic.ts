import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1704571958162 implements MigrationInterface {
  name = 'CleanClinic1704571958162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`deleted_at\` datetime(6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deleted_at\``);
  }
}
