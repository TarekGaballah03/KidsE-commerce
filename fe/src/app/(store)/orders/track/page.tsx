'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import { formatPrice, formatDate } from '../../../../lib/utils';
import { Order } from '../../../../types';
import { Search, Truck, CheckCircle2, Clock } from 'lucide-react';

const STATUS_STEPS = [
  'New',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber || !phone) {
      setErrorMsg('Please enter both Order Number and Phone Number');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiFetch(`/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      setOrder(res);
    } catch (err: any) {
      console.error('Failed to track order:', err);
      setOrder(null);
      setErrorMsg(err.message || 'No order found with provided Order Number and Phone.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      handleSearch();
    }
  }, [initialOrderNumber, initialPhone]);

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.orderStatus) : -1;

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Live Order Status
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Delivery 🚚
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Enter your Order Number (e.g. ORD-501923) and Main Phone Number to view live shipping status.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Order Number</label>
              <input
                type="text"
                placeholder="ORD-1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="0100 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-rose-500 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-rose-600">#{order.orderNumber}</span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Customer: {order.customerInfo.name}
              </h2>
              <p className="text-xs text-slate-400">Placed on {formatDate(order.createdAt)}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-sky-50 text-sky-700 border border-sky-200 text-xs font-extrabold px-3 py-1 rounded-full">
                Status: {order.orderStatus}
              </span>
              <p className="text-xs font-bold text-slate-900 mt-1">Total: {formatPrice(order.grandTotal)} (COD)</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-6">Delivery Progress</h3>

            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="flex sm:flex-col items-center gap-3 sm:gap-2 z-10 flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <span className={`text-xs font-bold ${isCurrent ? 'text-rose-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {order.timeline && order.timeline.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Status Updates Timeline</h3>
              <div className="space-y-2.5">
                {order.timeline.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Clock className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <strong className="text-slate-800">{entry.status}</strong>
                        <span className="text-[11px] text-slate-400">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{entry.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading tracker...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
