import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService
  ) {
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
    //return permissions after validating JWT
    const userRole = role as unknown as { _id: string, name: string }
    const temp = (await this.rolesService.findOne(userRole._id)).toObject()
    const addedPermissions = temp?.permissions ?? []

    //req.user
    return {
      _id,
      name,
      email,
      role,
      permissions: addedPermissions
    };
  }
}