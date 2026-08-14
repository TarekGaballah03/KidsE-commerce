import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdminUser, AdminUserDocument } from './admin-user.schema';
import { Role, RoleDocument } from '../roles/role.schema';
import { parsePagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async findAll(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const filter: any = { deletedAt: null };

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.status) {
      filter.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.adminUserModel
        .find(filter)
        .populate<{ role: RoleDocument }>('role', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.adminUserModel.countDocuments(filter),
    ]);

    return paginatedResponse(items, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.adminUserModel.findById(id).populate('role');
    if (!user) throw new NotFoundException('Admin user not found');
    return user;
  }

  async create(data: { name: string; email: string; password: string; roleId: string }) {
    const existing = await this.adminUserModel.findOne({ email: data.email.toLowerCase(), deletedAt: null });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const role = await this.roleModel.findById(data.roleId);
    if (!role) throw new BadRequestException('Invalid role ID');

    const user = new this.adminUserModel({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.password,
      role: role._id,
      status: 'active',
    });

    await user.save();
    return this.findOne(user._id.toString());
  }

  async update(id: string, data: { name?: string; roleId?: string }) {
    const user = await this.adminUserModel.findById(id);
    if (!user) throw new NotFoundException('Admin user not found');

    if (data.name) user.name = data.name;
    if (data.roleId) {
      const role = await this.roleModel.findById(data.roleId);
      if (!role) throw new BadRequestException('Invalid role ID');
      user.role = role._id as Types.ObjectId;
    }

    await user.save();
    return this.findOne(id);
  }

  async updateStatus(id: string, status: 'active' | 'suspended') {
    const user = await this.adminUserModel.findById(id);
    if (!user) throw new NotFoundException('Admin user not found');

    user.status = status;
    await user.save();
    return { id: user._id, status: user.status };
  }

  async resetPassword(id: string, newPassword: string) {
    const user = await this.adminUserModel.findById(id);
    if (!user) throw new NotFoundException('Admin user not found');

    user.passwordHash = newPassword;
    await user.save();
    return { message: 'Password reset successfully' };
  }
}
