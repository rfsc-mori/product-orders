import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";
import { CreateProductDto } from "./dto";
import { CategoryEntity } from "../category/category.entity";

import { validate } from "class-validator";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  count() {
    return this.productRepository.count();
  }

  async create(categoryId: string, productDto: CreateProductDto) {
    const category = await this.getCategory(categoryId);
    const productEntity = await this.createProductOnly(category, productDto);

    category.products.push(productEntity);

    await this.categoryRepository.save(category);

    return productEntity;
  }

  async createMany(categoryId: string, productDtoList: CreateProductDto[]) {
    const category = await this.getCategory(categoryId);

    const products = productDtoList.map((productDto) => {
      return this.createProductOnly(category, productDto);
    });

    for (const product of products) {
      category.products.push(await product);
    }

    await this.categoryRepository.save(category);
  }

  private async createProductOnly(category: CategoryEntity, productDto: CreateProductDto) {
    let product = new ProductEntity();
    product.id = productDto.id;
    product.title = productDto.title;
    product.price = productDto.price;
    product.available_quantity = productDto.available_quantity;

    product.category = category;

    const productErrors = await validate(product);

    if (productErrors.length > 0) {
      throw new HttpException({message: 'Input data validation failed.', errors: productErrors}, HttpStatus.BAD_REQUEST);
    }

    return this.productRepository.save(product);
  }

  private getCategory(categoryId: string) {
    const category = this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products']
    });

    if (!category) {
      const errors = { categoryId: 'The specified category does not exist.' };
      throw new HttpException({ message: 'Failed to create product.', errors }, HttpStatus.BAD_REQUEST);
    }

    return category;
  }
}
