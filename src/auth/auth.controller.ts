import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @HttpCode(200)
  async login(@Request() request) {
    return this.authService.login(request.user);
  }
}
