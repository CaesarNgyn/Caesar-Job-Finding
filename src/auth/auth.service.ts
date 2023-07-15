import { Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }



  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = await bcrypt.compare(pass, user.password)
      if (isValid) {

        return user
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role,
    };


    const refresh_token = this.createRefreshToken(payload)

    response.cookie('refresh_token',
      refresh_token,
      {
        //preventing client-side JavaScript code from accessing the cookie and ensure that only server can access the cookie
        httpOnly: true,
        //convert into number
        maxAge: ms(this.configService.get<string>("REFRESH_TOKEN_EXPIRE"))
      }
    )

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role
      }

    };
  }

  createRefreshToken = (payload) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("REFRESH_TOKEN_EXPIRE")
    })
    return refresh_token
  }

  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user)
    return {
      data: {
        _id: newUser?.id,
        createdAt: newUser?.createdAt
      }
    }
  }
}