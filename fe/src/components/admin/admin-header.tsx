'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { LogOut } from 'lucide-react';

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
    <header className="bg-[#fdf8f8] border-b border-[#e5e2e1] px-8 py-3.5 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-sm font-bold text-[#1a1a1a]">Swan Operations Command</h2>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block">
              <span className="block font-semibold text-xs text-[#1a1a1a]">{user.name}</span>
              <span className="text-[10px] uppercase font-bold text-[#5e5f5c] bg-[#f1edec] px-2 py-0.5 rounded-full inline-block">
                {user.role?.name || 'Administrator'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-[#5e5f5c] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

