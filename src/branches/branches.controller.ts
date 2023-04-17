import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@ApiTags('Branches')
@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe())
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    return await this.branchesService.create(createBranchDto);
  }

  @Get()
  async findAll(@Query() query) {
    const relations = ['address'];
    return await this.branchesService.findAll(query, relations);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const relations = ['address', 'employees'];
    return await this.branchesService.findByIdOrFail(id, relations);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.branchesService.remove(id);
  }
}
