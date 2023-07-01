import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
