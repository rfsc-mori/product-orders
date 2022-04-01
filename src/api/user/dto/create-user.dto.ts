import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(260)
  readonly name: string;

  @IsEmail()
  @MaxLength(254)
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
