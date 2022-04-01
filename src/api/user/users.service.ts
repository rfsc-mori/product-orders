import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { CreateUserDto } from "./dto";
import { UserRO } from "./user.interface";

import { validate } from "class-validator";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findOne(email: string) {
    return this.usersRepository.findOne({ email: email });
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

    const userErrors = await validate(user);

    if (userErrors.length > 0) {
      throw new HttpException({message: 'Input data validation failed.', errors: userErrors}, HttpStatus.BAD_REQUEST);
    }

    const userEntity = await this.usersRepository.save(user);
    return UsersService.buildUserRO(userEntity);
  }

  public static buildUserRO(user: UserEntity): UserRO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private async userExists(email: string) {
    const emailCount = await this.usersRepository.count({ email: email });
    return (emailCount > 0);
  }
}
