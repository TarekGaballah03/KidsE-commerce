'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { Role } from '../../../../types';
import { Plus, Edit3, Trash2, ShieldCheck, Check } from 'lucide-react';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<Record<string, { label: string; permissions: string[] }>>({});
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, pRes] = await Promise.all([
        apiFetch<Role[]>('/admin/roles'),
        apiFetch('/admin/roles/permissions'),
      ]);
      setRoles(rRes || []);
      setPermissionGroups(pRes || {});
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setRoleName('');
    setDescription('');
    setSelectedPermissions([]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setDescription(role.description || '');
    setSelectedPermissions(role.permissions || []);
    setDialogOpen(true);
  };

  const togglePermission = (perm: string) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const toggleGroup = (perms: string[]) => {
    const allSelected = perms.every((p) => selectedPermissions.includes(p));
    if (allSelected) {
      setSelectedPermissions(selectedPermissions.filter((p) => !perms.includes(p)));
    } else {
      const merged = new Set([...selectedPermissions, ...perms]);
      setSelectedPermissions(Array.from(merged));
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return;

    const payload = {
      name: roleName,
      description,
      permissions: selectedPermissions,
    };

    try {
      if (editingRole) {
        await apiFetch(`/admin/roles/${editingRole._id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/admin/roles', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setDialogOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save role');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await apiFetch(`/admin/roles/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete role');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Roles & Permissions (RBAC)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure granular permission matrices per module for admin staff.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="p-4">Role Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Permissions Count</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">Loading roles...</td>
              </tr>
            ) : (
              roles.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                    <span>{r.name}</span>
                  </td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">{r.description || '—'}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 font-bold px-2 py-0.5 rounded-md">
                      {r.permissions?.length || 0} permission(s)
                    </span>
                  </td>
                  <td className="p-4">
                    {r.isSystem ? (
                      <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full text-[10px]">System Role</span>
                    ) : (
                      <span className="bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-full text-[10px]">Custom</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(r)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {!r.isSystem && (
                      <button onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Role Editor Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-slate-900 text-base">
              {editingRole ? `Edit Role: ${editingRole.name}` : 'Create Custom Role'}
            </h3>

            <form onSubmit={handleSaveRole} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Name *</label>
                  <input
                    type="text"
                    required
                    disabled={editingRole?.isSystem}
                    placeholder="e.g. Fulfillment Specialist"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Short description of duties"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              {/* Module Permissions Matrix */}
              <div className="space-y-4 pt-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Module Permissions Checklist
                </h4>

                <div className="space-y-4">
                  {Object.entries(permissionGroups).map(([groupKey, group]) => {
                    const allSelected = group.permissions.every((p) => selectedPermissions.includes(p));

                    return (
                      <div key={groupKey} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">{group.label}</span>
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.permissions)}
                            className="text-[11px] text-rose-600 font-bold hover:underline"
                          >
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                          {group.permissions.map((perm) => {
                            const isChecked = selectedPermissions.includes(perm);
                            return (
                              <label
                                key={perm}
                                className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                                  isChecked ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' : 'bg-white border-slate-200 text-slate-600'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm)}
                                  className="rounded text-rose-500 w-3.5 h-3.5"
                                />
                                <span className="font-mono text-[10px]">{perm}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-md">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
