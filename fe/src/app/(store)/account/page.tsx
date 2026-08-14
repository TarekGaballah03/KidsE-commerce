'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { formatPrice, formatDate } from '../../../lib/utils';
import { Order } from '../../../types';
import { User, LogOut, Package, MapPin, Truck, ChevronRight } from 'lucide-react';

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
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-3">Loading profile...</p>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="py-8 lg:py-12 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
      
      {/* Account Info Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-2xl">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{customer.name}</h1>
            <p className="text-xs text-slate-500">{customer.phone} {customer.email && `• ${customer.email}`}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Package className="w-5 h-5 text-rose-500" /> My Order History ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-500">You haven't placed any orders yet.</p>
            <Link href="/products" className="inline-block bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-rose-600">#{ord.orderNumber}</span>
                    <span className="text-xs text-slate-400 block sm:inline sm:ml-3">
                      Placed on {formatDate(ord.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full">
                      {ord.orderStatus}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{formatPrice(ord.grandTotal)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {ord.items.length} item(s) • Ship to: {ord.shippingAddress.governorate}, {ord.shippingAddress.city}
                  </span>
                  <Link
                    href={`/orders/track?orderNumber=${ord.orderNumber}&phone=${customer.phone}`}
                    className="font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" /> Track Live
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
