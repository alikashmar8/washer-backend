import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/common/constants';
import { JWTDataTypeEnum } from 'src/common/enums/jwt-data-type.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) return false;
    const token = authorization.split(' ')[1];
    if (!token) {
      return false;
    }
    try {
      const verified: any = jwt.verify(token, JWT_SECRET);
      if (
        verified.type == JWTDataTypeEnum.EMPLOYEE &&
        roles.includes(verified.employee?.role)
      ) {
        request.employee = verified.employee;
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
