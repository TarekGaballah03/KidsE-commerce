'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { Role } from '../../../../types';
import { Plus, Edit3, Trash2, ShieldCheck } from 'lucide-react';

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Permission Matrix</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Roles & RBAC Privileges</h1>
          <p className="text-xs text-[#5e5f5c] mt-0.5">Configure granular authority rules across orders, inventory, catalog, and finances.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest px-5 py-3 rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left text-[#1c1b1b]">
          <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
            <tr>
              <th className="p-4">Role Title</th>
              <th className="p-4">Description</th>
              <th className="p-4">Granted Permissions</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2e1]">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#5e5f5c]">Loading roles...</td>
              </tr>
            ) : (
              roles.map((r) => (
                <tr key={r._id} className="hover:bg-[#fdf8f8] transition-colors">
                  <td className="p-4 font-semibold text-[#1a1a1a] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#1a1a1a]" />
                    <span className="font-serif text-sm">{r.name}</span>
                  </td>
                  <td className="p-4 text-[#5e5f5c] max-w-xs truncate">{r.description || '—'}</td>
                  <td className="p-4">
                    <span className="bg-[#f1edec] font-semibold px-2.5 py-0.5 rounded-md text-[11px] text-[#1a1a1a] border border-[#e5e2e1]">
                      {r.permissions?.length || 0} permissions
                    </span>
                  </td>
                  <td className="p-4">
                    {r.isSystem ? (
                      <span className="bg-[#f1edec] text-[#1a1a1a] font-semibold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border border-[#e5e2e1]">Core System</span>
                    ) : (
                      <span className="bg-[#ebe7e6] text-[#5e5f5c] font-semibold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">Custom</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(r)} className="p-2 rounded-md bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a] transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {!r.isSystem && (
                      <button onClick={() => handleDelete(r._id)} className="p-2 rounded-md bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors">
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
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdf8f8] rounded-lg p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-[#e5e2e1]">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">
              {editingRole ? `Edit Role: ${editingRole.name}` : 'Create Custom Role Definition'}
            </h3>

            <form onSubmit={handleSaveRole} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Role Name *</label>
                  <input
                    type="text"
                    required
                    disabled={editingRole?.isSystem}
                    placeholder="e.g. Concierge Specialist"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Description</label>
                  <input
                    type="text"
                    placeholder="Primary function and operations"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                  />
                </div>
              </div>

              {/* Module Permissions Matrix */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif font-bold text-[#1a1a1a] text-sm">
                  Module Permissions Checklist
                </h4>

                <div className="space-y-4">
                  {Object.entries(permissionGroups).map(([groupKey, group]) => {
                    const allSelected = group.permissions.every((p) => selectedPermissions.includes(p));

                    return (
                      <div key={groupKey} className="p-4 rounded-lg bg-[#f7f3f2] border border-[#e5e2e1] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1a1a1a] text-xs uppercase tracking-wider">{group.label}</span>
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.permissions)}
                            className="text-[11px] text-[#1a1a1a] underline font-medium hover:opacity-75"
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
                                className={`flex items-center gap-2 p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                                  isChecked ? 'bg-[#f1edec] border-[#1a1a1a] text-[#1a1a1a] font-semibold' : 'bg-white border-[#e5e2e1] text-[#5e5f5c]'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm)}
                                  className="rounded text-[#1a1a1a] w-3.5 h-3.5"
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

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e5e2e1]">
                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2.5 text-xs font-semibold text-[#5e5f5c] bg-[#f1edec] rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#1a1a1a] hover:bg-[#000000] rounded-lg shadow-xs">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

