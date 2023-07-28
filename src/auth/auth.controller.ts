import { Body, Controller, Get, Post, Request, UseGuards, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../decorators/public.decorator";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ResponseMessage } from "src/decorators/message.decorator";
import { RegisterUserDto, UserLoginDto } from "src/users/dto/create-user.dto";
import { Response } from "express";
import { User } from "src/decorators/user.decorator";
import { IUser } from "src/users/users.interface";
import { RolesService } from "src/roles/roles.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rolesSerivce: RolesService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: UserLoginDto })
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
    const temp = await this.rolesSerivce.findOne(user.role._id) as any
    user.permissions = temp.permissions


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


  @Post('/logout')
  @ResponseMessage("Logout user")
  async logout(@Request() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logout(req.cookies['refresh_token'], response)
  }

}
