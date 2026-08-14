import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type AdminUserDocument = AdminUser & Document;

@Schema({ timestamps: true })
export class AdminUser {
  @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role: Types.ObjectId;

  @Prop({ enum: ['active', 'suspended'], default: 'active' })
  status: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null;

  @Prop({ type: String, default: null, select: false })
  resetToken: string | null;

  @Prop({ type: Date, default: null, select: false })
  resetTokenExpiry: Date | null;

  comparePassword: (candidate: string) => Promise<boolean>;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);

// Hash password before saving
AdminUserSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Instance method
AdminUserSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  if (!this.passwordHash || !candidate) return false;
  return bcrypt.compare(candidate, this.passwordHash);
};

// Soft-delete query filters
AdminUserSchema.pre('find', function () {
  this.where({ deletedAt: null });
});
AdminUserSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});
AdminUserSchema.pre('countDocuments', function () {
  this.where({ deletedAt: null });
});

AdminUserSchema.index({ email: 1, deletedAt: 1 });
AdminUserSchema.index({ role: 1 });
AdminUserSchema.index({ status: 1 });
