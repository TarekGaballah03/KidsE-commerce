import { Controller, Get, Post, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../../common/decorators/public.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query, false);
  }

  @Public()
  @Get('featured')
  async getFeatured() {
    return this.productsService.getFeaturedProducts();
  }

  @Public()
  @Get('new-arrivals')
  async getNewArrivals() {
    return this.productsService.getNewArrivals();
  }

  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get('admin/list')
  @Permissions(PERMISSIONS.PRODUCT_VIEW)
  async adminFindAll(@Query() query: any) {
    return this.productsService.findAll(query, true);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.PRODUCT_VIEW)
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @Permissions(PERMISSIONS.PRODUCT_CREATE)
  async create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.PRODUCT_UPDATE)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.PRODUCT_ARCHIVE)
  async archive(@Param('id') id: string) {
    return this.productsService.archive(id);
  }
}
