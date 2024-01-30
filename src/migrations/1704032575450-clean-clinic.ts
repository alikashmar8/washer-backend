import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1704032575450 implements MigrationInterface {
  name = 'CleanClinic1704032575450';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service-categories\` ADD \`showVehicleSelection\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-categories\` ADD \`showQuantityInput\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service-categories\` DROP COLUMN \`showQuantityInput\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-categories\` DROP COLUMN \`showVehicleSelection\``,
    );
  }
}
