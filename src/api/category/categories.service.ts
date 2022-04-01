import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryEntity } from "./category.entity";
import { CreateCategoryDto } from "./dto";

import { validate } from "class-validator";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  count() {
    return this.categoryRepository.count();
  }

  async create(categoryDto: CreateCategoryDto) {
    let category = new CategoryEntity();
    category.id = categoryDto.id;
    category.name = categoryDto.name;

    category.products = [];

    const categoryErrors = await validate(category);

    if (categoryErrors.length > 0) {
      throw new HttpException({message: 'Input data validation failed.', errors: categoryErrors}, HttpStatus.BAD_REQUEST);
    }

    return this.categoryRepository.save(category);
  }
}
