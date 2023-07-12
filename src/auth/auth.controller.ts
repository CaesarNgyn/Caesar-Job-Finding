import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorator/public.decorator";
import { LocalAuthGuard } from "./guard/local-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  //Test JWT
  @Get('profile')
  getProfile(@Request() req) {

    return req.user;
  }
}
