export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
  parentCategory?: Category | string;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  size: string;
  color: { name: string; hex: string };
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
  image?: string;
  isActive: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categories: Category[];
  ageRange: '0-2' | '3-5' | '6-8' | '9+';
  images: ProductImage[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
}

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  sku: string;
  size: string;
  color: { name: string; hex: string };
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  attributes: { size: string; color: string };
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface OrderTimeline {
  status: string;
  notes?: string;
  employeeName: string;
  timestamp: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerInfo: { name: string; phone: string; altPhone?: string; email?: string };
  shippingAddress: { governorate: string; city: string; address: string; buildingApt?: string; landmark?: string };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
}

export interface ShippingZone {
  _id: string;
  governorate: string;
  fee: number;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  phone: string;
  email: string;
  address: string;
  socialLinks: { instagram: string; facebook: string; whatsapp: string };
  currency: string;
  freeShippingThreshold: number;
  seoDefaults: { metaTitle: string; metaDescription: string };
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  role: { _id: string; name: string; slug: string; permissions?: string[] };
  lastLoginAt?: string;
}

export interface Role {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
}
