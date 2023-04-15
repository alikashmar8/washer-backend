import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';
import { ApiProperty} from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Employee } from 'src/employees/entities/employee.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
export class UpdateBranchDto extends PartialType(CreateBranchDto) {
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isActive:boolean;
    

    @ApiProperty()
    @IsOptional()
    employees : Employee[];

    @ApiProperty()
    @IsOptional()
    requests: ServiceRequest[];
  
    



}
