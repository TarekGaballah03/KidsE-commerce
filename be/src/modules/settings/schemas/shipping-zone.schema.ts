import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShippingZoneDocument = ShippingZone & Document;

@Schema({ timestamps: true })
export class ShippingZone {
  @Prop({ required: true, unique: true, trim: true })
  governorate: string; // e.g. "Cairo", "Alexandria", "Giza", "Sharqia", "Dakahlia", "Other"

  @Prop({ required: true, min: 0 })
  fee: number; // e.g. 70 EGP

  @Prop({ default: true })
  isActive: boolean;
}

export const ShippingZoneSchema = SchemaFactory.createForClass(ShippingZone);

ShippingZoneSchema.index({ governorate: 1 });
