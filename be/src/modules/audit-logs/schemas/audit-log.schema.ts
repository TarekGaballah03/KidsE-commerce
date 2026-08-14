import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({
    type: {
      id: { type: Types.ObjectId, ref: 'AdminUser' },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  actor: { id: Types.ObjectId; name: string; email: string };

  @Prop({ required: true, index: true })
  action: string; // e.g. "product:create", "order:update_status", "role:update"

  @Prop({ required: true, index: true })
  entity: string; // e.g. "Product", "Order", "Role", "Inventory"

  @Prop({ required: true })
  entityId: string;

  @Prop({ type: Object, default: null })
  before: any;

  @Prop({ type: Object, default: null })
  after: any;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ entity: 1, entityId: 1 });
AuditLogSchema.index({ createdAt: -1 });
