'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import { Lock, Phone, ArrowRight } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail || !password) {
      setErrorMsg('Please enter both Phone/Email and Password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await apiFetch('/auth/customer/login', {
        method: 'POST',
        body: JSON.stringify({ phoneOrEmail, password }),
      });
      router.push('/account');
    } catch (err: any) {
      console.error('Customer login failed:', err);
      setErrorMsg(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 max-w-md mx-auto px-4 sm:px-6">
      <div className="bg-white p-8 sm:p-10 rounded-lg border border-[#e5e2e1] shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#5e5f5c] font-semibold">Clientele Access</span>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a] tracking-tight">Sign In</h1>
          <p className="text-xs text-[#5e5f5c]">Access your orders, bespoke preferences & concierge history</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-md bg-[#ffdad6]/50 border border-[#ba1a1a]/30 text-[#ba1a1a] text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Phone Number or Email</label>
            <input
              type="text"
              placeholder="0100 000 0000"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest py-3.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#e5e2e1] text-center text-xs text-[#5e5f5c]">
          <span>New to Swan? </span>
          <Link href="/account/register" className="font-semibold text-[#1a1a1a] underline hover:opacity-75">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

