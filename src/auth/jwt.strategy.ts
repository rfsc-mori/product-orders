import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtDto } from "./dto";
import { UserRO } from "../api/user/user.interface";

import authConfig from "../config/auth.config";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly jwtConfig:  ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.jwt.secret
    });
  }

  async validate(payload: JwtDto): Promise<UserRO> {
    return AuthService.jwtDtoToUserRO(payload);
  }
}
