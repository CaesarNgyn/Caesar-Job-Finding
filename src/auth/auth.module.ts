import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport/dist';
import { LocalStrategy } from './passport/local.strategy';
import { UsersModule } from 'src/users/users.module';
@Module({
  providers: [AuthService, LocalStrategy],
  imports: [PassportModule, UsersModule]
})
export class AuthModule { }
