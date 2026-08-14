import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { parsePagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class AuditLogsService {
  constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>) {}

  async logAction(data: {
    actor: { id: string; name: string; email: string };
    action: string;
    entity: string;
    entityId: string;
    before?: any;
    after?: any;
  }) {
    const log = new this.auditLogModel({
      actor: {
        id: new Types.ObjectId(data.actor.id),
        name: data.actor.name,
        email: data.actor.email,
      },
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      before: data.before || null,
      after: data.after || null,
    });
    await log.save();
    return log;
  }

  async findAll(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const filter: any = {};

    if (query.entity) filter.entity = query.entity;
    if (query.action) filter.action = query.action;

    const [items, total] = await Promise.all([
      this.auditLogModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.auditLogModel.countDocuments(filter),
    ]);

    return paginatedResponse(items, total, page, limit);
  }
}
