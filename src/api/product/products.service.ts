import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ProductEntity } from "./product.entity";
import { ProductView } from "./product.interface";
import { CreateProductDto } from "./dto";
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

  async productsExists(ids: string[]) {
    const productCount = await this.productRepository.count({ id: In(ids) });
    return (productCount == ids.length);
  }

  async ensureProductsExistsById(ids: string[]) {
    if (!await this.productsExists(ids)) {
      const errors = {id: 'The specified product does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }
  }

  async findViewById(id: string) {
    const product = await this.getProductEntityById(id);
    return ProductsService.buildProductView(product);
  }

  async findViewsByCategory(categoryId: string, order?: object) {
    await this.categoriesService.ensureCategoryExists(categoryId);

    const products = await this.productRepository.find({
      where: { category: { id: categoryId } },
      order: order
    });

    return products.map(ProductsService.buildProductView);
  }

  async create(categoryId: string, productDto: CreateProductDto) {
    await this.categoriesService.ensureCategoryExists(categoryId);

    const productEntity = await this.createProduct(categoryId, productDto);

    return ProductsService.buildProductView(productEntity);
  }

  async createMany(categoryId: string, productDtoList: CreateProductDto[]) {
    await this.categoriesService.ensureCategoryExists(categoryId);

    const products = await Promise.all(
      productDtoList.map(productDto => this.createProduct(categoryId, productDto))
    );

    return products.map(ProductsService.buildProductView);
  }

  async getProductEntityById(id: string) {
    const product = await this.productRepository.findOne({ id: id });

    if (!product) {
      const errors = {id: 'The specified product does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  private async createProduct(categoryId: string, productDto: CreateProductDto) {
    let product = new ProductEntity();
    product.id = productDto.id;
    product.title = productDto.title;
    product.price = productDto.price;
    product.available_quantity = productDto.available_quantity;

    product.categoryId = categoryId;

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
}
