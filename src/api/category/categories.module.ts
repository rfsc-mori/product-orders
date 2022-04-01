import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { CategoryEntity } from "./category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  exports: [TypeOrmModule, CategoriesService],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
