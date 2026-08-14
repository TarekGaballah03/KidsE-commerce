'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { LogOut, User, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  user: any;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    router.push('/admin/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-extrabold text-slate-900">Store Administration</h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block">
              <span className="block font-bold text-xs text-slate-900">{user.name}</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                {user.role?.name || 'Admin'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user.name.charAt(0)}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
