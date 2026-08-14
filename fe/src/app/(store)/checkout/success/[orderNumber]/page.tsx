'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Truck, ShoppingBag, ArrowRight, Printer } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
      
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xl animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Order Placed Successfully!
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Thank You for Shopping with Us! 🎉
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
          Your Cash on Delivery order has been received and is being prepared with care. We will contact you on your phone before shipping.
        </p>
      </div>

      {/* Order Number Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md max-w-md mx-auto space-y-3 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs text-slate-500 font-medium">Order Number:</span>
          <span className="font-mono font-extrabold text-slate-900 text-lg text-rose-600">
            #{orderNumber}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Payment Method:</span>
          <span className="font-bold text-slate-800">Cash on Delivery (COD)</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Status:</span>
          <span className="font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">New Order</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={`/orders/track?orderNumber=${orderNumber}`}
          className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-7 py-3.5 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>

        <Link
          href="/products"
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-7 py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

    </div>
  );
}
