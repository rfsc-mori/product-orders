import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";
import { CreateProductDto } from "./dto";
import { CategoryEntity } from "../category/category.entity";

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
    const category = await this.findCategory(categoryId);
    const productEntity = await this.createProductOnly(category, productDto);

    category.products.push(productEntity);

    await this.categoryRepository.save(category);

    return productEntity;
  }

  async createMany(categoryId: string, productDtoList: CreateProductDto[]) {
    const category = await this.findCategory(categoryId);

    const products = productDtoList.map((productDto) => {
      return this.createProductOnly(category, productDto);
    });

    for (const product of products) {
      category.products.push(await product);
    }

    await this.categoryRepository.save(category);
  }

  private createProductOnly(category: CategoryEntity, productDto: CreateProductDto) {
    let product = new ProductEntity();
    product.id = productDto.id;
    product.title = productDto.title;
    product.price = productDto.price;
    product.available_quantity = productDto.available_quantity;

    product.category = category;

    return this.productRepository.save(product);
  }

  private findCategory(categoryId: string) {
    return this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products']
    });
  }
}
