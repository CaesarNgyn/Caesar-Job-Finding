import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../decorators/public.decorator";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ResponseMessage } from "src/decorators/message.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("Login succesfully")

  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  //Test JWT
  @Get('profile')
  getProfile(@Request() req) {

    return req.user;
  }
}
