import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

export class IsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) return false;
    const token = authorization.split(' ')[1];

    if (!token) {
      return false;
    }
    try {
      const user = await this.usersService.findOneByToken(token);
      if (!user) return false;

      request.user = user;
      return true;
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
