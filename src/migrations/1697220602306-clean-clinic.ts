import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1697220602306 implements MigrationInterface {
  name = 'CleanClinic1697220602306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`quantity\` int NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP COLUMN \`quantity\``,
    );
  }
}
