"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Edit, Trash2, Ban, Users, X, MapPin, User, Calendar, Mail, ShieldAlert } from "lucide-react";

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({ name: "", email: "", city: "", role: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredUsers = users.filter(user =>
    (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenView = (user: any) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      city: user.city || "",
      role: user.role || "USER",
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleToggleSuspend = async (user: any) => {
    const newRole = user.role === "BANNED" ? "USER" : "BANNED";
    const confirmMsg = user.role === "BANNED" 
      ? `Aktifkan kembali akun ${user.name}?` 
      : `Tangguhkan akun ${user.name}? (Pengguna tidak akan bisa login)`;
      
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: user.name, 
          email: user.email, 
          city: user.city, 
          role: newRole 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      } else {
        alert(data.message || "Gagal merubah status penangguhan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
        setIsEditOpen(false);
      } else {
        alert(data.message || "Gagal menyimpan perubahan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
        setIsDeleteOpen(false);
      } else {
        alert(data.message || "Gagal menghapus user");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>User Management</h1>
        <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.95rem" }}>Manage and monitor all registered users.</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Users", value: users.length, color: "#3b82f6" },
          { label: "Admin Users", value: users.filter(u => u.role === "ADMIN").length, color: "#a855f7" },
          { label: "Suspended Users", value: users.filter(u => u.role === "BANNED").length, color: "#ef4444" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }} />
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{s.label}</span>
            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: "white", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}
      >
        {/* Table Header with search */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "38px", paddingRight: "16px", paddingTop: "10px", paddingBottom: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.875rem", outline: "none", color: "#0f172a" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.875rem" }}>
            <Users size={16} />
            {filteredUsers.length} users
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["User", "Location", "Role", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: h === "Actions" ? "right" : "left", color: "#64748b", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", background: "#e2e8f0", flexShrink: 0 }}>
                        {user.image ? (
                          <img src={user.image} alt={user.name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#94a3b8", fontSize: "1rem" }}>
                            {user.name ? user.name[0].toUpperCase() : "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{user.name || "Unnamed"}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", color: "#475569" }}>{user.city || "—"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, background: user.role === "ADMIN" ? "#faf5ff" : user.role === "BANNED" ? "#fef2f2" : "#eff6ff", color: user.role === "ADMIN" ? "#a855f7" : user.role === "BANNED" ? "#ef4444" : "#3b82f6" }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, background: user.role === "BANNED" ? "#fef2f2" : "#f0fdf4", color: user.role === "BANNED" ? "#ef4444" : "#10b981" }}>
                      {user.role === "BANNED" ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                      <button onClick={() => handleOpenView(user)} title="View Detail" style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleOpenEdit(user)} title="Edit User" style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#f0fdf4", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleToggleSuspend(user)} title={user.role === "BANNED" ? "Unsuspend User" : "Suspend User"} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Ban size={15} />
                      </button>
                      <button onClick={() => handleOpenDelete(user)} title="Delete User" style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>
                    No users found matching &quot;{search}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.8rem" }}>
          <span>Showing {filteredUsers.length} of {users.length} users</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button style={{ padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer", fontSize: "0.8rem", color: "#64748b" }}>← Prev</button>
            <button style={{ padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer", fontSize: "0.8rem", color: "#64748b" }}>Next →</button>
          </div>
        </div>
      </motion.div>

      {/* Modals Section */}
      <AnimatePresence>
        {/* VIEW USER MODAL */}
        {isViewOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsViewOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ zIndex: 10, background: "white", width: "100%", maxWidth: "500px", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Profil Pengguna</h3>
                <button onClick={() => setIsViewOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", border: "4px solid #fdf2f8", background: "#e2e8f0", marginBottom: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  {selectedUser.image ? <img src={selectedUser.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700, color: "#94a3b8" }}>{selectedUser.name?.[0]?.toUpperCase() || "?"}</div>}
                </div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>{selectedUser.name || "Unnamed"}</h4>
                <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}><Mail size={12} /> {selectedUser.email}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <User size={16} style={{ color: "#ec4899", marginTop: "2px" }} />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase" }}>Informasi</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                      {selectedUser.gender || "—"}{selectedUser.age ? `, ${selectedUser.age} Tahun` : ""}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <MapPin size={16} style={{ color: "#ec4899", marginTop: "2px" }} />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase" }}>Lokasi</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                      {selectedUser.city || "—"}{selectedUser.province ? `, ${selectedUser.province}` : ""}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <ShieldAlert size={16} style={{ color: "#ec4899", marginTop: "2px" }} />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase" }}>Peran & Status</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                      {selectedUser.role} ({selectedUser.role === "BANNED" ? "Banned" : "Active"})
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <Calendar size={16} style={{ color: "#ec4899", marginTop: "2px" }} />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase" }}>Terdaftar</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                      {new Date(selectedUser.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {selectedUser.bio && (
                <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "12px", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Bio</span>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: 1.5 }}>{selectedUser.bio}</p>
                </div>
              )}

              {selectedUser.latitude && selectedUser.longitude && (
                <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "12px", border: "1px solid #f1f5f9", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8" }}>Latitude</span>
                    <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 500 }}>{selectedUser.latitude}</span>
                  </div>
                  <div>
                    <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8" }}>Longitude</span>
                    <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 500 }}>{selectedUser.longitude}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setIsViewOpen(false)}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #e9407e 0%, #e65b96 100%)", color: "white", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(233,64,126,0.2)" }}
              >
                Tutup Detail
              </button>
            </motion.div>
          </div>
        )}

        {/* EDIT USER MODAL */}
        {isEditOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsEditOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ zIndex: 10, background: "white", width: "100%", maxWidth: "450px", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Edit Pengguna</h3>
                <button onClick={() => setIsEditOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
              </div>

              <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Nama</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", fontSize: "0.875rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", fontSize: "0.875rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Kota</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={e => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", fontSize: "0.875rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Peran (Role)</label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", fontSize: "0.875rem", background: "white" }}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="BANNED">BANNED (Tangguhkan)</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                  <button 
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 700, cursor: "pointer" }}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", color: "white", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(236,72,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* DELETE USER MODAL */}
        {isDeleteOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsDeleteOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ zIndex: 10, background: "white", width: "100%", maxWidth: "400px", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
            >
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Trash2 size={24} />
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>Hapus Pengguna?</h3>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
                  Apakah Anda yakin ingin menghapus akun **{selectedUser.name || selectedUser.email}**? Tindakan ini bersifat permanen dan akan menghapus semua chat, like, dan match yang terkait dengan pengguna ini.
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  disabled={deleting}
                  onClick={() => setIsDeleteOpen(false)}
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 700, cursor: "pointer" }}
                >
                  Batal
                </button>
                <button 
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#ef4444", color: "white", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.25)" }}
                >
                  {deleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
