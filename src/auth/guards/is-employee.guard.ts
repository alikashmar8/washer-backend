import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { EmployeesService } from 'src/employees/employees.service';

export class IsEmployeeGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => EmployeesService))
    private employeesService: EmployeesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) return false;
    const token = authorization.split(' ')[1];

    if (!token) {
      console.log("TOKEN FALSE");
      return false;
    }
    console.log("check guard");
    try {
      const employee = await this.employeesService.findOneByToken(token);
      if (!employee) return false;

      request.employee = employee;
      console.log("TOKEN TRUE");
      return true;
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }

  }
  
}
