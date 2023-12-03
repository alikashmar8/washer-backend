import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanClinic1701643690261 implements MigrationInterface {
  name = 'CleanClinic1701643690261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` DROP FOREIGN KEY \`FK_998cb3d7b5aee17411138bfd7aa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` DROP FOREIGN KEY \`FK_f1070acf1cffb0cc8c6b844b2c9\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`service_request_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`price\` decimal NOT NULL DEFAULT '0', \`serviceRequestId\` int NOT NULL, \`vehicleId\` int NULL, \`typeId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` DROP COLUMN \`quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` DROP COLUMN \`vehicleId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` DROP COLUMN \`typeId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_request_items\` ADD CONSTRAINT \`FK_7ac7ecdf06593bf884a6c5bb2c8\` FOREIGN KEY (\`typeId\`) REFERENCES \`service-types\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_request_items\` ADD CONSTRAINT \`FK_ca78dcf7528269957c47637f725\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_request_items\` ADD CONSTRAINT \`FK_a591dedf8136216a4815c372ea4\` FOREIGN KEY (\`serviceRequestId\`) REFERENCES \`service-requests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_request_items\` DROP FOREIGN KEY \`FK_a591dedf8136216a4815c372ea4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_request_items\` DROP FOREIGN KEY \`FK_ca78dcf7528269957c47637f725\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_request_items\` DROP FOREIGN KEY \`FK_7ac7ecdf06593bf884a6c5bb2c8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` ADD \`typeId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` ADD \`vehicleId\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` ADD \`quantity\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(`DROP TABLE \`service_request_items\``);
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` ADD CONSTRAINT \`FK_f1070acf1cffb0cc8c6b844b2c9\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service-requests\` ADD CONSTRAINT \`FK_998cb3d7b5aee17411138bfd7aa\` FOREIGN KEY (\`typeId\`) REFERENCES \`service-types\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }
}
