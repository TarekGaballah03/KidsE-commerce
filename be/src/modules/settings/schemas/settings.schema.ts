import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ timestamps: true })
export class Settings {
  @Prop({ default: 'Kids Fashion & Co.' })
  storeName: string;

  @Prop({ default: '' })
  logoUrl: string;

  @Prop({ default: '+20 100 000 0000' })
  phone: string;

  @Prop({ default: 'hello@kidsfashion.com' })
  email: string;

  @Prop({ default: 'Cairo, Egypt' })
  address: string;

  @Prop({
    type: { instagram: String, facebook: String, whatsapp: String },
    default: { instagram: 'https://instagram.com', facebook: '', whatsapp: '+201000000000' },
    _id: false,
  })
  socialLinks: { instagram: string; facebook: string; whatsapp: string };

  @Prop({ default: 'EGP' })
  currency: string;

  @Prop({ default: 500 }) // Free shipping on orders over 500 EGP
  freeShippingThreshold: number;

  @Prop({
    type: { metaTitle: String, metaDescription: String },
    default: {
      metaTitle: 'Kids Fashion & Co. | Creative & Premium Kids Wear',
      metaDescription: 'Shop modern, comfortable, high quality kids fashion and accessories.',
    },
    _id: false,
  })
  seoDefaults: { metaTitle: string; metaDescription: string };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
