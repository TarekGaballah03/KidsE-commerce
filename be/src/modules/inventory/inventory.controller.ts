import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ADJUSTMENT_REASONS, AdjustmentReason } from './schemas/inventory-log.schema';

export class AdjustStockDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsInt()
  @Min(0)
  newStock: number;

  @IsEnum(ADJUSTMENT_REASONS, { message: 'Invalid adjustment reason' })
  reason: string;
}

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @Permissions(PERMISSIONS.INVENTORY_VIEW)
  async getInventory(@Query() query: any) {
    return this.inventoryService.getInventory(query);
  }

  @Post('adjust')
  @Permissions(PERMISSIONS.INVENTORY_UPDATE)
  async adjustStock(@Body() dto: AdjustStockDto, @CurrentUser() user: any) {
    return this.inventoryService.adjustStock({
      productId: dto.productId,
      variantId: dto.variantId,
      newStock: dto.newStock,
      reason: dto.reason as AdjustmentReason,
      user,
    });
  }

  @Get('logs')
  @Permissions(PERMISSIONS.INVENTORY_VIEW)
  async getLogs(@Query() query: any) {
    return this.inventoryService.getLogs(query);
  }
}
