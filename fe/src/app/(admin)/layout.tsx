'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '../../components/admin/admin-sidebar';
import { AdminHeader } from '../../components/admin/admin-header';
import { apiFetch } from '../../lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const user = await apiFetch('/auth/admin/me');
        setAdminUser(user);
      } catch (err) {
        console.error('Admin authentication check failed:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#fdf8f8] text-[#1c1b1b] flex items-center justify-center p-4">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f8] text-[#1c1b1b] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#5e5f5c] font-semibold">Verifying workspace access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fdf8f8] text-[#1c1b1b]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={adminUser} />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#fdf8f8]">{children}</main>
      </div>
    </div>
  );
}

