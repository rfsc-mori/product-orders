import { Body, Controller, Get, Param, Post, Response, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async create(@Body() userDto: CreateUserDto, @Response() res) {
    const user = await this.usersService.create(userDto);

    return res
      .header('Location', user.id.toString())
      .json(user);
  }

  @UsePipes(new ValidationPipe())
  @Get(':id')
  user(@Param('id') id: number) {
    return this.usersService.findViewById(id);
  }
}
