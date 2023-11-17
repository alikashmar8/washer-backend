import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1699829288823 implements MigrationInterface {
  name = 'CleanClinic1699829288823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` CHANGE \`status\` \`status\` enum ('PENDING_APPROVAL', 'APPROVED', 'IN_ROUTE', 'IN_PROGRESS', 'DONE', 'CANCELLED', 'REJECTED') NOT NULL DEFAULT 'PENDING_APPROVAL'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` CHANGE \`status\` \`status\` enum ('PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'DONE', 'CANCELLED', 'REJECTED') NOT NULL DEFAULT ''PENDING_APPROVAL''`,
    );
  }
}
