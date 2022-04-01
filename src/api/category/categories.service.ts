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

  async findViewByName(name: string) {
    const categories = await this.findViewsByNames([name]);
    return categories[0];
  }

  async findViewsByNames(names: string[]) {
    const categories = await this.getCategoriesByName(names);
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

  async saveEntity(categoryEntity: CategoryEntity) {
    await CategoriesService.validateCategory(categoryEntity);

    return this.categoryRepository.save(categoryEntity);
  }

  async categoryExists(categoryId: string) {
    const categoryCount = await this.categoryRepository.count({ id: categoryId });
    return (categoryCount > 0);
  }

  findCategoryById(categoryId: string, relations?: string[]) {
    return this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: relations
    });
  }

  async getCategoryById(categoryId: string, relations?: string[]) {
    const category = await this.findCategoryById(categoryId, relations);

    if (!category) {
      const errors = { categoryId: 'The specified category does not exist.' };
      throw new HttpException({ message: 'Failed to create product.', errors }, HttpStatus.BAD_REQUEST);
    }

    return category;
  }

  public static buildCategoryView(category: CategoryEntity): CategoryView {
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

  private async getCategoriesByName(names: string[]) {
    const categories = await this.categoryRepository.find({ name: In(names) });

    if (categories.length < names.length) {
      const errors = {id: 'One or more of the specified resources don\'t exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }

    return categories;
  }
}
