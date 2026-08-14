'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { StoreSettings, ShippingZone } from '../../../../types';
import { Settings as SettingsIcon, Truck, Save, Plus } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingZone, setSavingZone] = useState(false);

  // New Zone Form
  const [govName, setGovName] = useState('');
  const [govFee, setGovFee] = useState(75);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, zRes] = await Promise.all([
        apiFetch<StoreSettings>('/settings'),
        apiFetch<ShippingZone[]>('/settings/shipping-zones'),
      ]);
      setSettings(sRes);
      setShippingZones(zRes || []);
    } catch (err) {
      console.error('Failed loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSavingSettings(true);
    try {
      await apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
      alert('Store settings saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpsertZone = async (governorate: string, fee: number, isActive = true) => {
    try {
      await apiFetch('/settings/shipping-zones', {
        method: 'POST',
        body: JSON.stringify({ governorate, fee: Number(fee), isActive }),
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update shipping zone');
    }
  };

  const handleAddCustomZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govName) return;

    setSavingZone(true);
    try {
      await handleUpsertZone(govName, govFee, true);
      setGovName('');
      setGovFee(75);
    } finally {
      setSavingZone(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-3 font-medium">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Store Settings & Shipping Rates</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure store branding, currency, free shipping rules, and delivery fees per governorate.</p>
      </div>

      {/* Store Identity Settings Form */}
      {settings && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-rose-500" /> Store Branding & Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
              <input
                type="text"
                disabled
                value="EGP (Egyptian Pound)"
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Free Shipping Threshold (EGP) *</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Store Contact Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Instagram Profile URL</label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Store Settings
            </button>
          </div>
        </form>
      )}

      {/* Governorate Shipping Rates Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-500" /> Configurable Shipping Zones & Fees
          </h3>
        </div>

        {/* Custom Zone Form */}
        <form onSubmit={handleAddCustomZone} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <input
            type="text"
            placeholder="Governorate Name"
            value={govName}
            onChange={(e) => setGovName(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
          />
          <input
            type="number"
            placeholder="Fee EGP"
            value={govFee}
            onChange={(e) => setGovFee(Number(e.target.value))}
            className="w-28 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white"
          />
          <button
            type="submit"
            disabled={savingZone}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-1.5 rounded-xl flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add / Update Zone
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {shippingZones.map((z) => (
            <div key={z._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs block">{z.governorate}</span>
                <span className="text-[11px] text-slate-500">Shipping Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={z.fee}
                  onBlur={(e) => handleUpsertZone(z.governorate, Number(e.target.value), z.isActive)}
                  className="w-16 px-2 py-1 text-xs font-extrabold text-rose-600 bg-white rounded-lg border border-slate-300 text-right"
                />
                <span className="text-xs font-bold text-slate-700">EGP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
