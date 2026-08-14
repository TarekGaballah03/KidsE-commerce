import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerNotesDto {
  @IsString()
  @IsOptional()
  notes?: string;
}

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get('admin/list')
  @Permissions(PERMISSIONS.CUSTOMER_VIEW)
  async findAll(@Query() query: any) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.CUSTOMER_VIEW)
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.CUSTOMER_UPDATE)
  async updateNotes(@Param('id') id: string, @Body() dto: UpdateCustomerNotesDto) {
    return this.customersService.updateNotes(id, dto.notes || '');
  }
}
