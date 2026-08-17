'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Truck, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  return (
    <div className="py-20 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8 bg-[#fdf8f8]">
      
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5e5f5c] block">
          Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] tracking-tight">
          Thank you for choosing Swan.
        </h1>
        <p className="text-[#5e5f5c] text-sm max-w-lg mx-auto leading-relaxed">
          Your Cash on Delivery acquisition has been recorded. Our atelier concierge will review and verify your dispatch before dispatching via courier.
        </p>
      </div>

      {/* Order Number Box */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs max-w-md mx-auto space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-4">
          <span className="text-xs text-[#5e5f5c] uppercase tracking-wider font-medium">Tracking Reference:</span>
          <span className="font-mono font-bold text-[#1a1a1a] text-lg">
            #{orderNumber}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[#5e5f5c]">Settlement Terms:</span>
          <span className="font-semibold text-[#1a1a1a]">Cash on Delivery (COD)</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[#5e5f5c]">Current State:</span>
          <span className="font-semibold text-[#1a1a1a] bg-[#f1edec] px-3 py-1 rounded-full border border-[#e5e2e1]">Acquisition Placed</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={`/orders/track?orderNumber=${orderNumber}`}
          className="w-full sm:w-auto bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Truck className="w-4 h-4" />
          <span>Track Live Dispatch</span>
        </Link>

        <Link
          href="/products"
          className="w-full sm:w-auto bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a] border border-[#e5e2e1] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Catalog</span>
        </Link>
      </div>

    </div>
  );
}

