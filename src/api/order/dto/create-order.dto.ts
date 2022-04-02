import { ArrayMinSize, IsArray, IsNotEmpty } from "class-validator";

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  readonly productIds: string[];
}
