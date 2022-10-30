import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { RegisterUserDTO } from './dtos/register.dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { IsEmployeeGuard } from './guards/is-employee.guard';
import { IsUserGuard } from './guards/is-user.guard';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/users')
  async registerUser(@Body() body: RegisterUserDTO) {
    return await this.authService.registerUser(body);
  }

  @Post('login/users')
  async loginUsers(@Body() loginDto: LoginDTO) {
    return await this.authService.loginUsers(loginDto);
  }

  @Post('login/staffs')
  async loginStaffs(@Body() loginDto: LoginDTO) {
    return await this.authService.loginStaffs(loginDto);
  }

  @UseGuards(new IsUserGuard())
  @Patch('update-password/users/:id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDTO,
  ) {
    return await this.authService.updateUserPassword(id, body);
  }

  @UseGuards(new IsEmployeeGuard())
  @Patch('update-password/staffs/:id')
  async updateEmployeePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDTO,
  ) {
    return await this.authService.updateEmployeePassword(id, body);
  }
}
