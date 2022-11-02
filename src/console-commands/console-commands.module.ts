import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { User } from 'src/users/entities/user.entity';
import { SeedCommandService } from './seed-command/seed-command.service';

@Module({
  imports: [ConsoleModule, TypeOrmModule.forFeature([User])],
  providers: [SeedCommandService],
})
export class ConsoleCommandsModule {}
