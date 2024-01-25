import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1705138985884 implements MigrationInterface {
  name = 'CleanClinic1705138985884';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`deleted_at\` datetime(6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP COLUMN \`deleted_at\``,
    );
  }
}
