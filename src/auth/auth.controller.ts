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
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDTO) {
    return await this.authService.login(loginDto);
  }


  @UseGuards(new AuthGuard())
  @Patch(':id/update-password')
  @UsePipes(new ValidationPipe())
  async updatePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDTO,
  ) {
    return await this.authService.updatePassword(id, body);
  }
}
