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
      setErrorMsg('Your shopping bag is empty');
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
      <div className="py-24 max-w-md mx-auto text-center space-y-4 px-6 bg-[#fdf8f8]">
        <div className="w-14 h-14 rounded-full bg-[#f1edec] text-[#5e5f5c] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">Your bag is empty</h2>
        <p className="text-xs text-[#5e5f5c]">Select items from our collection before proceeding to checkout.</p>
        <Link href="/products" className="inline-block bg-[#1a1a1a] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-lg">
          Explore Outfits
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 lg:py-16 max-w-7xl mx-auto px-6 sm:px-12 bg-[#fdf8f8]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#e5e2e1]">
        <Link href="/products" className="text-xs uppercase tracking-widest font-semibold text-[#5e5f5c] hover:text-[#1a1a1a] flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Collection
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1a1a1a] bg-[#ebe7e6] px-3.5 py-1.5 rounded-full border border-[#c4c7c7]/40">
          <ShieldCheck className="w-4 h-4 text-[#1a1a1a]" /> Cash on Delivery Available
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Customer & Address Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Customer Info */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs space-y-5">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">1. Client Details</h3>

            {errorMsg && (
              <div className="p-3.5 rounded-md bg-[#ffdad6]/60 border border-[#ba1a1a]/20 text-[#ba1a1a] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Full Name *</label>
                <input
                  {...register('name')}
                  placeholder="e.g. Amina Mansour"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
                {errors.name && <p className="text-[11px] text-[#ba1a1a] mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Phone Number *</label>
                <input
                  {...register('phone')}
                  placeholder="0100 000 0000"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
                {errors.phone && <p className="text-[11px] text-[#ba1a1a] mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Alternative Phone (Optional)</label>
                <input
                  {...register('altPhone')}
                  placeholder="Secondary phone"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Email (Optional)</label>
                <input
                  {...register('email')}
                  placeholder="For digital lookbook receipt"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
                {errors.email && <p className="text-[11px] text-[#ba1a1a] mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs space-y-5">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">2. Delivery Location (Egypt)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Governorate *</label>
                <select
                  {...register('governorate')}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">City / District *</label>
                <input
                  {...register('city')}
                  placeholder="e.g. New Cairo, Zamalek, Smouha"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
                {errors.city && <p className="text-[11px] text-[#ba1a1a] mt-1">{errors.city.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Street Address *</label>
                <input
                  {...register('address')}
                  placeholder="Street name, villa/building number, apartment details"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
                {errors.address && <p className="text-[11px] text-[#ba1a1a] mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Building / Apt (Optional)</label>
                <input
                  {...register('buildingApt')}
                  placeholder="e.g. Villa 14, Apt 2"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Nearby Landmark (Optional)</label>
                <input
                  {...register('landmark')}
                  placeholder="Near Club / Metro station"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Order Notes (Optional)</label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Specific delivery notes or time preferences..."
                className="w-full px-3.5 py-2 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] focus:bg-white text-[#1a1a1a]"
              />
            </div>
          </div>

          {/* Payment Method Option */}
          <div className="bg-[#f7f3f2] p-5 rounded-lg border border-[#e5e2e1] space-y-2">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1a1a1a]" /> Payment: Cash on Delivery (COD)
            </h3>
            <p className="text-xs text-[#5e5f5c] leading-relaxed">
              Pay upon doorstep inspection. Courier drivers carry exact change or accept instant electronic transfers where supported.
            </p>
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs space-y-5 sticky top-28">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg pb-3 border-b border-[#e5e2e1]">
              Order Summary ({items.length} items)
            </h3>

            {/* Item List */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3.5">
                  <div className="w-14 h-16 rounded-md overflow-hidden bg-[#f1edec] border border-[#e5e2e1] shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-semibold text-[#1a1a1a] text-xs truncate">{item.title}</h4>
                    <p className="text-[11px] text-[#5e5f5c] mt-0.5">
                      Size: {item.size} • {item.color.name} • Qty: {item.quantity}
                    </p>
                    <span className="font-serif font-bold text-[#1a1a1a] text-xs">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-[#e5e2e1] text-xs text-[#5e5f5c]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1a1a1a]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({selectedGov})</span>
                <span className="font-semibold text-[#1a1a1a]">
                  {shippingFee === 0 ? <span className="text-[#1a1a1a] font-bold">Complimentary</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#1a1a1a] font-bold text-base pt-3 border-t border-[#e5e2e1]">
                <span className="font-serif">Total</span>
                <span className="font-serif text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#1a1a1a] hover:bg-[#000000] disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Cash on Delivery Order</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

