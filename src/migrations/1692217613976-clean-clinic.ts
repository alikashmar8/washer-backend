import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1692217613976 implements MigrationInterface {
  name = 'CleanClinic1692217613976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` CHANGE \`photo\` \`photo\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` CHANGE \`photo\` \`photo\` varchar(255) NOT NULL`,
    );
  }
}
