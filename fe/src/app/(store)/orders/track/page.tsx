'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import { formatPrice, formatDate } from '../../../../lib/utils';
import { Order } from '../../../../types';
import { Search, Truck, CheckCircle2, Clock, Package } from 'lucide-react';

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
    <div className="py-10 lg:py-16 max-w-4xl mx-auto px-6 sm:px-12 bg-[#fdf8f8] space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] uppercase font-semibold tracking-[0.25em] text-[#5e5f5c] block">
          Client Dispatch Center
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight">
          Track Your Delivery
        </h1>
        <p className="text-[#5e5f5c] text-xs sm:text-sm">
          Enter your Order Identifier (e.g. ORD-1001) and Registered Phone Number.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-md bg-[#ffdad6]/60 border border-[#ba1a1a]/20 text-[#ba1a1a] text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Order Number</label>
              <input
                type="text"
                placeholder="ORD-1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-semibold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Phone Number</label>
              <input
                type="text"
                placeholder="0100 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] hover:bg-[#000000] disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-widest py-3.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Locate Dispatch</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e5e2e1] pb-6 gap-4">
            <div>
              <span className="text-xs font-mono font-semibold text-[#5e5f5c]">#{order.orderNumber}</span>
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">
                Client: {order.customerInfo.name}
              </h2>
              <p className="text-xs text-[#747878]">Placed on {formatDate(order.createdAt)}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-[#f1edec] text-[#1a1a1a] border border-[#e5e2e1] text-xs font-semibold px-3.5 py-1.5 rounded-full">
                Status: {order.orderStatus}
              </span>
              <p className="font-serif text-sm font-bold text-[#1a1a1a] mt-1.5">Total: {formatPrice(order.grandTotal)} (COD)</p>
            </div>
          </div>

          {/* Stepper */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-[#5e5f5c] mb-6">Delivery Progress</h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 text-center">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="flex flex-col items-center gap-2 p-3 rounded-md bg-[#fdf8f8] border border-[#e5e2e1]">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                        isCompleted
                          ? 'bg-[#1a1a1a] text-white'
                          : 'bg-[#e5e2e1] text-[#747878]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <span className={`text-[11px] font-semibold ${isCurrent ? 'text-[#1a1a1a] underline' : isCompleted ? 'text-[#1a1a1a]' : 'text-[#747878]'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Item Recap */}
          {order.items && order.items.length > 0 && (
            <div className="pt-6 border-t border-[#e5e2e1] space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-[#5e5f5c]">Parcel Contents</h3>
              <div className="space-y-2">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-md bg-[#f7f3f2] border border-[#e5e2e1] text-xs">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-[#5e5f5c]" />
                      <span className="font-semibold text-[#1a1a1a]">{item.title}</span>
                      <span className="text-[#5e5f5c]">({item.size} • {item.color?.name || ''})</span>
                    </div>
                    <span className="font-serif font-bold text-[#1a1a1a]">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="pt-6 border-t border-[#e5e2e1] space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-[#5e5f5c]">Event Log</h3>
              <div className="space-y-2">
                {order.timeline.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs p-3 rounded-md bg-[#f7f3f2] border border-[#e5e2e1]">
                    <Clock className="w-4 h-4 text-[#1a1a1a] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <strong className="text-[#1a1a1a]">{entry.status}</strong>
                        <span className="text-[11px] text-[#747878]">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-[#5e5f5c] text-[11px] mt-0.5">{entry.notes}</p>
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
    <Suspense fallback={<div className="py-20 text-center text-xs text-[#5e5f5c]">Loading dispatch tracker...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}

