import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from "./products.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PATH_METADATA } from "@nestjs/common/constants";
import { CategoriesController } from "../category/categories.controller";

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('products')
  async products(@Query('category_id') categoryId: string) {
    if (!categoryId || categoryId.length == 0) {
      const errors = {category_id: 'The category id cannot be empty.'};
      throw new HttpException({message: 'Input data validation failed.', errors}, HttpStatus.BAD_REQUEST);
    }

    return this.productsService.findViewsByCategory(categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('product')
  async product(@Query('id') id: string) {
    if (!id || id.length == 0) {
      const errors = {id: 'The product id cannot be empty.'};
      throw new HttpException({message: 'Input data validation failed.', errors}, HttpStatus.BAD_REQUEST);
    }

    return this.productsService.findViewById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(ProductsController.categoriesPath() + '/:categoryId/prices')
  async prices(@Param('categoryId') categoryId: string) {
    if (!categoryId || categoryId.length == 0) {
      const errors = {categoryId: 'The category id cannot be empty.'};
      throw new HttpException({message: 'Input data validation failed.', errors}, HttpStatus.BAD_REQUEST);
    }

    return this.productsService.findViewsByCategory(categoryId, { price: 'ASC' });
  }

  private static categoriesPath() {
    return Reflect.getMetadata(PATH_METADATA, CategoriesController);
  }
}
