import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Public } from '../../common/decorators/public.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertShippingZoneDto {
  @IsString()
  @IsNotEmpty()
  governorate: string;

  @IsNumber()
  fee: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Public()
  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Public()
  @Get('shipping-zones')
  async getShippingZones() {
    return this.settingsService.getShippingZones();
  }

  @Patch()
  @Permissions(PERMISSIONS.SETTINGS_UPDATE)
  async updateSettings(@Body() body: any) {
    return this.settingsService.updateSettings(body);
  }

  @Post('shipping-zones')
  @Permissions(PERMISSIONS.SETTINGS_UPDATE)
  async upsertShippingZone(@Body() dto: UpsertShippingZoneDto) {
    return this.settingsService.upsertShippingZone(dto);
  }
}
