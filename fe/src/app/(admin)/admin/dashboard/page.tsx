'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/api';
import { formatPrice, formatDate } from '../../../../lib/utils';
import { Order } from '../../../../types';
import {
  DollarSign,
  ShoppingBag,
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
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#5e5f5c] mt-3 font-semibold uppercase tracking-widest">Aggregating workspace telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Executive Summary</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Performance Overview</h1>
          <p className="text-xs text-[#5e5f5c] mt-0.5">Real-time metrics, cash flows, and order fulfillment velocity.</p>
        </div>

        {/* Date Filter */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-xs font-semibold bg-white border border-[#e5e2e1] rounded-lg px-3.5 py-2 text-[#1a1a1a] shadow-xs focus:ring-1 focus:ring-[#1a1a1a]"
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
          <div className="bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#5e5f5c] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Total Revenue</span>
              <div className="w-8 h-8 rounded-md bg-[#f1edec] text-[#1a1a1a] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] block">
              {formatPrice(kpis.totalRevenue)}
            </span>
            <span className="text-[11px] text-[#5e5f5c] font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#1a1a1a]" /> Settled COD & Online Orders
            </span>
          </div>

          {/* Orders */}
          <div className="bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#5e5f5c] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Total Orders</span>
              <div className="w-8 h-8 rounded-md bg-[#f1edec] text-[#1a1a1a] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] block">
              {kpis.totalOrders}
            </span>
            <span className="text-[11px] text-[#5e5f5c]">
              {kpis.newOrders} Pending • {kpis.deliveredOrders} Delivered
            </span>
          </div>

          {/* Average Order Value */}
          <div className="bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#5e5f5c] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Avg Basket Size</span>
              <div className="w-8 h-8 rounded-md bg-[#f1edec] text-[#1a1a1a] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] block">
              {formatPrice(kpis.avgOrderValue)}
            </span>
            <span className="text-[11px] text-[#5e5f5c]">Per fulfilled transaction</span>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white p-6 rounded-lg border border-[#e5e2e1] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#5e5f5c] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Stock Replenishment</span>
              <div className="w-8 h-8 rounded-md bg-[#ffdad6]/50 text-[#ba1a1a] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] block">
              {kpis.lowStockItemsCount}
            </span>
            <Link href="/admin/inventory?lowStock=true" className="text-[11px] font-semibold text-[#1a1a1a] underline hover:opacity-75">
              Review low stock inventory →
            </Link>
          </div>
        </div>
      )}

      {/* Orders Breakdown */}
      {kpis && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-[#1a1a1a] text-base">Fulfillment Pipeline Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-md bg-[#f7f3f2] border border-[#e5e2e1]">
              <span className="font-serif text-2xl font-bold text-[#1a1a1a] block">{kpis.newOrders}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5f5c]">New Placed</span>
            </div>
            <div className="p-4 rounded-md bg-[#f7f3f2] border border-[#e5e2e1]">
              <span className="font-serif text-2xl font-bold text-[#1a1a1a] block">{kpis.deliveredOrders}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5f5c]">Delivered</span>
            </div>
            <div className="p-4 rounded-md bg-[#f7f3f2] border border-[#e5e2e1]">
              <span className="font-serif text-2xl font-bold text-[#ba1a1a] block">{kpis.cancelledOrders}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5f5c]">Cancelled ({kpis.cancellationRate}%)</span>
            </div>
            <div className="p-4 rounded-md bg-[#f7f3f2] border border-[#e5e2e1]">
              <span className="font-serif text-2xl font-bold text-[#1a1a1a] block">{kpis.returnedOrders}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5f5c]">Exchanged / Return</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#e5e2e1] flex items-center justify-between">
          <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">Recent Transactions</h3>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#1a1a1a] underline hover:opacity-75 flex items-center gap-1">
            <span>View All Orders</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#1c1b1b]">
            <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
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
            <tbody className="divide-y divide-[#e5e2e1]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#5e5f5c]">No recent orders logged.</td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#fdf8f8] transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#1a1a1a]">#{ord.orderNumber}</td>
                    <td className="p-4 font-semibold text-[#1a1a1a]">{ord.customerInfo.name}</td>
                    <td className="p-4 text-[#5e5f5c]">{ord.customerInfo.phone}</td>
                    <td className="p-4">{ord.shippingAddress.governorate}</td>
                    <td className="p-4 font-serif font-bold text-[#1a1a1a]">{formatPrice(ord.grandTotal)}</td>
                    <td className="p-4">
                      <span className="bg-[#f1edec] text-[#1a1a1a] font-semibold px-2.5 py-1 rounded-full text-[11px] border border-[#e5e2e1]">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a1a1a] hover:bg-[#ebe7e6] bg-[#f1edec] px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
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

