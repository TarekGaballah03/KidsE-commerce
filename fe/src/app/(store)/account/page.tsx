'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { formatPrice, formatDate } from '../../../lib/utils';
import { Order } from '../../../types';
import { LogOut, Package, Truck } from 'lucide-react';

export default function CustomerAccountDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccountData() {
      setLoading(true);
      try {
        const me = await apiFetch('/auth/customer/me');
        setCustomer(me);

        const myOrders = await apiFetch<Order[]>('/orders/my-orders');
        setOrders(myOrders || []);
      } catch (err) {
        console.error('Not logged in:', err);
        router.push('/account/login');
      } finally {
        setLoading(false);
      }
    }
    loadAccountData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    router.push('/');
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#5e5f5c] mt-3 font-semibold uppercase tracking-widest">Loading client profile...</p>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 bg-[#fdf8f8]">
      
      {/* Account Info Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-serif text-2xl font-bold">
            {customer.name.charAt(0)}
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#5e5f5c] font-semibold block">Private Member</span>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">{customer.name}</h1>
            <p className="text-xs text-[#5e5f5c] font-mono">{customer.phone} {customer.email && `• ${customer.email}`}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg border border-[#e5e2e1] transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1a1a1a] tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-[#1a1a1a]" /> Order & Dispatch History ({orders.length})
            </h2>
            <p className="text-xs text-[#5e5f5c]">Track current deliveries and past purchases</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-dashed border-[#e5e2e1] text-center space-y-4">
            <p className="text-xs text-[#5e5f5c]">You haven't placed any acquisitions with Swan yet.</p>
            <Link href="/products" className="inline-block bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest px-8 py-3 rounded-lg transition-colors">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord._id} className="bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e5e2e1] pb-3 gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#1a1a1a]">#{ord.orderNumber}</span>
                    <span className="text-xs text-[#5e5f5c] block sm:inline sm:ml-3">
                      Placed on {formatDate(ord.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold bg-[#f1edec] text-[#1a1a1a] px-3 py-0.5 rounded-full border border-[#e5e2e1]">
                      {ord.orderStatus}
                    </span>
                    <span className="text-sm font-serif font-bold text-[#1a1a1a]">{formatPrice(ord.grandTotal)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5e5f5c]">
                    {ord.items.length} garment(s) • Destination: {ord.shippingAddress.governorate}, {ord.shippingAddress.city}
                  </span>
                  <Link
                    href={`/orders/track?orderNumber=${ord.orderNumber}&phone=${customer.phone}`}
                    className="font-semibold text-[#1a1a1a] underline hover:opacity-75 flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" /> Track Dispatch
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

