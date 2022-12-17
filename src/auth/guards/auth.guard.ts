import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { EmployeesService } from 'src/employees/employees.service';
import { UsersService } from 'src/users/users.service';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => EmployeesService))
    private employeesService: EmployeesService,
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
      const employee = await this.employeesService.findOneByToken(token);

      if (!user && !employee) {
        return false;
      }

      // const verified: any = jwt.verify(token, JWT_SECRET);
      // const type: JWTDataTypeEnum = verified.type;
      if (user) {
        request.user = user;
        request.employee = null;
      } else {
        request.employee = employee;
        request.user = null;
      }
      return true;
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
