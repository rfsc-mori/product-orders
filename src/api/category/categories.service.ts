import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CategoryEntity } from "./category.entity";
import { CreateCategoryDto } from "./dto";
import { CategoryView } from "./category.interface";

import { validate } from "class-validator";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  count() {
    return this.categoryRepository.count();
  }

  async categoryExists(categoryId: string) {
    const categoryCount = await this.categoryRepository.count({ id: categoryId });
    return (categoryCount > 0);
  }

  async ensureCategoryExists(categoryId: string) {
    if (!await this.categoryExists(categoryId)) {
      const errors = {id: 'The specified category does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }
  }

  async findViewsByNames(names: string[]) {
    const categories = await this.getCategoryEntitiesByName(names);
    return categories.map(CategoriesService.buildCategoryView);
  }

  async create(categoryDto: CreateCategoryDto) {
    let category = new CategoryEntity();
    category.id = categoryDto.id;
    category.name = categoryDto.name;

    category.products = [];

    await CategoriesService.validateCategory(category);

    return this.categoryRepository.save(category);
  }

  static buildCategoryView(category: CategoryEntity): CategoryView {
    return {
      id: category.id,
      name: category.name,
    };
  }

  private static async validateCategory(category: CategoryEntity) {
    const errors = await validate(category);

    if (errors.length > 0) {
      throw new HttpException({message: 'Input data validation failed.', errors: errors}, HttpStatus.BAD_REQUEST);
    }
  }

  private async getCategoryEntitiesByName(names: string[]) {
    const categories = await this.categoryRepository.find({ name: In(names) });

    if (categories.length < names.length) {
      const errors = {id: 'One or more of the specified categories do not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }

    return categories;
  }
}
