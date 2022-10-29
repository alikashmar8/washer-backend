import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JWT_SECRET } from 'src/common/constants';
import * as jwt from 'jsonwebtoken';
import { JWTDataTypeEnum } from 'src/common/enums/jwt-data-type.enum';
import { User } from 'src/users/entities/user.entity';

export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) return false;
    const token = authorization.split(' ')[1];
    if (!token) {
      return false;
    }
    try {
      const verified: any = jwt.verify(token, JWT_SECRET);
      const type: JWTDataTypeEnum = verified.type;
      if (type == JWTDataTypeEnum.USER) {
        request.user = verified.user;
        request.employee = null;
      } else {
        request.employee = verified.employee;
        request.user = null;
      }
      return true;
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
