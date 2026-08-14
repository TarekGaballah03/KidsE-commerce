'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../../../lib/use-cart-store';
import { apiFetch } from '../../../lib/api';
import { formatPrice } from '../../../lib/utils';
import { ShippingZone } from '../../../types';
import { ShieldCheck, Truck, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Full Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  altPhone: z.string().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  governorate: z.string().min(1, 'Please select your Governorate'),
  city: z.string().min(2, 'City / Area is required'),
  address: z.string().min(5, 'Street address is required'),
  buildingApt: z.string().optional(),
  landmark: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart, freeShippingThreshold } = useCartStore();

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [selectedFee, setSelectedFee] = useState<number>(70);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = getSubtotal();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      governorate: 'Cairo',
      city: '',
      address: '',
      buildingApt: '',
      landmark: '',
      notes: '',
    },
  });

  const selectedGov = watch('governorate');

  useEffect(() => {
    async function loadShippingZones() {
      try {
        const zones = await apiFetch<ShippingZone[]>('/settings/shipping-zones');
        setShippingZones(zones || []);
      } catch (err) {
        console.error('Failed loading shipping zones:', err);
      }
    }
    loadShippingZones();
  }, []);

  useEffect(() => {
    if (selectedGov && shippingZones.length > 0) {
      const match = shippingZones.find((z) => z.governorate.toLowerCase() === selectedGov.toLowerCase());
      setSelectedFee(match ? match.fee : 75);
    }
  }, [selectedGov, shippingZones]);

  const shippingFee = subtotal >= freeShippingThreshold ? 0 : selectedFee;
  const grandTotal = subtotal + shippingFee;

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        customerInfo: {
          name: data.name,
          phone: data.phone,
          altPhone: data.altPhone || '',
          email: data.email || '',
        },
        shippingAddress: {
          governorate: data.governorate,
          city: data.city,
          address: data.address,
          buildingApt: data.buildingApt || '',
          landmark: data.landmark || '',
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        notes: data.notes || '',
      };

      const order = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      clearCart();
      router.push(`/checkout/success/${order.orderNumber}`);
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link href="/products" className="inline-block bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
        <Link href="/products" className="text-xs font-bold text-slate-500 hover:text-rose-500 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Cash on Delivery Guarantee
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Customer & Address Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">1. Customer Information</h3>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  {...register('name')}
                  placeholder="e.g. Salma El-Sayed"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Phone Number *</label>
                <input
                  {...register('phone')}
                  placeholder="0100 000 0000"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alternative Phone (Optional)</label>
                <input
                  {...register('altPhone')}
                  placeholder="Secondary contact phone"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                <input
                  {...register('email')}
                  placeholder="for digital receipt"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">2. Delivery Address (Egypt)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Governorate *</label>
                <select
                  {...register('governorate')}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                >
                  <option value="Cairo">Cairo (70 EGP)</option>
                  <option value="Giza">Giza (70 EGP)</option>
                  <option value="Alexandria">Alexandria (75 EGP)</option>
                  <option value="Qalyubia">Qalyubia (75 EGP)</option>
                  <option value="Sharqia">Sharqia (80 EGP)</option>
                  <option value="Dakahlia">Dakahlia (80 EGP)</option>
                  <option value="Beheira">Beheira (80 EGP)</option>
                  <option value="Gharbia">Gharbia (80 EGP)</option>
                  <option value="Monufia">Monufia (80 EGP)</option>
                  <option value="Suez">Suez (85 EGP)</option>
                  <option value="Ismailia">Ismailia (85 EGP)</option>
                  <option value="Port Said">Port Said (85 EGP)</option>
                  <option value="Other">Other Governorate (100 EGP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Area *</label>
                <input
                  {...register('city')}
                  placeholder="e.g. Maadi, Tagamoa, Smouha"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
                />
                {errors.city && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.city.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                <input
                  {...register('address')}
                  placeholder="Street name, house number, area details"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
                />
                {errors.address && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Building / Apt (Optional)</label>
                <input
                  {...register('buildingApt')}
                  placeholder="Bldg 12, Apt 4B"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Landmark (Optional)</label>
                <input
                  {...register('landmark')}
                  placeholder="Near Metro Station, opposite park"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Order Notes (Optional)</label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Special delivery instructions, preferable time..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300 focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-amber-50/80 p-5 rounded-3xl border border-amber-200/80 space-y-2">
            <h3 className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" /> Payment Method: Cash on Delivery (COD)
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              No online card needed! Pay in cash directly to the courier driver upon inspecting your package at your doorstep.
            </p>
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
              Order Summary ({items.length} items)
            </h3>

            {/* Item List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      Size: {item.size} • Color: {item.color.name} • Qty: {item.quantity}
                    </p>
                    <span className="font-extrabold text-slate-900 text-xs">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({selectedGov})</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-base pt-3 border-t border-slate-100">
                <span>Grand Total</span>
                <span className="text-rose-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Cash on Delivery Order</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
