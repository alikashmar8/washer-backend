import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { VehicleType } from 'src/common/enums/vehicle-type.enum';

export class CreateVehicleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  brand: string;

  @ApiProperty()
  @IsNotEmpty()
  model: string;

  @ApiProperty()
  @IsOptional()
  year?: string;

  @ApiProperty()
  @IsNotEmpty()
  plateSymbol: string;

  @ApiProperty()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ enum: VehicleType, default: VehicleType.CAR })
  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  userId: string;


  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Vehicle image',
    example: 'image.png',
  })
  photo?: string;
}
