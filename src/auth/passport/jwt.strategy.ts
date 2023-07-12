import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //if set to true, the expiration claim will be ignored during the verification process
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET')
    });
  }
  //after extracting the payload from the token, it will start validating
  async validate(payload: IUser) {
    const { _id, name, email, role } = payload
    //req.user
    return {
      _id,
      name,
      email,
      role
    };
  }
}