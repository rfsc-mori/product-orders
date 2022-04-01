import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { CreateUserDto } from "./dto";
import { UserView } from "./user.interface";

import { validate } from "class-validator";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  findEntityByEmail(email: string) {
    return this.usersRepository.findOne({ email: email });
  }

  async findViewById(id: number) {
    const user = await this.getUserById(id);
    return UsersService.buildUserView(user);
  }

  async create(userDto: CreateUserDto) {
    if (await this.userExists(userDto.email)) {
      const errors = {email: 'The email must be unique.'};
      throw new HttpException({message: 'Input data validation failed.', errors}, HttpStatus.CONFLICT);
    }

    let user = new UserEntity();
    user.name = userDto.name;
    user.email = userDto.email;
    user.password = userDto.password;

    user.orders = [];

    await UsersService.validateUser(user);

    const userEntity = await this.usersRepository.save(user);
    return UsersService.buildUserView(userEntity);
  }

  public static buildUserView(user: UserEntity): UserView {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private static async validateUser(user: UserEntity) {
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new HttpException({message: 'Input data validation failed.', errors: errors}, HttpStatus.BAD_REQUEST);
    }
  }

  private async userExists(email: string) {
    const emailCount = await this.usersRepository.count({ email: email });
    return (emailCount > 0);
  }

  private async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ id: id });

    if (!user) {
      const errors = {id: 'The specified user does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
