import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type CustomerDocument = Customer & Document;

@Schema({ _id: false })
export class Address {
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

  @Prop({ default: false })
  isDefault: boolean;
}
export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, index: true })
  phone: string;

  @Prop({ trim: true, lowercase: true, sparse: true, index: true })
  email?: string;

  @Prop({ select: false })
  passwordHash?: string;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: '' })
  notes: string;

  @Prop({ enum: ['active', 'suspended'], default: 'active' })
  status: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: String, default: null, select: false })
  resetToken?: string | null;

  @Prop({ type: Date, default: null, select: false })
  resetTokenExpiry?: Date | null;

  comparePassword?: (candidate: string) => Promise<boolean>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.pre('save', async function () {
  if (!this.passwordHash || !this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

CustomerSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidate, this.passwordHash);
};

CustomerSchema.index({ phone: 1, deletedAt: 1 });
CustomerSchema.index({ email: 1, deletedAt: 1 });
