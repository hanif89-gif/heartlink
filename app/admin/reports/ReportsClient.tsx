"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Ban, Search, Flag } from "lucide-react";
import { useState } from "react";

export default function ReportsClient({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState<any[]>(initialReports);
  const [search, setSearch] = useState("");

  const filtered = reports.filter(r =>
    (r.reporter?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.reportedUser?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.reason || "").toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle: Record<string, { bg: string; color: string }> = {
    PENDING: { bg: "#fffbeb", color: "#f59e0b" },
    APPROVED: { bg: "#f0fdf4", color: "#10b981" },
    REJECTED: { bg: "#fef2f2", color: "#ef4444" },
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      } else {
        alert(data.message || "Gagal memperbarui status laporan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handleSuspendUser = async (reportId: string, reportedUserId: string, name: string) => {
    if (!confirm(`Tangguhkan/Ban akun ${name} dan setujui laporan ini?`)) return;
    
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "APPROVED", 
          suspendUser: true, 
          reportedUserId 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: "APPROVED" } : r));
        alert(`Pengguna ${name} berhasil ditangguhkan`);
      } else {
        alert(data.message || "Gagal menangguhkan akun pengguna");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>User Reports</h1>
        <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.95rem" }}>Review and manage user conduct reports.</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Reports", value: reports.length, color: "#64748b" },
          { label: "Pending", value: reports.filter(r => r.status === "PENDING").length, color: "#f59e0b" },
          { label: "Resolved", value: reports.filter(r => r.status !== "PENDING").length, color: "#10b981" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }} />
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{s.label}</span>
            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>{s.value}</span>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: "white", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}
      >
        {/* Search bar */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "38px", paddingRight: "16px", paddingTop: "10px", paddingBottom: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.875rem", outline: "none", color: "#0f172a" }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "64px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "#94a3b8" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flag size={28} color="#cbd5e1" />
            </div>
            <p style={{ fontWeight: 600, fontSize: "1rem" }}>No reports yet</p>
            <p style={{ fontSize: "0.85rem", textAlign: "center" }}>User reports will appear here when users report each other.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Reporter", "Reported User", "Reason", "Date", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: h === "Actions" ? "right" : "left", color: "#64748b", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((report, i) => {
                  const st = statusStyle[report.status] || statusStyle["PENDING"];
                  const isPending = report.status === "PENDING";
                  return (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{report.reporter?.name || "Unknown"}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{report.reporter?.email}</div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{report.reportedUser?.name || "Unknown"}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{report.reportedUser?.email}</div>
                      </td>
                      <td style={{ padding: "16px 20px", color: "#475569", maxWidth: "240px" }}>
                        <span style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>{report.reason}</span>
                      </td>
                      <td style={{ padding: "16px 20px", color: "#64748b", whiteSpace: "nowrap" }}>
                        {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, background: st.bg, color: st.color }}>
                          {report.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                          <button 
                            disabled={!isPending}
                            onClick={() => handleUpdateStatus(report.id, "APPROVED")} 
                            title="Approve Report" 
                            style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#f0fdf4", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", cursor: isPending ? "pointer" : "not-allowed", opacity: isPending ? 1 : 0.4 }}
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button 
                            disabled={!isPending}
                            onClick={() => handleUpdateStatus(report.id, "REJECTED")} 
                            title="Reject Report" 
                            style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: isPending ? "pointer" : "not-allowed", opacity: isPending ? 1 : 0.4 }}
                          >
                            <XCircle size={15} />
                          </button>
                          <button 
                            onClick={() => handleSuspendUser(report.id, report.reportedUserId, report.reportedUser?.name || "Pengguna")} 
                            title="Suspend Reported User" 
                            style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                          >
                            <Ban size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
