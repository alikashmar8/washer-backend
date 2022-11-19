import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';

export class CreateBranchDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
