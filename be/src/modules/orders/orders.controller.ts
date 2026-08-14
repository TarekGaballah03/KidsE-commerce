import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Public } from '../../common/decorators/public.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';
import { OrderStatus } from './schemas/order.schema';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ItemInputDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsObject()
  @IsNotEmpty()
  customerInfo: { name: string; phone: string; altPhone?: string; email?: string };

  @IsObject()
  @IsNotEmpty()
  shippingAddress: { governorate: string; city: string; address: string; buildingApt?: string; landmark?: string };

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemInputDto)
  items: ItemInputDto[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  customerId?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddOrderNoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Public()
  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @CurrentUser() user?: any) {
    return this.ordersService.createOrder({
      ...dto,
      customerId: user?.userId || dto.customerId,
    });
  }

  @Public()
  @Get('track')
  async trackOrder(@Query('orderNumber') orderNumber: string, @Query('phone') phone: string) {
    return this.ordersService.trackOrder(orderNumber, phone);
  }

  @Get('my-orders')
  async findMyOrders(@CurrentUser() user: any) {
    return this.ordersService.findMyOrders(user.phone || user.email);
  }

  @Get('admin/list')
  @Permissions(PERMISSIONS.ORDER_VIEW)
  async adminFindAll(@Query() query: any) {
    return this.ordersService.adminFindAll(query);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.ORDER_VIEW)
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id/status')
  @Permissions(PERMISSIONS.ORDER_UPDATE)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.updateStatus(id, dto.status as OrderStatus, dto.notes, user);
  }

  @Post(':id/notes')
  @Permissions(PERMISSIONS.ORDER_UPDATE)
  async addNote(
    @Param('id') id: string,
    @Body() dto: AddOrderNoteDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.addNote(id, dto.note, user);
  }
}
