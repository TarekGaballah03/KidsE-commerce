import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUser, AdminUserDocument } from '../users/admin-user.schema';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';
import { Role, RoleDocument } from '../roles/role.schema';
import { AdminLoginDto, CustomerLoginDto, CustomerRegisterDto, UpdateCustomerProfileDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private jwtService: JwtService,
  ) {}

  async adminLogin(dto: AdminLoginDto) {
    const user = await this.adminUserModel
      .findOne({ email: dto.email.toLowerCase(), deletedAt: null })
      .select('+passwordHash')
      .populate<{ role: RoleDocument }>('role');

    if (!user || user.status === 'suspended') {
      throw new UnauthorizedException('Invalid email or password or account suspended');
    }

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const roleObj = user.role as unknown as RoleDocument;
    const permissions = roleObj?.permissions || [];

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      type: 'admin',
      role: roleObj ? { id: roleObj._id.toString(), name: roleObj.name, slug: roleObj.slug } : null,
      permissions,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: 'admin',
        role: roleObj ? { id: roleObj._id, name: roleObj.name, slug: roleObj.slug } : null,
        permissions,
      },
    };
  }

  async customerLogin(dto: CustomerLoginDto) {
    const query: any = { deletedAt: null };
    if (dto.phoneOrEmail.includes('@')) {
      query.email = dto.phoneOrEmail.toLowerCase();
    } else {
      query.phone = dto.phoneOrEmail.trim();
    }

    const customer = await this.customerModel.findOne(query).select('+passwordHash');
    if (!customer || customer.status === 'suspended') {
      throw new UnauthorizedException('Invalid credentials or account suspended');
    }

    if (!customer.passwordHash) {
      throw new BadRequestException('This account does not have a password set. Please use guest checkout or reset password.');
    }

    const isMatch = await customer.comparePassword!(dto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: customer._id.toString(),
      phone: customer.phone,
      email: customer.email,
      name: customer.name,
      type: 'customer',
      permissions: [],
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        addresses: customer.addresses,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
      },
    };
  }

  async customerRegister(dto: CustomerRegisterDto) {
    const existingPhone = await this.customerModel.findOne({ phone: dto.phone.trim(), deletedAt: null });
    if (existingPhone) {
      throw new BadRequestException('Phone number is already registered');
    }

    if (dto.email) {
      const existingEmail = await this.customerModel.findOne({ email: dto.email.toLowerCase(), deletedAt: null });
      if (existingEmail) {
        throw new BadRequestException('Email address is already registered');
      }
    }

    const customer = new this.customerModel({
      name: dto.name,
      phone: dto.phone.trim(),
      email: dto.email ? dto.email.toLowerCase() : undefined,
      passwordHash: dto.password,
    });

    await customer.save();

    const payload = {
      sub: customer._id.toString(),
      phone: customer.phone,
      email: customer.email,
      name: customer.name,
      type: 'customer',
      permissions: [],
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        addresses: customer.addresses,
        totalOrders: 0,
        totalSpent: 0,
      },
    };
  }

  async getAdminMe(userId: string) {
    const user = await this.adminUserModel
      .findById(userId)
      .populate<{ role: RoleDocument }>('role');

    if (!user || user.status === 'suspended') {
      throw new UnauthorizedException('Admin user not found or suspended');
    }

    const roleObj = user.role as unknown as RoleDocument;
    const permissions = roleObj?.permissions || [];

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      type: 'admin',
      role: roleObj ? { id: roleObj._id, name: roleObj.name, slug: roleObj.slug } : null,
      permissions,
    };
  }

  async getCustomerMe(customerId: string) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer || customer.status === 'suspended') {
      throw new UnauthorizedException('Customer account not found or suspended');
    }
    return {
      id: customer._id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      addresses: customer.addresses,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
    };
  }

  async updateCustomerProfile(customerId: string, dto: UpdateCustomerProfileDto) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new BadRequestException('Customer not found');

    if (dto.name) customer.name = dto.name;
    if (dto.phone) customer.phone = dto.phone.trim();
    if (dto.email) customer.email = dto.email.toLowerCase();

    await customer.save();

    return {
      id: customer._id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      addresses: customer.addresses,
    };
  }
}
