'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../../../lib/api';
import { formatPrice, formatDate } from '../../../../../lib/utils';
import { Order } from '../../../../../types';
import { ArrowLeft, Clock, CheckCircle2, MessageSquare, Printer } from 'lucide-react';

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
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#5e5f5c] mt-3 font-semibold uppercase tracking-widest">Loading order dossier...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center space-y-3">
        <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Order Record Not Found</h2>
        <Link href="/admin/orders" className="text-xs uppercase tracking-widest font-semibold text-[#1a1a1a] underline">
          Return to Orders Roster
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e2e1]">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-md bg-white border border-[#e5e2e1] text-[#1a1a1a] hover:bg-[#f1edec] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1a1a1a]">
              Dispatch #{order.orderNumber}
            </h1>
            <p className="text-xs text-[#5e5f5c]">Placed on {formatDate(order.createdAt)} • Status: <strong className="text-[#1a1a1a]">{order.orderStatus}</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="bg-white border border-[#e5e2e1] text-[#1a1a1a] hover:bg-[#f1edec] font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Commercial Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Order Info & Items */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-[#5e5f5c]">
                Client Profile
              </h3>
              <p className="font-serif font-bold text-[#1a1a1a] text-base">{order.customerInfo.name}</p>
              <p className="text-xs text-[#5e5f5c]">Phone: <strong className="text-[#1a1a1a] font-mono">{order.customerInfo.phone}</strong></p>
              {order.customerInfo.altPhone && (
                <p className="text-xs text-[#5e5f5c]">Alt Phone: <span className="font-mono">{order.customerInfo.altPhone}</span></p>
              )}
              {order.customerInfo.email && (
                <p className="text-xs text-[#5e5f5c]">Email: {order.customerInfo.email}</p>
              )}
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-[#5e5f5c]">
                Delivery Destination
              </h3>
              <p className="font-serif font-bold text-[#1a1a1a] text-base">
                {order.shippingAddress.governorate}, {order.shippingAddress.city}
              </p>
              <p className="text-xs text-[#5e5f5c]">{order.shippingAddress.address}</p>
              {order.shippingAddress.buildingApt && (
                <p className="text-xs text-[#5e5f5c]">Building / Suite: {order.shippingAddress.buildingApt}</p>
              )}
              {order.shippingAddress.landmark && (
                <p className="text-xs text-[#5e5f5c]">Landmark: {order.shippingAddress.landmark}</p>
              )}
            </div>
          </div>

          {/* Items Snapshot Table */}
          <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#e5e2e1] font-serif font-bold text-[#1a1a1a] text-base">
              Purchased Garments ({order.items.length})
            </div>

            <table className="w-full text-xs text-left text-[#1c1b1b]">
              <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
                <tr>
                  <th className="p-4">Garment</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Attributes</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2e1]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#fdf8f8]">
                    <td className="p-4 font-serif font-semibold text-[#1a1a1a]">{item.productName}</td>
                    <td className="p-4 font-mono text-[#5e5f5c]">{item.sku}</td>
                    <td className="p-4 text-[#5e5f5c]">
                      Size: <span className="font-semibold text-[#1a1a1a]">{item.attributes?.size}</span> • Color: <span className="font-semibold text-[#1a1a1a]">{item.attributes?.color}</span>
                    </td>
                    <td className="p-4 font-serif">{formatPrice(item.unitPrice)}</td>
                    <td className="p-4 font-semibold text-[#1a1a1a]">{item.quantity}</td>
                    <td className="p-4 font-serif font-bold text-[#1a1a1a] text-right">{formatPrice(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Summary */}
            <div className="p-5 bg-[#f7f3f2] border-t border-[#e5e2e1] space-y-2 text-xs text-[#5e5f5c]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif font-bold text-[#1a1a1a]">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Tariff</span>
                <span className="font-serif font-bold text-[#1a1a1a]">{formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-[#1a1a1a] font-serif font-bold text-base pt-3 border-t border-[#e5e2e1]">
                <span>Total Amount Due (COD)</span>
                <span>{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline Log */}
          <div className="bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1a1a1a]" /> Dispatch Activity Audit Log
            </h3>

            <div className="space-y-3">
              {order.timeline.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-md bg-[#f7f3f2] border border-[#e5e2e1] text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1a1a1a]">{entry.status}</span>
                      <span className="text-[11px] text-[#5e5f5c]">{formatDate(entry.timestamp)}</span>
                    </div>
                    {entry.notes && <p className="text-[#5e5f5c] text-xs mt-0.5">{entry.notes}</p>}
                    <span className="text-[10px] text-[#5e5f5c] block mt-1">Operator: {entry.employeeName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Status Update & Internal Notes Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status Update Form */}
          <div className="bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-base">Fulfillment Pipeline State</h3>

            <form onSubmit={handleUpdateStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Change Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Status Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Courier handed package in Heliopolis hub"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus || newStatus === order.orderStatus}
                className="w-full bg-[#1a1a1a] hover:bg-[#000000] disabled:opacity-40 text-white font-semibold text-xs uppercase tracking-widest py-3 rounded-lg shadow-xs transition-colors"
              >
                {updatingStatus ? 'Updating Status...' : 'Apply Status Transition'}
              </button>
            </form>
          </div>

          {/* Internal Notes Form */}
          <div className="bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#1a1a1a]" /> Concierge Note
            </h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Internal staff notes (e.g. Client requested gift packaging)..."
                value={newInternalNote}
                onChange={(e) => setNewInternalNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
              />

              <button
                type="submit"
                disabled={addingNote || !newInternalNote.trim()}
                className="w-full bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a] border border-[#e5e2e1] font-semibold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors"
              >
                {addingNote ? 'Appending Note...' : 'Record Note'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

