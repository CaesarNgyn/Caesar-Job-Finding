import { Body, Controller, Get, Post, Request, UseGuards, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../decorators/public.decorator";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ResponseMessage } from "src/decorators/message.decorator";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from "express";
import { User } from "src/decorators/user.decorator";
import { IUser } from "src/users/users.interface";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("User Login")
  async login(@Request() req,
    //set passthrough to true so that The modified response will be passed through to the next handler/middleware
    @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response)
  }

  @Public()
  @Post('/register')
  @ResponseMessage("Register a new user")
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }


  @Get('/account')
  @ResponseMessage("Get user information")
  async getInfo(@User() user: IUser) {
    return {
      user
    }
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage("Get refresh token from user")
  async refresh(@Request() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.refresh(req.cookies['refresh_token'], response)
  }


  @Get('/logout')
  @ResponseMessage("Logout user")
  async logout(@Request() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logout(req.cookies['refresh_token'], response)
  }

}
