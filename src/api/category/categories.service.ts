import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryEntity } from "./category.entity";
import { CreateCategoryDto } from "./dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  count() {
    return this.categoryRepository.count();
  }

  create(categoryDto: CreateCategoryDto) {
    let category = new CategoryEntity();
    category.id = categoryDto.id;
    category.name = categoryDto.name;
    category.products = [];

    return this.categoryRepository.save(category);
  }
}
