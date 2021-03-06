import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ProductEntity } from "./product.entity";
import { CategoryEntity } from "../category/category.entity";
import { CategoriesModule } from "../category/categories.module";

@Module({
  imports: [
    CategoriesModule,
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity])
  ],
  exports: [TypeOrmModule, ProductsService],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
