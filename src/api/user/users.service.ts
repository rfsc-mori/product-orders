import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { CreateUserDto } from "./dto";
import { ShortUserView, UserView } from "./user.interface";

import { validate } from "class-validator";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async userExistsById(id: number) {
    const emailCount = await this.usersRepository.count({ id: id });
    return (emailCount > 0);
  }

  async ensureUserExistsById(id: number) {
    if (!await this.userExistsById(id)) {
      const errors = {id: 'The specified user does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }
  }

  async userExistsByEmail(email: string) {
    const emailCount = await this.usersRepository.count({ email: email });
    return (emailCount > 0);
  }

  async ensureUserExistsByEmail(email: string) {
    if (!await this.userExistsByEmail(email)) {
      const errors = {id: 'The specified user does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }
  }

  findEntityByEmail(email: string) {
    return this.usersRepository.findOne({ email: email });
  }

  async findViewById(id: number) {
    const user = await this.getUserEntityById(id);
    return UsersService.buildUserView(user);
  }

  async create(userDto: CreateUserDto) {
    if (await this.userExistsByEmail(userDto.email)) {
      const errors = {email: 'The email must be unique.'};
      throw new HttpException({message: 'Resource already exists.', errors}, HttpStatus.CONFLICT);
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

  private async getUserEntityById(id: number) {
    const user = await this.usersRepository.findOne({ id: id });

    if (!user) {
      const errors = {id: 'The specified user does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  static buildUserView(user: UserEntity): UserView {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  static buildShortUserView(user: UserEntity): ShortUserView {
    return {
      name: user.name,
    };
  }

  private static async validateUser(user: UserEntity) {
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new HttpException({message: 'Input data validation failed.', errors: errors}, HttpStatus.BAD_REQUEST);
    }
  }
}
