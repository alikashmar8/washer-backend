import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1703444063931 implements MigrationInterface {
  name = 'CleanClinic1703444063931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` CHANGE \`status\` \`status\` enum ('PENDING_APPROVAL', 'APPROVED', 'IN_ROUTE', 'IN_PROGRESS', 'DONE', 'CANCELLED', 'REJECTED', 'FIVE_MINUTES') NOT NULL DEFAULT 'PENDING_APPROVAL'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` CHANGE \`status\` \`status\` enum ('PENDING_APPROVAL', 'APPROVED', 'IN_ROUTE', 'IN_PROGRESS', 'DONE', 'CANCELLED', 'REJECTED') NOT NULL DEFAULT ''PENDING_APPROVAL''`,
    );
  }
}
