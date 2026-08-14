import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}

@Controller('admin/roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @Permissions(PERMISSIONS.ROLE_VIEW)
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  @Permissions(PERMISSIONS.ROLE_VIEW)
  async getPermissions() {
    return this.rolesService.getPermissionGroups();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.ROLE_VIEW)
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Permissions(PERMISSIONS.ROLE_CREATE)
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.ROLE_UPDATE)
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.ROLE_UPDATE)
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
