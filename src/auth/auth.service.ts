import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from "../api/user/users.service";
import { UserView } from "../api/user/user.interface";
import { JwtService } from "@nestjs/jwt";
import { JwtDto } from "./dto";
import { ConfigType } from "@nestjs/config";
import * as argon2 from 'argon2';
import parse from 'parse-duration'

import authConfig from "../config/auth.config";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof authConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findEntityByEmail(email);

    if (user && await argon2.verify(user.password, password)) {
      return UsersService.buildUserView(user);
    }

    return null;
  }

  async login(user: UserView) {
    const payload = AuthService.userViewToJwtDto(user);

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'JWT',
      expires_in: parse(this.jwtConfig.jwt.expires),
    };
  }

  public static userViewToJwtDto(user: UserView): JwtDto {
    return {
      sub: user.id,
      name: user.name,
      email: user.email
    };
  }

  public static jwtDtoToUserView(dto: JwtDto): UserView {
    return {
      id: dto.sub,
      name: dto.name,
      email: dto.email
    };
  }
}
