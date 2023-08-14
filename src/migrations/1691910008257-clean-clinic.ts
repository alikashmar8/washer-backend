import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1691910008257 implements MigrationInterface {
  name = 'CleanClinic1691910008257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branches\` ADD \`coverageArea\` int NOT NULL DEFAULT '1000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`categoryId\` \`categoryId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`addresses\` CHANGE \`region\` \`region\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`categoryId\` \`categoryId\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branches\` DROP COLUMN \`coverageArea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`addresses\` CHANGE \`region\` \`region\` varchar(255) NOT NULL`,
    );
  }
}
