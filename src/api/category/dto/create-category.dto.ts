import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @MaxLength(32)
  readonly id: string;

  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;
}
