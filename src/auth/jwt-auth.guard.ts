import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JsonWebTokenError } from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Custom error message for invalid or expired JWT.
  handleRequest(err, user, info, context, status) {
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid or expired json web token.');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
