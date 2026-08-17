'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../../lib/api';
import { AdminUser, Role } from '../../../../types';
import { Plus, Lock, Ban, CheckCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Create User Modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');

  // Reset Password Modal
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        apiFetch('/admin/users'),
        apiFetch<Role[]>('/admin/roles'),
      ]);
      setUsers(uRes.items || uRes.data || uRes || []);
      setRoles(rRes || []);
      if (rRes && rRes.length > 0) {
        setRoleId(rRes[0]._id);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !roleId) return;

    try {
      await apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, roleId }),
      });
      setDialogOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create admin user');
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    if (!confirm(`Are you sure you want to change ${user.name}'s status to ${nextStatus}?`)) return;

    try {
      await apiFetch(`/admin/users/${user._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUserId || !newPassword) return;

    try {
      await apiFetch(`/admin/users/${resetUserId}/reset-password`, {
        method: 'PATCH',
        body: JSON.stringify({ newPassword }),
      });
      setResetDialogOpen(false);
      setNewPassword('');
      alert('Password reset successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-[0.2em] text-[#5e5f5c] block">Access Control</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">Staff & Team Accounts</h1>
          <p className="text-xs text-[#5e5f5c] mt-0.5">Manage administrative credentials, assign RBAC access roles, and audit activity.</p>
        </div>

        <button
          onClick={() => setDialogOpen(true)}
          className="bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold text-xs uppercase tracking-widest px-5 py-3 rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e2e1] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left text-[#1c1b1b]">
          <thead className="bg-[#f7f3f2] text-[#5e5f5c] font-semibold uppercase text-[10px] tracking-wider border-b border-[#e5e2e1]">
            <tr>
              <th className="p-4">Staff Member</th>
              <th className="p-4">Email</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Account Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2e1]">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#5e5f5c]">Loading admin accounts...</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-[#fdf8f8] transition-colors">
                  <td className="p-4 font-semibold text-[#1a1a1a] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-xs font-bold">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4 text-[#5e5f5c]">{u.email}</td>
                  <td className="p-4">
                    <span className="bg-[#f1edec] text-[#1a1a1a] font-semibold px-2.5 py-0.5 rounded-full text-[11px] border border-[#e5e2e1]">
                      {u.role?.name || 'Standard Staff'}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.status === 'active' ? (
                      <span className="bg-[#f1edec] text-[#1a1a1a] font-semibold px-2.5 py-0.5 rounded-full text-[11px] border border-[#e5e2e1]">Active</span>
                    ) : (
                      <span className="bg-[#ffdad6]/40 text-[#ba1a1a] font-semibold px-2.5 py-0.5 rounded-full text-[11px]">Suspended</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setResetUserId(u._id);
                        setResetDialogOpen(true);
                      }}
                      className="p-2 rounded-md bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a] transition-colors"
                      title="Reset Password"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`p-2 rounded-md transition-colors ${
                        u.status === 'active' ? 'bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#f1edec] hover:bg-[#ebe7e6] text-[#1a1a1a]'
                      }`}
                      title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                    >
                      {u.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdf8f8] rounded-lg p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 border border-[#e5e2e1]">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">Provision New Staff Account</h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omar Farouk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="omar@swan.boutique"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Temporary Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">Assign Security Role *</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                >
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e5e2e1]">
                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2.5 text-xs font-semibold text-[#5e5f5c] bg-[#f1edec] rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#1a1a1a] hover:bg-[#000000] rounded-lg shadow-xs">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetDialogOpen && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdf8f8] rounded-lg p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 border border-[#e5e2e1]">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">Reset Password</h3>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1a1a] mb-1.5">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#f7f3f2] border border-[#e5e2e1] focus:ring-1 focus:ring-[#1a1a1a] text-[#1a1a1a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e5e2e1]">
                <button type="button" onClick={() => setResetDialogOpen(false)} className="px-4 py-2.5 text-xs font-semibold text-[#5e5f5c] bg-[#f1edec] rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#1a1a1a] hover:bg-[#000000] rounded-lg shadow-xs">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

