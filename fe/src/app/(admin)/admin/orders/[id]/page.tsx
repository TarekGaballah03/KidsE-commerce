'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../../../lib/api';
import { formatPrice, formatDate } from '../../../../../lib/utils';
import { Order } from '../../../../../types';
import { ArrowLeft, Truck, Clock, CheckCircle2, MessageSquare, Printer, ShieldCheck } from 'lucide-react';

const STATUS_OPTIONS = [
  'New',
  'Pending Confirmation',
  'Confirmed',
  'Preparing',
  'Ready for Shipping',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Failed Delivery',
  'Returned',
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [newInternalNote, setNewInternalNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const data = await apiFetch<Order>(`/orders/${id}`);
        setOrder(data);
        setNewStatus(data.orderStatus);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadOrder();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus || newStatus === order?.orderStatus) return;

    setUpdatingStatus(true);
    try {
      const updated = await apiFetch<Order>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, notes: statusNotes }),
      });
      setOrder(updated);
      setStatusNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalNote.trim()) return;

    setAddingNote(true);
    try {
      const updated = await apiFetch<Order>(`/orders/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note: newInternalNote }),
      });
      setOrder(updated);
      setNewInternalNote('');
    } catch (err: any) {
      alert(err.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-3 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link href="/admin/orders" className="text-xs font-bold text-rose-600 hover:underline">
          Return to Orders List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 font-mono">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-slate-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Order Info & Items */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                Customer Information
              </h3>
              <p className="font-bold text-slate-900 text-sm">{order.customerInfo.name}</p>
              <p className="text-xs text-slate-600">📞 Phone: <strong>{order.customerInfo.phone}</strong></p>
              {order.customerInfo.altPhone && (
                <p className="text-xs text-slate-600">📞 Alt Phone: {order.customerInfo.altPhone}</p>
              )}
              {order.customerInfo.email && (
                <p className="text-xs text-slate-600">✉️ Email: {order.customerInfo.email}</p>
              )}
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                Shipping Address
              </h3>
              <p className="font-bold text-slate-900 text-sm">
                {order.shippingAddress.governorate}, {order.shippingAddress.city}
              </p>
              <p className="text-xs text-slate-600">{order.shippingAddress.address}</p>
              {order.shippingAddress.buildingApt && (
                <p className="text-xs text-slate-500">Building/Apt: {order.shippingAddress.buildingApt}</p>
              )}
              {order.shippingAddress.landmark && (
                <p className="text-xs text-slate-500">Landmark: {order.shippingAddress.landmark}</p>
              )}
            </div>
          </div>

          {/* Items Snapshot Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
              Purchased Items Snapshot ({order.items.length})
            </div>

            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Attributes</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-4 font-bold text-slate-900">{item.productName}</td>
                    <td className="p-4 font-mono text-slate-500">{item.sku}</td>
                    <td className="p-4">
                      Size: {item.attributes?.size} • Color: {item.attributes?.color}
                    </td>
                    <td className="p-4">{formatPrice(item.unitPrice)}</td>
                    <td className="p-4 font-bold">{item.quantity}</td>
                    <td className="p-4 font-extrabold text-slate-900 text-right">{formatPrice(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Summary */}
            <div className="p-5 bg-slate-50/60 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-slate-900">{formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-200">
                <span>Grand Total (Cash on Delivery)</span>
                <span className="text-rose-600">{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline Log */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" /> Order Activity Timeline
            </h3>

            <div className="space-y-3">
              {order.timeline.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{entry.status}</span>
                      <span className="text-[11px] text-slate-400">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{entry.notes}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">Performed by: {entry.employeeName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Status Update & Internal Notes Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status Update Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Update Order Status</h3>

            <form onSubmit={handleUpdateStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Confirmed phone call with customer"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus || newStatus === order.orderStatus}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors"
              >
                {updatingStatus ? 'Updating Status...' : 'Save Status Change'}
              </button>
            </form>
          </div>

          {/* Internal Notes Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" /> Internal Employee Note
            </h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Internal staff notes (e.g. Customer requested morning delivery)..."
                value={newInternalNote}
                onChange={(e) => setNewInternalNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-300"
              />

              <button
                type="submit"
                disabled={addingNote || !newInternalNote.trim()}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                {addingNote ? 'Adding Note...' : 'Add Note'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
