import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductionServer1721666897885 implements MigrationInterface {
    name = 'ProductionServer1721666897885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME COLUMN "productId" TO "product"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "product"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "product" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "product"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "product" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME COLUMN "product" TO "productId"`);
    }

}
