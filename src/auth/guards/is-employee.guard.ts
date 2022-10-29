import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/common/constants';
import { JWTDataTypeEnum } from 'src/common/enums/jwt-data-type.enum';
import { Employee } from 'src/employees/entities/employee.entity';

export class IsEmployeeGuard implements CanActivate {
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
      if (type != JWTDataTypeEnum.EMPLOYEE) return false;

      let employee: Employee = verified.employee;
      request.employee = employee;
      return true;
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
