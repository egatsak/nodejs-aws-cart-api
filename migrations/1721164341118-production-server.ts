import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductionServer1721164341118 implements MigrationInterface {
    name = 'ProductionServer1721164341118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "price"`);
    }

}
