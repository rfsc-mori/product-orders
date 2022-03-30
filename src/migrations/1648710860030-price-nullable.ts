import {MigrationInterface, QueryRunner} from "typeorm";

export class priceNullable1648710860030 implements MigrationInterface {
    name = 'priceNullable1648710860030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`price\` \`price\` decimal(15,4) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`price\` \`price\` decimal(15,4) NOT NULL`);
    }

}
