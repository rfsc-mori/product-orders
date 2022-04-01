import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";
import { ProductView } from "./product.interface";
import { CreateProductDto } from "./dto";
import { CategoryEntity } from "../category/category.entity";
import { CategoriesService } from "../category/categories.service";

import { validate } from "class-validator";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoriesService: CategoriesService,
  ) {}

  count() {
    return this.productRepository.count();
  }

  async findViewById(id: string) {
    const product = await this.getProductById(id);
    return ProductsService.buildProductView(product);
  }

  async findViewsByCategory(categoryId: string, order?: object) {
    if (!await this.categoriesService.categoryExists(categoryId)) {
      const errors = { categoryId: 'The specified category does not exist.' };
      throw new HttpException({ message: 'Failed to list products.', errors }, HttpStatus.NOT_FOUND);
    }

    const products = await this.productRepository.find({
      where: { category: { id: categoryId } },
      order: order
    });

    return products.map(ProductsService.buildProductView);
  }

  async create(categoryId: string, productDto: CreateProductDto) {
    const category = await this.getCategoryById(categoryId);
    const productEntity = await this.createProductOnly(category, productDto);

    category.products.push(productEntity);

    await this.categoriesService.saveEntity(category);

    return ProductsService.buildProductView(productEntity);
  }

  async createMany(categoryId: string, productDtoList: CreateProductDto[]) {
    const category = await this.getCategoryById(categoryId);

    const products = productDtoList.map((productDto) => {
      return this.createProductOnly(category, productDto);
    });

    let productViews = new Array(products.length);
    let index = 0;

    for (const product of products) {
      const productEntity = await product;

      productViews[index++] = ProductsService.buildProductView(productEntity);

      category.products.push(productEntity);
    }

    await this.categoriesService.saveEntity(category);

    return productViews;
  }

  private async createProductOnly(category: CategoryEntity, productDto: CreateProductDto) {
    let product = new ProductEntity();
    product.id = productDto.id;
    product.title = productDto.title;
    product.price = productDto.price;
    product.available_quantity = productDto.available_quantity;

    product.category = category;

    await ProductsService.validateProduct(product);

    return this.productRepository.save(product);
  }

  public static buildProductView(product: ProductEntity): ProductView {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      available_quantity: product.available_quantity,
    };
  }

  private static async validateProduct(product: ProductEntity) {
    const errors = await validate(product);

    if (errors.length > 0) {
      throw new HttpException({message: 'Input data validation failed.', errors: errors}, HttpStatus.BAD_REQUEST);
    }
  }

  private async getCategoryById(categoryId: string) {
    return this.categoriesService.getCategoryById(categoryId, ['products']);
  }

  private async getProductById(id: string) {
    const product = await this.productRepository.findOne({ id: id });

    if (!product) {
      const errors = {id: 'The specified product does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }

    return product;
  }
}
