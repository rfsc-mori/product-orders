import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async categories() {
    return this.categoriesService.findViewsByNames([
      'Câmeras e Acessórios',
      'Celulares e Telefones',
      'Eletrônicos, Áudio e Vídeo',
      'Games'
    ]);
  }
}
