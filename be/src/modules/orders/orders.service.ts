import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus, ORDER_STATUSES } from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';
import { ShippingZone, ShippingZoneDocument } from '../settings/schemas/shipping-zone.schema';
import { Settings, SettingsDocument } from '../settings/schemas/settings.schema';
import { parsePagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(ShippingZone.name) private shippingZoneModel: Model<ShippingZoneDocument>,
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {}

  private generateOrderNumber(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${randomNum}`;
  }

  async createOrder(data: {
    customerInfo: { name: string; phone: string; altPhone?: string; email?: string };
    shippingAddress: { governorate: string; city: string; address: string; buildingApt?: string; landmark?: string };
    items: Array<{ productId: string; variantId: string; quantity: number }>;
    notes?: string;
    customerId?: string;
  }) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Determine Shipping Fee & Free Shipping Threshold
    const [zone, storeSettings] = await Promise.all([
      this.shippingZoneModel.findOne({ governorate: data.shippingAddress.governorate, isActive: true }),
      this.settingsModel.findOne(),
    ]);

    const defaultShippingFee = zone ? zone.fee : 75;
    const freeShippingThreshold = storeSettings ? storeSettings.freeShippingThreshold : 500;

    const snapshotItems: any[] = [];
    const decrementedItems: Array<{ productId: string; variantId: string; quantity: number }> = [];

    let subtotal = 0;

    // ATOMIC STOCK DECREMENT LOOP WITH ROLLBACK SAFETY
    try {
      for (const itemInput of data.items) {
        if (!itemInput.quantity || itemInput.quantity <= 0) {
          throw new BadRequestException('Invalid item quantity');
        }

        // Atomic update: only decrement if stockQuantity >= quantity
        const updatedProduct = await this.productModel.findOneAndUpdate(
          {
            _id: itemInput.productId,
            deletedAt: null,
            isPublished: true,
            'variants._id': itemInput.variantId,
            'variants.stockQuantity': { $gte: itemInput.quantity },
          },
          {
            $inc: { 'variants.$.stockQuantity': -itemInput.quantity },
          },
          { new: true },
        );

        if (!updatedProduct) {
          throw new BadRequestException(
            `Stock unavailable or insufficient for product item (${itemInput.productId})`,
          );
        }

        decrementedItems.push({
          productId: itemInput.productId,
          variantId: itemInput.variantId,
          quantity: itemInput.quantity,
        });

        // Find the variant details from updatedProduct
        const variant = (updatedProduct.variants as any).id(itemInput.variantId);
        const unitPrice = variant.compareAtPrice && variant.compareAtPrice < variant.price
          ? variant.compareAtPrice
          : variant.price;

        const itemTotal = unitPrice * itemInput.quantity;
        subtotal += itemTotal;

        snapshotItems.push({
          productId: updatedProduct._id,
          variantId: variant._id,
          productName: updatedProduct.title,
          sku: variant.sku,
          attributes: {
            size: variant.size,
            color: variant.color.name,
          },
          quantity: itemInput.quantity,
          unitPrice,
          discount: variant.compareAtPrice && variant.compareAtPrice < variant.price ? (variant.price - variant.compareAtPrice) : 0,
          total: itemTotal,
        });
      }
    } catch (err) {
      // ROLLBACK STOCKS FOR ALREADY DECREMENTED ITEMS
      for (const dec of decrementedItems) {
        await this.productModel.updateOne(
          { _id: dec.productId, 'variants._id': dec.variantId },
          { $inc: { 'variants.$.stockQuantity': dec.quantity } },
        );
      }
      throw err;
    }

    const shippingFee = subtotal >= freeShippingThreshold ? 0 : defaultShippingFee;
    const grandTotal = subtotal + shippingFee;
    const orderNumber = this.generateOrderNumber();

    // Create Customer snapshot or link
    let customerObjectId: Types.ObjectId | null = null;
    if (data.customerId && Types.ObjectId.isValid(data.customerId)) {
      customerObjectId = new Types.ObjectId(data.customerId);
      await this.customerModel.updateOne(
        { _id: customerObjectId },
        { $inc: { totalOrders: 1, totalSpent: grandTotal } },
      );
    } else {
      // Upsert guest customer by phone
      const customer = await this.customerModel.findOneAndUpdate(
        { phone: data.customerInfo.phone.trim() },
        {
          $setOnInsert: {
            name: data.customerInfo.name,
            phone: data.customerInfo.phone.trim(),
            email: data.customerInfo.email || undefined,
            addresses: [{
              governorate: data.shippingAddress.governorate,
              city: data.shippingAddress.city,
              address: data.shippingAddress.address,
              buildingApt: data.shippingAddress.buildingApt || '',
              landmark: data.shippingAddress.landmark || '',
              isDefault: true,
            }],
          },
          $inc: { totalOrders: 1, totalSpent: grandTotal },
        },
        { upsert: true, new: true },
      );
      customerObjectId = customer._id as Types.ObjectId;
    }

    const order = new this.orderModel({
      orderNumber,
      customerId: customerObjectId,
      customerInfo: {
        name: data.customerInfo.name,
        phone: data.customerInfo.phone.trim(),
        altPhone: data.customerInfo.altPhone || '',
        email: data.customerInfo.email || '',
      },
      shippingAddress: {
        governorate: data.shippingAddress.governorate,
        city: data.shippingAddress.city,
        address: data.shippingAddress.address,
        buildingApt: data.shippingAddress.buildingApt || '',
        landmark: data.shippingAddress.landmark || '',
      },
      items: snapshotItems,
      subtotal,
      shippingFee,
      discount: 0,
      grandTotal,
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      orderStatus: 'New',
      notes: data.notes || '',
      timeline: [
        {
          status: 'New',
          notes: 'Order created via Cash on Delivery',
          employeeName: 'Customer',
          employeeId: null,
          timestamp: new Date(),
        },
      ],
    });

    await order.save();
    return order;
  }

  async trackOrder(orderNumber: string, phone: string) {
    const order = await this.orderModel.findOne({
      orderNumber: orderNumber.trim().toUpperCase(),
      'customerInfo.phone': phone.trim(),
    });

    if (!order) {
      throw new NotFoundException('Order not found with provided Order Number and Phone');
    }

    return {
      orderNumber: order.orderNumber,
      customerInfo: order.customerInfo,
      shippingAddress: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      grandTotal: order.grandTotal,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      createdAt: (order as any).createdAt,
      timeline: order.timeline,
    };
  }

  async findMyOrders(phoneOrEmail: string) {
    const filter = {
      $or: [
        { 'customerInfo.phone': phoneOrEmail.trim() },
        { 'customerInfo.email': phoneOrEmail.trim().toLowerCase() },
      ],
    };
    return this.orderModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async adminFindAll(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const filter: any = {};

    if (query.status) {
      filter.orderStatus = query.status;
    }

    if (query.governorate) {
      filter['shippingAddress.governorate'] = query.governorate;
    }

    if (query.search) {
      filter.$or = [
        { orderNumber: { $regex: query.search, $options: 'i' } },
        { 'customerInfo.name': { $regex: query.search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    const [items, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return paginatedResponse(items, total, page, limit);
  }

  async findById(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(
    id: string,
    newStatus: OrderStatus,
    notes: string | undefined,
    user: any,
  ) {
    if (!ORDER_STATUSES.includes(newStatus)) {
      throw new BadRequestException('Invalid order status');
    }

    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const previousStatus = order.orderStatus;
    if (previousStatus === newStatus) {
      return order;
    }

    // Check if transition requires restoring stock (e.g. Cancelled / Returned / Failed Delivery)
    const terminalRestoreStatuses: OrderStatus[] = ['Cancelled', 'Failed Delivery', 'Returned'];
    const requiresStockRestore =
      terminalRestoreStatuses.includes(newStatus) && !terminalRestoreStatuses.includes(previousStatus);

    if (requiresStockRestore) {
      for (const item of order.items) {
        await this.productModel.updateOne(
          { _id: item.productId, 'variants._id': item.variantId },
          { $inc: { 'variants.$.stockQuantity': item.quantity } },
        );
      }
    }

    if (newStatus === 'Delivered') {
      order.paymentStatus = 'paid';
    }

    order.orderStatus = newStatus;
    order.timeline.push({
      status: newStatus,
      notes: notes || `Status changed from ${previousStatus} to ${newStatus}`,
      employeeName: user?.name || 'Admin',
      employeeId: user?.userId ? new Types.ObjectId(user.userId) : null,
      timestamp: new Date(),
    });

    await order.save();
    return order;
  }

  async addNote(id: string, noteText: string, user: any) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    order.timeline.push({
      status: order.orderStatus,
      notes: `Note added: ${noteText}`,
      employeeName: user?.name || 'Admin',
      employeeId: user?.userId ? new Types.ObjectId(user.userId) : null,
      timestamp: new Date(),
    });

    await order.save();
    return order;
  }
}
