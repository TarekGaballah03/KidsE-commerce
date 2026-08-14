import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: true, timestamps: true })
export class ProductVariant {
  _id?: Types.ObjectId;

  @Prop({ required: true, trim: true, uppercase: true })
  sku: string;

  @Prop({ required: true, trim: true })
  size: string; // e.g. "0-3M", "6-12M", "2Y", "4Y", "S", "M", "L"

  @Prop({
    type: { name: { type: String, required: true }, hex: { type: String, default: '#000000' } },
    _id: false,
  })
  color: { name: string; hex: string };

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: Number, default: null })
  compareAtPrice: number | null; // Discount price

  @Prop({ required: true, default: 0, min: 0 })
  stockQuantity: number;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: true })
  isActive: boolean;
}
export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

@Schema({ _id: false })
export class ProductImage {
  @Prop({ required: true })
  url: string;

  @Prop({ default: '' })
  alt: string;

  @Prop({ default: false })
  isMain: boolean;
}
export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

@Schema({ _id: false })
export class ProductSeo {
  @Prop({ default: '' })
  metaTitle: string;

  @Prop({ default: '' })
  metaDescription: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];
}
export const ProductSeoSchema = SchemaFactory.createForClass(ProductSeo);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true })
  slug: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], default: [] })
  categories: Types.ObjectId[];

  @Prop({ enum: ['0-2', '3-5', '6-8', '9+'], required: true, index: true })
  ageRange: string;

  @Prop({ type: [ProductImageSchema], default: [] })
  images: ProductImage[];

  @Prop({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[];

  @Prop({ default: false, index: true })
  isFeatured: boolean;

  @Prop({ default: false, index: true })
  isNewArrival: boolean;

  @Prop({ default: true, index: true })
  isPublished: boolean;

  @Prop({ type: ProductSeoSchema, default: {} })
  seo: ProductSeo;

  @Prop({ type: Date, default: null, index: true })
  deletedAt: Date | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ slug: 1, deletedAt: 1 });
ProductSchema.index({ categories: 1, isPublished: 1, deletedAt: 1 });
ProductSchema.index({ ageRange: 1, isPublished: 1, deletedAt: 1 });
ProductSchema.index({ 'variants.sku': 1 });
ProductSchema.index({ title: 'text', description: 'text' });
