import {MigrationInterface, QueryRunner} from "typeorm";

export class productId1648691083199 implements MigrationInterface {
    name = 'productId1648691083199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_orders\` DROP FOREIGN KEY \`FK_8e8bcfcea727ab7d96d60781895\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_0dce9bc93c2d2c399982d04bef1\``);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`id\` varchar(32) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`category_id\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`category_id\` varchar(32) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`id\` varchar(32) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` ADD PRIMARY KEY (\`order_id\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_8e8bcfcea727ab7d96d6078189\` ON \`product_orders\``);
        await queryRunner.query(`ALTER TABLE \`product_orders\` DROP COLUMN \`product_id\``);
        await queryRunner.query(`ALTER TABLE \`product_orders\` ADD \`product_id\` varchar(32) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` ADD PRIMARY KEY (\`order_id\`, \`product_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_8e8bcfcea727ab7d96d6078189\` ON \`product_orders\` (\`product_id\`)`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_0dce9bc93c2d2c399982d04bef1\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` ADD CONSTRAINT \`FK_8e8bcfcea727ab7d96d60781895\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_orders\` DROP FOREIGN KEY \`FK_8e8bcfcea727ab7d96d60781895\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_0dce9bc93c2d2c399982d04bef1\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e8bcfcea727ab7d96d6078189\` ON \`product_orders\``);
        await queryRunner.query(`ALTER TABLE \`product_orders\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` ADD PRIMARY KEY (\`order_id\`)`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` DROP COLUMN \`product_id\``);
        await queryRunner.query(`ALTER TABLE \`product_orders\` ADD \`product_id\` int NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_8e8bcfcea727ab7d96d6078189\` ON \`product_orders\` (\`product_id\`)`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` ADD PRIMARY KEY (\`order_id\`, \`product_id\`)`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`id\` varchar(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`category_id\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`category_id\` varchar(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_0dce9bc93c2d2c399982d04bef1\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_orders\` ADD CONSTRAINT \`FK_8e8bcfcea727ab7d96d60781895\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
