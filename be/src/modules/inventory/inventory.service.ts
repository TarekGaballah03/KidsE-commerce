import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { InventoryLog, InventoryLogDocument, AdjustmentReason } from './schemas/inventory-log.schema';
import { parsePagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(InventoryLog.name) private inventoryLogModel: Model<InventoryLogDocument>,
  ) {}

  async getInventory(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const filter: any = { deletedAt: null };

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { 'variants.sku': { $regex: query.search, $options: 'i' } },
      ];
    }

    const products = await this.productModel.find(filter).exec();

    // Flatten variants into inventory rows
    const inventoryRows: any[] = [];
    for (const p of products) {
      for (const v of p.variants) {
        if (query.lowStock === 'true' && v.stockQuantity > 5) {
          continue;
        }
        if (query.sku && !v.sku.toLowerCase().includes(query.sku.toLowerCase())) {
          continue;
        }
        inventoryRows.push({
          productId: p._id,
          productTitle: p.title,
          productSlug: p.slug,
          variantId: (v as any)._id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          price: v.price,
          stockQuantity: v.stockQuantity,
          isActive: v.isActive && p.isPublished,
        });
      }
    }

    const total = inventoryRows.length;
    const paginatedItems = inventoryRows.slice(skip, skip + limit);

    return paginatedResponse(paginatedItems, total, page, limit);
  }

  async adjustStock(data: {
    productId: string;
    variantId: string;
    newStock: number;
    reason: AdjustmentReason;
    user: any;
  }) {
    if (data.newStock < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    const product = await this.productModel.findById(data.productId);
    if (!product || product.deletedAt) {
      throw new NotFoundException('Product not found');
    }

    const variant = (product.variants as any).id(data.variantId);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const previousStock = variant.stockQuantity;
    const difference = data.newStock - previousStock;

    variant.stockQuantity = data.newStock;
    await product.save();

    // Log adjustment
    const log = new this.inventoryLogModel({
      productId: product._id,
      variantId: variant._id,
      sku: variant.sku,
      previousStock,
      newStock: data.newStock,
      difference,
      reason: data.reason,
      performedByName: data.user?.name || 'Admin',
      performedById: data.user?.userId ? new Types.ObjectId(data.user.userId) : null,
    });

    await log.save();

    return {
      productId: product._id,
      variantId: variant._id,
      sku: variant.sku,
      previousStock,
      newStock: data.newStock,
      difference,
      reason: data.reason,
    };
  }

  async getLogs(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const filter: any = {};

    if (query.sku) filter.sku = query.sku.toUpperCase();
    if (query.reason) filter.reason = query.reason;

    const [items, total] = await Promise.all([
      this.inventoryLogModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.inventoryLogModel.countDocuments(filter),
    ]);

    return paginatedResponse(items, total, page, limit);
  }
}
