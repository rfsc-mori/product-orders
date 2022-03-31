import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ProductEntity } from "./product.entity";
import { CategoryEntity } from "../category/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  exports: [TypeOrmModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
