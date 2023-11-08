import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1698582480485 implements MigrationInterface {
  name = 'CleanClinic1698582480485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` ADD \`deletedAt\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`addresses\` ADD \`deletedAt\` datetime(6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`addresses\` DROP COLUMN \`deletedAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` DROP COLUMN \`deletedAt\``,
    );
  }
}
