import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InventoryLogDocument = InventoryLog & Document;

export const ADJUSTMENT_REASONS = [
  'New Stock',
  'Manual Correction',
  'Returned Order',
  'Damaged Product',
  'Order Adjustment',
] as const;

export type AdjustmentReason = (typeof ADJUSTMENT_REASONS)[number];

@Schema({ timestamps: true })
export class InventoryLog {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  variantId: Types.ObjectId;

  @Prop({ required: true, index: true })
  sku: string;

  @Prop({ required: true })
  previousStock: number;

  @Prop({ required: true })
  newStock: number;

  @Prop({ required: true })
  difference: number;

  @Prop({ enum: ADJUSTMENT_REASONS, required: true })
  reason: AdjustmentReason;

  @Prop({ required: true })
  performedByName: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  performedById: Types.ObjectId | null;
}

export const InventoryLogSchema = SchemaFactory.createForClass(InventoryLog);

InventoryLogSchema.index({ sku: 1, createdAt: -1 });
InventoryLogSchema.index({ productId: 1, createdAt: -1 });
