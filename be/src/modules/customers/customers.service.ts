import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { parsePagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<CustomerDocument>) {}

  async findAll(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const filter: any = { deletedAt: null };

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.customerModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.customerModel.countDocuments(filter),
    ]);

    return paginatedResponse(items, total, page, limit);
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id);
    if (!customer || customer.deletedAt) throw new NotFoundException('Customer not found');
    return customer;
  }

  async updateNotes(id: string, notes: string) {
    const customer = await this.customerModel.findById(id);
    if (!customer) throw new NotFoundException('Customer not found');

    customer.notes = notes;
    await customer.save();
    return customer;
  }
}
