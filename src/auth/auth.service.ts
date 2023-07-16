import { Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';


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

    //update user's refresh token in database
    this.usersService.setRefreshToken(refresh_token, _id)

    response.cookie('refresh_token',
      refresh_token,
      {
        //preventing client-side JavaScript code from accessing the cookie and ensure that only server can access the cookie. 
        httpOnly: true,
        //convert into number
        maxAge: ms(this.configService.get<string>("REFRESH_TOKEN_EXPIRE")),
        //ensure that the cookie is not transmitted over unsecured HTTP connections.
        secure: true,
        //protect against certain types of cross-site request forgery (CSRF) attacks by limiting the scope of the cookie
        sameSite: 'none',

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

  async refresh(refreshTokenCookies: any, response: Response) {

    if (!refreshTokenCookies) {
      throw new UnauthorizedException("No refresh token found.");
    }

    try {
      const decoded = this.jwtService.verify(refreshTokenCookies, {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      });

      const currentUser = await this.usersService.findOneByToken(refreshTokenCookies)
      if (!currentUser) {
        throw new NotFoundException('User not found');
      }

      const payload = {
        sub: "token refresh",
        iss: "from server",
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      };

      const refresh_token = this.createRefreshToken(payload)

      //update user's new refresh token in database
      this.usersService.setRefreshToken(refresh_token, currentUser._id.toString())

      //clear old cookie 
      response.clearCookie('refresh_token')
      response.cookie('refresh_token',
        refresh_token,
        {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: ms(this.configService.get<string>("REFRESH_TOKEN_EXPIRE"))
        }
      )


      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,

        }
      }
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshTokenCookies: any, response: Response) {
    if (!refreshTokenCookies) {
      throw new UnauthorizedException("No refresh token found.");
    }

    try {
      const decoded = this.jwtService.verify(refreshTokenCookies, {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      });

      const currentUser = await this.usersService.findOneByToken(refreshTokenCookies)
      if (!currentUser) {
        throw new NotFoundException('User not found');
      }

      //clear user's refresh token in database
      currentUser.refreshToken = null
      await currentUser.save()

      //clear cookies
      response.clearCookie('refresh_token')

      return "ok"

    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}