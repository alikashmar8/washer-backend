import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateServiceCategoryStatusDto {
  @ApiProperty({
    type: Boolean,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isActive?: boolean;
}
