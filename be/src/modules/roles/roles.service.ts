import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.schema';
import { AdminUser, AdminUserDocument } from '../users/admin-user.schema';
import { PERMISSION_GROUPS, ALL_PERMISSIONS } from '../../common/constants/permissions';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
  ) {}

  async findAll() {
    return this.roleModel.find().sort({ isSystem: -1, createdAt: 1 }).exec();
  }

  async getPermissionGroups() {
    return PERMISSION_GROUPS;
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(data: { name: string; description?: string; permissions: string[] }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await this.roleModel.findOne({ slug });
    if (existing) {
      throw new BadRequestException('Role with similar name already exists');
    }

    // Validate permissions
    const validPerms = data.permissions.filter((p) => ALL_PERMISSIONS.includes(p as any));

    const role = new this.roleModel({
      name: data.name,
      slug,
      description: data.description || '',
      permissions: validPerms,
      isSystem: false,
    });

    await role.save();
    return role;
  }

  async update(id: string, data: { name?: string; description?: string; permissions?: string[] }) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Role not found');

    if (data.name && !role.isSystem) {
      role.name = data.name;
      role.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (data.description !== undefined) {
      role.description = data.description;
    }
    if (data.permissions) {
      const validPerms = data.permissions.filter((p) => ALL_PERMISSIONS.includes(p as any));
      role.permissions = validPerms;
    }

    await role.save();
    return role;
  }

  async remove(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Role not found');

    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted');
    }

    const assignedCount = await this.adminUserModel.countDocuments({ role: role._id, deletedAt: null });
    if (assignedCount > 0) {
      throw new BadRequestException(`Cannot delete role assigned to ${assignedCount} active admin user(s)`);
    }

    await this.roleModel.findByIdAndDelete(id);
    return { message: 'Role deleted successfully' };
  }
}
