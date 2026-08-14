import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class UpdateAdminUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  roleId?: string;
}

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  status: 'active' | 'suspended';
}

export class AdminResetPasswordDto {
  @IsString()
  @MinLength(6)
  newPassword: string;
}

@Controller('admin/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Permissions(PERMISSIONS.USER_VIEW)
  async findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.USER_VIEW)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Permissions(PERMISSIONS.USER_CREATE)
  async create(@Body() dto: CreateAdminUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.USER_UPDATE)
  async update(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/status')
  @Permissions(PERMISSIONS.USER_DISABLE)
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.usersService.updateStatus(id, dto.status);
  }

  @Patch(':id/reset-password')
  @Permissions(PERMISSIONS.USER_UPDATE)
  async resetPassword(@Param('id') id: string, @Body() dto: AdminResetPasswordDto) {
    return this.usersService.resetPassword(id, dto.newPassword);
  }
}
