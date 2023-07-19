import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

import { AuthService } from './auth/auth.service';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }



}
