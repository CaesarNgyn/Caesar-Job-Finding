import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../decorators/public.decorator";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ResponseMessage } from "src/decorators/message.decorator";
import { RegisterUserDto } from "src/users/dto/create-user.dto";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("Login")
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Public()
  @Post('/register')
  @ResponseMessage("Register a new user")
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }




}
