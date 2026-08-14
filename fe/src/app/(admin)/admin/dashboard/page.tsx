'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/api';
import { formatPrice, formatDate } from '../../../../lib/utils';
import { Order } from '../../../../types';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Eye,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const [dateRange, setDateRange] = useState('30days');
  const [kpis, setKpis] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [kpiRes, orderRes] = await Promise.all([
          apiFetch(`/reports/kpis?dateRange=${dateRange}`),
          apiFetch('/orders/admin/list?limit=5'),
        ]);
        setKpis(kpiRes);
        setRecentOrders(orderRes.items || orderRes.data || orderRes || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-3 font-medium">Calculating store metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time performance metrics and Cash on Delivery order velocity.</p>
        </div>

        {/* Date Filter */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 shadow-2xs focus:ring-2 focus:ring-rose-400"
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* KPI Cards Grid */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Revenue */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">
              {formatPrice(kpis.totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Delivered COD orders
            </span>
          </div>

          {/* Orders */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Total Orders</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">
              {kpis.totalOrders}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {kpis.newOrders} New • {kpis.deliveredOrders} Delivered
            </span>
          </div>

          {/* Average Order Value */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Avg Order Value</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">
              {formatPrice(kpis.avgOrderValue)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Per completed delivery</span>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Low Stock Alerts</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">
              {kpis.lowStockItemsCount}
            </span>
            <Link href="/admin/inventory?lowStock=true" className="text-[11px] font-bold text-amber-600 hover:underline">
              View inventory details →
            </Link>
          </div>
        </div>
      )}

      {/* Orders Breakdown Pills */}
      {kpis && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Order Status Velocity Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100">
              <span className="text-xl font-extrabold text-sky-700 block">{kpis.newOrders}</span>
              <span className="text-xs font-bold text-sky-800">New Orders</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-xl font-extrabold text-emerald-700 block">{kpis.deliveredOrders}</span>
              <span className="text-xs font-bold text-emerald-800">Delivered</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
              <span className="text-xl font-extrabold text-rose-700 block">{kpis.cancelledOrders}</span>
              <span className="text-xs font-bold text-rose-800">Cancelled ({kpis.cancellationRate}%)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-xl font-extrabold text-amber-700 block">{kpis.returnedOrders}</span>
              <span className="text-xs font-bold text-amber-800">Returned / Failed</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Recent Orders</h3>
          <Link href="/admin/orders" className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1">
            <span>View All Orders</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Governorate</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">No orders found.</td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-rose-600">#{ord.orderNumber}</td>
                    <td className="p-4 font-bold text-slate-900">{ord.customerInfo.name}</td>
                    <td className="p-4 text-slate-600">{ord.customerInfo.phone}</td>
                    <td className="p-4">{ord.shippingAddress.governorate}</td>
                    <td className="p-4 font-extrabold text-slate-900">{formatPrice(ord.grandTotal)}</td>
                    <td className="p-4">
                      <span className="bg-sky-50 text-sky-700 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
