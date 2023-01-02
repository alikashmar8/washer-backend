import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  async getAllConstants(){
    return await this.appService.getAllConstants();
  }

  @Get('initData')
  async initData(): Promise<void>{
    return await this.appService.initData();
  }
}
