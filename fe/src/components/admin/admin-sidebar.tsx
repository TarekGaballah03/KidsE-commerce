'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Warehouse,
  Users,
  BarChart3,
  UserCheck,
  ShieldAlert,
  Settings,
  Store,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Admin Users', href: '/admin/users', icon: UserCheck },
  { name: 'Roles & Permissions', href: '/admin/roles', icon: ShieldAlert },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#f1edec] text-[#1c1b1b] min-h-screen border-r border-[#e5e2e1] flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header matching Stitch Swan Admin */}
        <div className="p-6 border-b border-[#e5e2e1]/70">
          <h1 className="font-serif text-xl font-bold text-[#1a1a1a] tracking-tight">
            Swan Workspace
          </h1>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#5e5f5c] mt-1 block">
            Administration
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 text-xs font-semibold">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#e5e2e1] text-[#1a1a1a] font-bold shadow-2xs'
                    : 'text-[#5e5f5c] hover:text-[#1a1a1a] hover:bg-[#ebe7e6]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Storefront Link */}
      <div className="p-4 border-t border-[#e5e2e1]/70">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white hover:bg-[#ebe7e6] border border-[#e5e2e1] text-[#1a1a1a] text-xs font-semibold transition-colors"
        >
          <Store className="w-4 h-4 text-[#5e5f5c]" />
          <span>View Live Boutique</span>
        </Link>
      </div>
    </aside>
  );
}

