'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both Email and Password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await apiFetch('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-[#e5e2e1] p-8 sm:p-10 rounded-lg shadow-sm space-y-6 text-[#1c1b1b]">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center font-serif text-3xl font-bold tracking-tight text-[#1a1a1a]">
          Swan
        </div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#5e5f5c] font-semibold">Operations Command Portal</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-md bg-[#ffdad6]/50 border border-[#ba1a1a]/30 text-[#ba1a1a] text-xs font-semibold text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Staff Email</label>
          <div className="relative">
            <input
              type="email"
              placeholder="admin@kidsfashion.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] text-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white"
            />
            <Mail className="w-4 h-4 text-[#5e5f5c] absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Security Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] text-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white"
            />
            <Lock className="w-4 h-4 text-[#5e5f5c] absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest py-3.5 rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Enter</span>
            </>
          )}
        </button>
      </form>

      <div className="p-3 bg-[#f7f3f2] rounded-md text-[11px] text-[#5e5f5c] text-center border border-[#e5e2e1]">
        Staff Demo: <span className="text-[#1a1a1a] font-mono font-semibold">admin@kidsfashion.com / Admin@123456</span>
      </div>
    </div>
  );
}

