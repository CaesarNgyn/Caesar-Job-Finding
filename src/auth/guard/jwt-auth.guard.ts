import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //The Reflector class is used to retrieve metadata associated with handlers or classes.
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    // after validating in strategy, it will pass the user object into this func
    if (err || !user) {
      throw err || new UnauthorizedException("Token không hợp lệ");
    }
    const targetMethod = request.method
    const targetPath = request.route?.path as string

    let isValid = user.permissions.find(permission =>
      targetMethod === permission.method && targetPath === permission.apiPath
    )
    if (targetPath.startsWith("/api/v1/auth")) isValid = true
    if (!isValid) {
      throw new ForbiddenException('Bạn không có quyền thực hiện tác vụ này!')
    }
    return user;
  }
}
