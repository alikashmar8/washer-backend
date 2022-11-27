import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  ValidateIf
} from 'class-validator';
import { passwordRegex } from 'src/common/constants';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  username: string;

  @ApiProperty({
    type: String,
    description: `${passwordRegex}`,
  })
  @Matches(passwordRegex, { message: 'Weak password' })
  @IsNotEmpty()
  @Length(6, 32)
  password: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 32)
  phoneNumber: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Ad image',
    example: 'image.png',
  })
  @IsOptional()
  photo?: any;

  @ApiProperty({ enum: EmployeeRole, default: EmployeeRole.DRIVER })
  @IsNotEmpty()
  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @ApiProperty()
  @ValidateIf((o) => o.role != EmployeeRole.ADMIN)
  @IsNotEmpty()
  branchId: string;
}
