import {
  Body, Controller, Delete, Get, Param, Patch
} from '@nestjs/common';
import { DeviceTokensService } from './device-tokens.service';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';

@Controller('device-tokens')
export class DeviceTokensController {
  constructor(private readonly deviceTokensService: DeviceTokensService) {}

  // @Get()
  // findAll() {
  //   return this.deviceTokensService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceTokensService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDeviceTokenDto: UpdateDeviceTokenDto,
  // ) {
  //   return this.deviceTokensService.update(+id, updateDeviceTokenDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.deviceTokensService.remove(+id);
  // }
}
