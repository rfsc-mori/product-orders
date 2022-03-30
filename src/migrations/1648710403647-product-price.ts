import {MigrationInterface, QueryRunner} from "typeorm";

export class productPrice1648710403647 implements MigrationInterface {
    name = 'productPrice1648710403647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`price\` \`price\` decimal(15,4) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`price\` \`price\` decimal(10,4) NOT NULL`);
    }

}
