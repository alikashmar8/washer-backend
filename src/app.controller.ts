import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard)
  @Get('constants')
  async getAllConstants() {
    return await this.appService.getAllConstants();
  }

  @Get('initData')
  async initData(): Promise<void> {
    return await this.appService.initData();
  }
}
