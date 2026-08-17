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
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#5e5f5c] mt-3 font-semibold uppercase tracking-widest">Loading configuration parameters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Platform Setup</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Store Settings & Shipping Rates</h1>
        <p className="text-xs text-[#5e5f5c] mt-0.5">Configure store identity, complimentary shipping threshold, and regional delivery tariffs.</p>
      </div>

      {/* Store Identity Settings Form */}
      {settings && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-lg border border-[#e5e2e1] shadow-xs space-y-5">
          <h3 className="font-serif font-bold text-[#1a1a1a] text-base flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-[#1a1a1a]" /> Store Identity & Regional Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Store Title</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Operational Currency</label>
              <input
                type="text"
                disabled
                value="EGP (Egyptian Pound)"
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-md bg-[#f1edec] border border-[#e5e2e1] text-[#5e5f5c]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Complimentary Shipping Threshold (EGP) *</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Concierge Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Instagram Lookbook URL</label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#e5e2e1]">
            <button
              type="submit"
              disabled={savingSettings}
              className="bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Identity Settings
            </button>
          </div>
        </form>
      )}

      {/* Governorate Shipping Rates Table */}
      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-3">
          <h3 className="font-serif font-bold text-[#1a1a1a] text-base flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#1a1a1a]" /> Governorate Shipping Tariffs & Zones
          </h3>
        </div>

        {/* Custom Zone Form */}
        <form onSubmit={handleAddCustomZone} className="flex items-center gap-3 bg-[#f7f3f2] p-3 rounded-md border border-[#e5e2e1]">
          <input
            type="text"
            placeholder="Governorate Name"
            value={govName}
            onChange={(e) => setGovName(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-md border border-[#e5e2e1] bg-white text-[#1a1a1a]"
          />
          <input
            type="number"
            placeholder="Tariff EGP"
            value={govFee}
            onChange={(e) => setGovFee(Number(e.target.value))}
            className="w-28 px-3.5 py-2 text-xs font-semibold rounded-md border border-[#e5e2e1] bg-white text-[#1a1a1a]"
          />
          <button
            type="submit"
            disabled={savingZone}
            className="bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Save Zone
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {shippingZones.map((z) => (
            <div key={z._id} className="p-3.5 rounded-md bg-[#f7f3f2] border border-[#e5e2e1] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#1a1a1a] text-xs block">{z.governorate}</span>
                <span className="text-[11px] text-[#5e5f5c]">COD Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={z.fee}
                  onBlur={(e) => handleUpsertZone(z.governorate, Number(e.target.value), z.isActive)}
                  className="w-16 px-2 py-1 text-xs font-serif font-bold text-[#1a1a1a] bg-white rounded-md border border-[#e5e2e1] text-right"
                />
                <span className="text-xs font-serif font-bold text-[#5e5f5c]">EGP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

