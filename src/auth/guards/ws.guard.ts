import {
  CanActivate,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EmployeesService } from 'src/employees/employees.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => EmployeesService))
    private employeesService: EmployeesService,
  ) {}

  async canActivate(
    context: any,
  ): Promise<
    boolean | any | Promise<boolean | any> | Observable<boolean | any>
  > {
    try {
      const authorization = context.args[0].handshake.headers.authorization;
      if (!authorization) return false;
      const [, token] = authorization.split(' ');
      if (!token) return false;

      const user = await this.usersService.findOneByToken(token);
      const employee = await this.employeesService.findOneByToken(token);

      if (!user && !employee) {
        return false;
      }

      return user ? user : employee;
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
