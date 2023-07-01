import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { Public } from './auth/decorator/public.decorator';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  //Test JWT
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
