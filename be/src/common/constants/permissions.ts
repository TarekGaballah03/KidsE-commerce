export const PERMISSIONS = {
  // Product management
  PRODUCT_VIEW: 'product:view',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_ARCHIVE: 'product:archive',

  // Category management
  CATEGORY_VIEW: 'category:view',
  CATEGORY_CREATE: 'category:create',
  CATEGORY_UPDATE: 'category:update',

  // Order management
  ORDER_VIEW: 'order:view',
  ORDER_UPDATE: 'order:update',
  ORDER_CANCEL: 'order:cancel',
  ORDER_EXPORT: 'order:export',

  // Customer management
  CUSTOMER_VIEW: 'customer:view',
  CUSTOMER_UPDATE: 'customer:update',

  // Inventory management
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_UPDATE: 'inventory:update',

  // Reports
  REPORT_VIEW: 'report:view',

  // Admin user management
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DISABLE: 'user:disable',

  // Role management
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',

  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',

  // Audit
  AUDIT_VIEW: 'audit:view',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_GROUPS: Record<string, { label: string; permissions: Permission[] }> = {
  products: {
    label: 'Product Management',
    permissions: [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_ARCHIVE,
    ],
  },
  categories: {
    label: 'Category Management',
    permissions: [
      PERMISSIONS.CATEGORY_VIEW,
      PERMISSIONS.CATEGORY_CREATE,
      PERMISSIONS.CATEGORY_UPDATE,
    ],
  },
  orders: {
    label: 'Order Management',
    permissions: [
      PERMISSIONS.ORDER_VIEW,
      PERMISSIONS.ORDER_UPDATE,
      PERMISSIONS.ORDER_CANCEL,
      PERMISSIONS.ORDER_EXPORT,
    ],
  },
  customers: {
    label: 'Customer Management',
    permissions: [PERMISSIONS.CUSTOMER_VIEW, PERMISSIONS.CUSTOMER_UPDATE],
  },
  inventory: {
    label: 'Inventory Management',
    permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_UPDATE],
  },
  reports: {
    label: 'Reports',
    permissions: [PERMISSIONS.REPORT_VIEW],
  },
  users: {
    label: 'User Management',
    permissions: [
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DISABLE,
    ],
  },
  roles: {
    label: 'Role Management',
    permissions: [
      PERMISSIONS.ROLE_VIEW,
      PERMISSIONS.ROLE_CREATE,
      PERMISSIONS.ROLE_UPDATE,
    ],
  },
  settings: {
    label: 'Settings',
    permissions: [PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_UPDATE],
  },
  dashboard: {
    label: 'Dashboard',
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
  audit: {
    label: 'Audit',
    permissions: [PERMISSIONS.AUDIT_VIEW],
  },
};

export const DEFAULT_ROLES = {
  superAdmin: {
    name: 'Super Admin',
    slug: 'super-admin',
    description: 'Full system access',
    permissions: ALL_PERMISSIONS,
    isSystem: true,
  },
  orderManager: {
    name: 'Order Manager',
    slug: 'order-manager',
    description: 'Manage orders and view customers',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.ORDER_VIEW,
      PERMISSIONS.ORDER_UPDATE,
      PERMISSIONS.ORDER_CANCEL,
      PERMISSIONS.ORDER_EXPORT,
      PERMISSIONS.CUSTOMER_VIEW,
      PERMISSIONS.INVENTORY_VIEW,
    ],
    isSystem: true,
  },
  productManager: {
    name: 'Product Manager',
    slug: 'product-manager',
    description: 'Manage products, categories, and inventory',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_ARCHIVE,
      PERMISSIONS.CATEGORY_VIEW,
      PERMISSIONS.CATEGORY_CREATE,
      PERMISSIONS.CATEGORY_UPDATE,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.INVENTORY_UPDATE,
    ],
    isSystem: true,
  },
  customerService: {
    name: 'Customer Service',
    slug: 'customer-service',
    description: 'View orders, manage customers',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.ORDER_VIEW,
      PERMISSIONS.ORDER_UPDATE,
      PERMISSIONS.CUSTOMER_VIEW,
      PERMISSIONS.CUSTOMER_UPDATE,
    ],
    isSystem: true,
  },
  inventoryManager: {
    name: 'Inventory Manager',
    slug: 'inventory-manager',
    description: 'Manage inventory and view products',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.INVENTORY_UPDATE,
    ],
    isSystem: true,
  },
};
