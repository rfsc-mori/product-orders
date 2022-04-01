import { Injectable } from '@nestjs/common';
import { UsersService } from "../api/user/users.service";
import { UserRO } from "../api/user/user.interface";
import { JwtService } from "@nestjs/jwt";
import { JwtDto } from "./dto";

import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (user && await argon2.verify(user.password, password)) {
      return UsersService.buildUserRO(user);
    }

    return null;
  }

  async login(user: UserRO) {
    const payload = AuthService.userROToJwtDto(user);
    return { access_token: this.jwtService.sign(payload) };
  }

  public static userROToJwtDto(user: UserRO): JwtDto {
    return {
      sub: user.id,
      name: user.name,
      email: user.email
    };
  }

  public static jwtDtoToUserRO(dto: JwtDto): UserRO {
    return {
      id: dto.sub,
      name: dto.name,
      email: dto.email
    };
  }
}
