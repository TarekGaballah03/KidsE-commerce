import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async getKpis(dateRange?: string) {
    let dateFilter: any = {};
    const now = new Date();

    if (dateRange === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { createdAt: { $gte: startOfDay } };
    } else if (dateRange === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: sevenDaysAgo } };
    } else if (dateRange === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
    }

    const [allOrders, lowStockProducts] = await Promise.all([
      this.orderModel.find(dateFilter).exec(),
      this.productModel.find({ deletedAt: null, 'variants.stockQuantity': { $lte: 5 } }).exec(),
    ]);

    const totalOrders = allOrders.length;
    let totalRevenue = 0;
    let newOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;
    let returnedOrders = 0;

    for (const o of allOrders) {
      if (o.orderStatus === 'Delivered') {
        deliveredOrders++;
        totalRevenue += o.grandTotal;
      } else if (o.orderStatus === 'New') {
        newOrders++;
      } else if (o.orderStatus === 'Cancelled') {
        cancelledOrders++;
      } else if (o.orderStatus === 'Returned' || o.orderStatus === 'Failed Delivery') {
        returnedOrders++;
      }
    }

    const avgOrderValue = totalOrders > 0 ? totalRevenue / (deliveredOrders || 1) : 0;
    const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      newOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      cancellationRate: Math.round(cancellationRate * 10) / 10,
      lowStockItemsCount: lowStockProducts.length,
    };
  }

  async getSalesChart(dateRange = '30days') {
    const orders = await this.orderModel.find({ orderStatus: { $ne: 'Cancelled' } }).exec();

    // Group by date YYYY-MM-DD
    const chartMap: Record<string, { date: string; sales: number; orders: number }> = {};

    for (const o of orders) {
      const d = new Date((o as any).createdAt);
      const dateStr = d.toISOString().split('T')[0];
      if (!chartMap[dateStr]) {
        chartMap[dateStr] = { date: dateStr, sales: 0, orders: 0 };
      }
      chartMap[dateStr].orders += 1;
      if (o.orderStatus === 'Delivered') {
        chartMap[dateStr].sales += o.grandTotal;
      }
    }

    const sortedData = Object.values(chartMap).sort((a, b) => a.date.localeCompare(b.date));
    return sortedData.slice(-30);
  }

  async generateCsvReport(type: 'sales' | 'orders' | 'inventory' | 'customers'): Promise<string> {
    if (type === 'orders' || type === 'sales') {
      const orders = await this.orderModel.find().sort({ createdAt: -1 }).limit(1000).exec();
      let csv = 'Order Number,Customer Name,Phone,Governorate,Status,Subtotal,Shipping Fee,Grand Total,Date\n';
      for (const o of orders) {
        const dateStr = new Date((o as any).createdAt).toISOString().split('T')[0];
        csv += `"${o.orderNumber}","${o.customerInfo.name}","${o.customerInfo.phone}","${o.shippingAddress.governorate}","${o.orderStatus}",${o.subtotal},${o.shippingFee},${o.grandTotal},"${dateStr}"\n`;
      }
      return csv;
    }

    if (type === 'inventory') {
      const products = await this.productModel.find({ deletedAt: null }).exec();
      let csv = 'Product Title,SKU,Size,Color,Price,Stock Quantity,Published\n';
      for (const p of products) {
        for (const v of p.variants) {
          csv += `"${p.title}","${v.sku}","${v.size}","${v.color.name}",${v.price},${v.stockQuantity},${p.isPublished}\n`;
        }
      }
      return csv;
    }

    if (type === 'customers') {
      const customers = await this.customerModel.find({ deletedAt: null }).exec();
      let csv = 'Customer Name,Phone,Email,Total Orders,Total Spent (EGP),Status\n';
      for (const c of customers) {
        csv += `"${c.name}","${c.phone}","${c.email || ''}",${c.totalOrders},${c.totalSpent},"${c.status}"\n`;
      }
      return csv;
    }

    throw new BadRequestException('Invalid report type');
  }
}
