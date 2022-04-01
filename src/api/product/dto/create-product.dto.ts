import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @MaxLength(32)
  readonly id: string;

  @IsNotEmpty()
  @MaxLength(255)
  readonly title: string;

  readonly price: number;

  readonly available_quantity: number;
}
