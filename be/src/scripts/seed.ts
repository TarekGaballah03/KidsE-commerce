import * as dotenv from 'dotenv';
dotenv.config();

import { connect, disconnect } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { RoleSchema } from '../modules/roles/role.schema';
import { AdminUserSchema } from '../modules/users/admin-user.schema';
import { CategorySchema } from '../modules/categories/schemas/category.schema';
import { ProductSchema } from '../modules/products/schemas/product.schema';
import { CustomerSchema } from '../modules/customers/schemas/customer.schema';
import { OrderSchema } from '../modules/orders/schemas/order.schema';
import { SettingsSchema } from '../modules/settings/schemas/settings.schema';
import { ShippingZoneSchema } from '../modules/settings/schemas/shipping-zone.schema';
import { DEFAULT_ROLES } from '../common/constants/permissions';

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kids_ecommerce';
  console.log(`Connecting to MongoDB at ${mongoUri}...`);

  const conn = await connect(mongoUri);

  const RoleModel = conn.model('Role', RoleSchema);
  const AdminUserModel = conn.model('AdminUser', AdminUserSchema);
  const CategoryModel = conn.model('Category', CategorySchema);
  const ProductModel = conn.model('Product', ProductSchema);
  const CustomerModel = conn.model('Customer', CustomerSchema);
  const OrderModel = conn.model('Order', OrderSchema);
  const SettingsModel = conn.model('Settings', SettingsSchema);
  const ShippingZoneModel = conn.model('ShippingZone', ShippingZoneSchema);

  console.log('Seeding default roles...');
  const roleDocs: any = {};
  for (const [key, roleData] of Object.entries(DEFAULT_ROLES)) {
    const role = await RoleModel.findOneAndUpdate(
      { slug: roleData.slug },
      { ...roleData },
      { upsert: true, new: true },
    );
    roleDocs[key] = role;
  }

  console.log('Seeding Super Admin user (admin@kidsfashion.com / Admin@123456)...');
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const superAdminRole = roleDocs.SUPER_ADMIN || (await RoleModel.findOne({ slug: 'super-admin' }));

  await AdminUserModel.findOneAndUpdate(
    { email: 'admin@kidsfashion.com' },
    {
      name: 'Super Admin',
      email: 'admin@kidsfashion.com',
      passwordHash: adminPasswordHash,
      role: superAdminRole._id,
      status: 'active',
    },
    { upsert: true, new: true },
  );

  console.log('Seeding store settings & shipping zones...');
  await SettingsModel.findOneAndUpdate(
    { storeName: 'Little Dreamers' },
    {
      storeName: 'Little Dreamers',
      currency: 'EGP',
      freeShippingThreshold: 500,
      phone: '0100 000 0000',
      socialLinks: { instagram: 'https://instagram.com/littledreamers' },
    },
    { upsert: true },
  );

  const defaultZones = [
    { governorate: 'Cairo', fee: 70, isDefault: true },
    { governorate: 'Giza', fee: 70, isDefault: true },
    { governorate: 'Alexandria', fee: 75, isDefault: true },
    { governorate: 'Qalyubia', fee: 75, isDefault: true },
    { governorate: 'Sharqia', fee: 80, isDefault: true },
    { governorate: 'Dakahlia', fee: 80, isDefault: true },
    { governorate: 'Suez', fee: 85, isDefault: true },
    { governorate: 'Other', fee: 90, isDefault: true },
  ];

  for (const zone of defaultZones) {
    await ShippingZoneModel.findOneAndUpdate(
      { governorate: zone.governorate },
      zone,
      { upsert: true },
    );
  }

  console.log('Seeding categories...');
  const catBoys = await CategoryModel.findOneAndUpdate(
    { slug: 'boys' },
    {
      name: 'Boys Outfits',
      slug: 'boys',
      description: 'Stylish shirts, hoodies, shorts & trousers for little boys.',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      sortOrder: 1,
      isActive: true,
    },
    { upsert: true, new: true },
  );

  const catGirls = await CategoryModel.findOneAndUpdate(
    { slug: 'girls' },
    {
      name: 'Girls Dresses & Sets',
      slug: 'girls',
      description: 'Cute dresses, skirts, tops & twirl outfits for girls.',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800',
      sortOrder: 2,
      isActive: true,
    },
    { upsert: true, new: true },
  );

  const catBabies = await CategoryModel.findOneAndUpdate(
    { slug: 'babies' },
    {
      name: 'Baby Essentials',
      slug: 'babies',
      description: 'Soft organic cotton rompers, onesies & baby sets.',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      sortOrder: 3,
      isActive: true,
    },
    { upsert: true, new: true },
  );

  console.log('Seeding sample products & variants...');
  await ProductModel.findOneAndUpdate(
    { slug: 'cozy-dino-hoodie-set' },
    {
      title: 'Cozy Dino Hoodie & Joggers Set',
      slug: 'cozy-dino-hoodie-set',
      description: 'Premium fleece hoodie set featuring adorable dinosaur embroidery. Soft, warm, and durable for everyday playtime.',
      categories: [catBoys._id],
      ageRange: '3-5',
      images: [
        { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800', alt: 'Cozy Dino Hoodie', isMain: true },
      ],
      isFeatured: true,
      isNewArrival: true,
      isPublished: true,
      variants: [
        { sku: 'DINO-BLU-3Y', size: '3Y', color: { name: 'Sky Blue', hex: '#38bdf8' }, price: 450, compareAtPrice: 550, stockQuantity: 25, isActive: true },
        { sku: 'DINO-BLU-4Y', size: '4Y', color: { name: 'Sky Blue', hex: '#38bdf8' }, price: 450, compareAtPrice: 550, stockQuantity: 18, isActive: true },
        { sku: 'DINO-YEL-3Y', size: '3Y', color: { name: 'Sunshine Yellow', hex: '#facc15' }, price: 450, compareAtPrice: null, stockQuantity: 12, isActive: true },
      ],
    },
    { upsert: true },
  );

  await ProductModel.findOneAndUpdate(
    { slug: 'floral-twirl-summer-dress' },
    {
      title: 'Floral Twirl Summer Cotton Dress',
      slug: 'floral-twirl-summer-dress',
      description: '100% breathable cotton twirl dress with pastel botanical prints. Lightweight and comfortable for sunny playdates.',
      categories: [catGirls._id],
      ageRange: '3-5',
      images: [
        { url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800', alt: 'Floral Dress', isMain: true },
      ],
      isFeatured: true,
      isNewArrival: true,
      isPublished: true,
      variants: [
        { sku: 'FLORAL-PNK-3Y', size: '3Y', color: { name: 'Pastel Pink', hex: '#f472b6' }, price: 380, compareAtPrice: 480, stockQuantity: 30, isActive: true },
        { sku: 'FLORAL-PNK-4Y', size: '4Y', color: { name: 'Pastel Pink', hex: '#f472b6' }, price: 380, compareAtPrice: 480, stockQuantity: 15, isActive: true },
      ],
    },
    { upsert: true },
  );

  await ProductModel.findOneAndUpdate(
    { slug: 'organic-cotton-baby-romper-3pack' },
    {
      title: 'Organic Cotton Baby Romper (3-Pack)',
      slug: 'organic-cotton-baby-romper-3pack',
      description: 'Hypoallergenic organic cotton baby bodysuits with nickel-free snaps for easy diaper changes.',
      categories: [catBabies._id],
      ageRange: '0-2',
      images: [
        { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', alt: 'Baby Romper 3-Pack', isMain: true },
      ],
      isFeatured: true,
      isNewArrival: false,
      isPublished: true,
      variants: [
        { sku: 'BABY-NEU-6M', size: '6M', color: { name: 'Neutral Cream', hex: '#fef08a' }, price: 290, compareAtPrice: null, stockQuantity: 40, isActive: true },
        { sku: 'BABY-NEU-12M', size: '12M', color: { name: 'Neutral Cream', hex: '#fef08a' }, price: 290, compareAtPrice: null, stockQuantity: 20, isActive: true },
      ],
    },
    { upsert: true },
  );

  console.log('Seeding sample customer & order...');
  const customerPasswordHash = await bcrypt.hash('Customer@123', 10);
  const customer = await CustomerModel.findOneAndUpdate(
    { phone: '01012345678' },
    {
      name: 'Nour El-Din',
      phone: '01012345678',
      email: 'nour@example.com',
      password: customerPasswordHash,
      status: 'active',
      totalOrders: 1,
      totalSpent: 520,
    },
    { upsert: true, new: true },
  );

  await OrderModel.findOneAndUpdate(
    { orderNumber: 'ORD-1001' },
    {
      orderNumber: 'ORD-1001',
      customer: customer._id,
      customerInfo: {
        name: 'Nour El-Din',
        phone: '01012345678',
        email: 'nour@example.com',
      },
      shippingAddress: {
        governorate: 'Cairo',
        city: 'New Cairo',
        address: '5th Settlement, Street 9',
        buildingApt: 'Building 12, Apt 4',
      },
      items: [
        {
          productId: (await ProductModel.findOne({ slug: 'cozy-dino-hoodie-set' }))?._id,
          variantId: 'DINO-BLU-3Y',
          productName: 'Cozy Dino Hoodie & Joggers Set',
          sku: 'DINO-BLU-3Y',
          attributes: { size: '3Y', color: 'Sky Blue' },
          quantity: 1,
          unitPrice: 450,
          total: 450,
        },
      ],
      subtotal: 450,
      shippingFee: 70,
      discountTotal: 0,
      grandTotal: 520,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      timeline: [
        { status: 'New', notes: 'Order submitted via website (COD)', timestamp: new Date(), employeeName: 'System' },
        { status: 'Confirmed', notes: 'Customer confirmed via phone call', timestamp: new Date(), employeeName: 'Super Admin' },
      ],
    },
    { upsert: true },
  );

  console.log('🎉 All collections & Admin User seeded successfully into MongoDB Atlas!');
  await disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
