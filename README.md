# Kids Fashion E-Commerce Platform & Admin Dashboard

A production-ready, full-stack **Kids Fashion & Kids Products E-Commerce Platform** with **Cash on Delivery (COD)** checkout and a comprehensive **Admin Operations Dashboard**.

---

## Technical Stack & Architecture

```text
root/
├── FE/                          # Next.js 15+ App Router, TypeScript, Tailwind CSS, Zustand, TanStack Query
│   ├── app/(store)/             # Customer Storefront (Creative, Playful Kids Brand Identity, Mobile-First)
│   └── app/(admin)/             # Admin Dashboard (Shopify Admin Style, Dense, Professional)
│
├── BE/                          # NestJS 11+, Mongoose, MongoDB, Zod/Class-Validator, Passport JWT
│   ├── src/modules/             # Auth, Users, Roles, Products, Categories, Inventory, Orders, Customers, Reports, Settings, Uploads
│   ├── src/common/              # Guards (Permissions, Auth), Filters, Interceptors, Decorators, Utils
│   └── src/scripts/             # Database seed script (Super Admin, Roles, Products, Categories, Orders)
│
├── docker-compose.yml           # Full containerized local environment (BE, FE, MongoDB)
├── README.md
└── NOTES.md
```

### Key Highlights
- **Cash on Delivery (COD) Checkout**: Fast guest & customer checkout supporting governorate-specific shipping fees and free-shipping rules (e.g., Free Shipping on orders over 500 EGP).
- **Atomic Stock Protection**: Atomic MongoDB `$inc` stock decrements during checkout to prevent overselling under concurrent requests, with automatic rollback logic.
- **Variant-Level Inventory Audit Logs**: Variant stock management (SKU, Size, Color) with required audit reasons (*New Stock, Manual Correction, Returned Order, Damaged Product, Order Adjustment*).
- **Granular RBAC**: Dynamic Role-Based Access Control enforcing permissions server-side on every protected route (`product:*`, `category:*`, `order:*`, `customer:*`, `inventory:*`, `report:*`, `user:*`, `role:*`, `settings:*`).
- **No Affiliate Logic**: Legacy affiliate/commission code has been completely removed.

---

## Getting Started (Local Development)

### 1. Prerequisites
- Node.js 20+
- MongoDB instance running locally on `mongodb://localhost:27017` OR Docker

### 2. Backend (BE) Setup & Seeding

```bash
cd BE
npm install
npm run seed     # Seeds Super Admin (admin@kidsfashion.com / Admin@123456), roles, categories, sample products, customers, and orders
npm run start:dev
```

Backend API will be running at `http://localhost:4000/api/v1`.

### 3. Frontend (FE) Setup

```bash
cd FE
npm install
npm run dev
```

Frontend Storefront & Admin will be running at `http://localhost:3000`.

- **Customer Storefront**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Admin Login**: `http://localhost:3000/admin/login` (Credentials: `admin@kidsfashion.com` / `Admin@123456`)

---

## Running with Docker Compose

To launch the full stack (MongoDB, Backend, and Frontend) in Docker:

```bash
docker-compose up --build
```

---

## API Modules & Endpoints Summary

- **`POST /api/v1/auth/admin/login`** - Admin authentication (HTTP-only JWT cookie)
- **`POST /api/v1/auth/customer/register`** - Customer registration
- **`POST /api/v1/orders`** - Create Cash on Delivery order with atomic stock decrement
- **`GET /api/v1/orders/track`** - Public live order tracking by Order Number & Phone
- **`GET /api/v1/products`** - Public product listing with age, category, size, color, price & stock filters
- **`POST /api/v1/inventory/adjust`** - Admin stock adjustment with mandatory audit reason
- **`GET /api/v1/reports/export`** - Export Sales, Orders, Inventory, or Customers CSV
