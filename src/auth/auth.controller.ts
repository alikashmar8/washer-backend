import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDTO,
  PasswordResetDTO,
} from './dtos/forget-password.dto';
import { LoginDTO } from './dtos/login.dto';
import { LogoutDTO } from './dtos/logout.dto';
import { RegisterUserDTO } from './dtos/register.dto';
import { SocialMediaLoginDTO } from './dtos/social-media-login.dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { IsEmployeeGuard } from './guards/is-employee.guard';
import { IsUserGuard } from './guards/is-user.guard';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(
    private authService: AuthService,
    private deviceTokensService: DeviceTokensService,
  ) {}

  @Post('register/users')
  async registerUser(@Body() body: RegisterUserDTO) {
    return await this.authService.registerUser(body);
  }

  @Post('login/users')
  async loginUsers(@Request() request, @Body() loginDto: LoginDTO) {
    if (!loginDto.fcmToken) {
      throw new BadRequestException('FCM Token is required!');
    }
    loginDto.deviceInfo = {
      isMobile: request.useragent.isMobile,
      browser: request.useragent.browser,
      os: request.useragent.os,
      platform: request.useragent.platform,
      source: request.useragent.source,
      version: request.useragent.version,
    };
    return await this.authService.loginUsers(loginDto);
  }

  @Post('login/staff')
  async loginStaff(@Body() loginDto: LoginDTO, @Request() request) {
    if (request.useragent.isMobile && !loginDto.fcmToken) {
      throw new BadRequestException('FCM Token is required!');
    }
    loginDto.deviceInfo = {
      isMobile: request.useragent.isMobile,
      browser: request.useragent.browser,
      os: request.useragent.os,
      platform: request.useragent.platform,
      source: request.useragent.source,
      version: request.useragent.version,
    };
    return await this.authService.loginStaffs(loginDto);
  }

  @UseGuards(IsUserGuard)
  @Post('logout/users')
  async logoutUsers(@Body() body: LogoutDTO) {
    return await this.authService.logout(body);
  }

  @UseGuards(IsEmployeeGuard)
  @Post('logout/staff')
  async logoutStaff(@Body() body: LogoutDTO) {
    return await this.authService.logout(body);
  }

  @UseGuards(IsUserGuard)
  @Patch('update-password/users/:id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDTO,
  ) {
    return await this.authService.updateUserPassword(id, body);
  }

  @UseGuards(IsEmployeeGuard)
  @Patch('update-password/staff/:id')
  async updateEmployeePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDTO,
  ) {
    return await this.authService.updateEmployeePassword(id, body);
  }

  @Get('whatsapp/status')
  async checkWhatsapp() {
    return await this.authService.checkWhatsappStatus();
  }

  @UseGuards(IsEmployeeGuard)
  @Get('whatsapp/qrCode')
  async getWhatsappQrCode() {
    return this.authService.getWhatsappQrCode();
  }

  @UseGuards(IsEmployeeGuard)
  @Get('whatsapp/terminate')
  async terminateWhatsapp() {
    return await this.authService.terminateWhatsapp();
  }

  @Get('whatsapp/sendTestMessage')
  async sendWhatsappMessage() {
    return this.authService.sendWhatsappTestMessage();
  }

  @UseGuards(IsUserGuard)
  @ApiBearerAuth('access_token')
  @Get('sendMobileVerificationCode')
  async sendMobileVerificationCode(@CurrentUser() user: User) {
    return await this.authService.sendMobileVerificationCode(user.id);
  }

  @UseGuards(IsUserGuard)
  @ApiBearerAuth('access_token')
  @Post('verifyMobileNumber')
  async checkValidWhatsAppCode(
    @CurrentUser() user: User,
    @Body('code') code: string,
  ) {
    return await this.authService.verifyMobileNumber(user.id, code);
  }

  @UseGuards(IsUserGuard)
  @ApiBearerAuth('access_token')
  @Get('sendEmailVerificationCode')
  async sendEmailVerificationCode(@CurrentUser() user: User) {
    return await this.authService.sendEmailVerificationCode(user.id);
  }

  @UseGuards(IsUserGuard)
  @ApiBearerAuth('access_token')
  @Post('verifyEmailNumber')
  async checkValidEmailCode(
    @CurrentUser() user: User,
    @Body('code') code: string,
  ) {
    return await this.authService.verifyEmail(user.id, code);
  }

  @Post('forgetPassword')
  async forgotPassword(@Body() data: ForgetPasswordDTO): Promise<void> {
    return await this.authService.forgetPasswordByEmail(data.email);
  }

  @Post('passwordReset')
  async validatePasswordResetCode(@Body() data: PasswordResetDTO) {
    return await this.authService.passwordReset(data);
  }

  //TODO remove
  @Get('sendTestEmail')
  async sendTestEmail() {
    return await this.authService.sendTestEmail();
  }

  @ApiBearerAuth('access_token')
  @UseGuards(new GoogleAuthGuard('google-token'))
  @Post('login/google')
  async googleAuth(
    @Request() request,
    @CurrentUser() user: User,
    @Body() data: SocialMediaLoginDTO,
  ): Promise<any> {
    // let user = req.user;
    if (!user.isMobileVerified)
      return {
        email: user.email,
        registration_completed: user.phoneNumber ? true : false,
        is_mobile_verified: false,
      };

    const deviceInfo = {
      isMobile: request.useragent.isMobile,
      browser: request.useragent.browser,
      os: request.useragent.os,
      platform: request.useragent.platform,
      source: request.useragent.source,
      version: request.useragent.version,
    };
    const token = uuid();

    return await this.deviceTokensService.createUserDeviceToken({
      isMobile: deviceInfo.isMobile,
      os: deviceInfo.os,
      platform: deviceInfo.platform,
      token: data.fcmToken,
      userId: user.id,
      browser: deviceInfo.browser,
      fcmToken: data.fcmToken,
      source: deviceInfo.source,
      version: deviceInfo.version,
      status: DeviceTokenStatus.ACTIVE,
    });
  }
}
