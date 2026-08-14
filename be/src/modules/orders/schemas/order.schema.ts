import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItemSnapshot {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  variantId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ type: { size: String, color: String }, required: true, _id: false })
  attributes: { size: string; color: string };

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  total: number;
}
export const OrderItemSnapshotSchema = SchemaFactory.createForClass(OrderItemSnapshot);

@Schema({ _id: false })
export class CustomerInfoSnapshot {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: '' })
  altPhone: string;

  @Prop({ default: '' })
  email: string;
}
export const CustomerInfoSnapshotSchema = SchemaFactory.createForClass(CustomerInfoSnapshot);

@Schema({ _id: false })
export class ShippingAddressSnapshot {
  @Prop({ required: true })
  governorate: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: '' })
  buildingApt: string;

  @Prop({ default: '' })
  landmark: string;
}
export const ShippingAddressSnapshotSchema = SchemaFactory.createForClass(ShippingAddressSnapshot);

@Schema({ _id: false })
export class OrderTimelineEntry {
  @Prop({ required: true })
  status: string;

  @Prop({ default: '' })
  notes: string;

  @Prop({ required: true })
  employeeName: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  employeeId: Types.ObjectId | null;

  @Prop({ default: Date.now })
  timestamp: Date;
}
export const OrderTimelineEntrySchema = SchemaFactory.createForClass(OrderTimelineEntry);

export const ORDER_STATUSES = [
  'New',
  'Pending Confirmation',
  'Confirmed',
  'Preparing',
  'Ready for Shipping',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Failed Delivery',
  'Returned',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', default: null, index: true })
  customerId: Types.ObjectId | null;

  @Prop({ type: CustomerInfoSnapshotSchema, required: true })
  customerInfo: CustomerInfoSnapshot;

  @Prop({ type: ShippingAddressSnapshotSchema, required: true })
  shippingAddress: ShippingAddressSnapshot;

  @Prop({ type: [OrderItemSnapshotSchema], required: true })
  items: OrderItemSnapshot[];

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0 })
  shippingFee: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  grandTotal: number;

  @Prop({ default: 'COD' })
  paymentMethod: string;

  @Prop({ enum: ['pending', 'paid', 'refunded'], default: 'pending' })
  paymentStatus: string;

  @Prop({ enum: ORDER_STATUSES, default: 'New', index: true })
  orderStatus: OrderStatus;

  @Prop({ default: '' })
  notes: string;

  @Prop({ type: [OrderTimelineEntrySchema], default: [] })
  timeline: OrderTimelineEntry[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ 'customerInfo.phone': 1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });
