import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtDto } from "./dto";
import { UserView } from "../api/user/user.interface";
import { AuthService } from "./auth.service";

import authConfig from "../config/auth.config";

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

  async validate(payload: JwtDto): Promise<UserView> {
    return AuthService.jwtDtoToUserView(payload);
  }
}
