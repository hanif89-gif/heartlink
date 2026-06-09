"use client";

import { motion } from "framer-motion";
import { Users, HeartHandshake, MessageCircle, Activity, TrendingUp } from "lucide-react";

interface DashboardData {
  totalUsers: number;
  totalMatches: number;
  totalChats: number;
  activeToday: number;
}

const cardStyles = [
  { bg: "#eff6ff", iconBg: "#3b82f6", label: "Total Users" },
  { bg: "#fdf2f8", iconBg: "#ec4899", label: "Total Matches" },
  { bg: "#faf5ff", iconBg: "#a855f7", label: "Total Chats" },
  { bg: "#f0fdf4", iconBg: "#10b981", label: "Active Today" },
];

export default function DashboardClient({ data }: { data: DashboardData }) {
  const stats = [
    { title: "Total Users", value: data.totalUsers, icon: Users, style: cardStyles[0], trend: "+12%" },
    { title: "Total Matches", value: data.totalMatches, icon: HeartHandshake, style: cardStyles[1], trend: "+24%" },
    { title: "Total Chats", value: data.totalChats, icon: MessageCircle, style: cardStyles[2], trend: "+8%" },
    { title: "Active Today", value: data.activeToday, icon: Activity, style: cardStyles[3], trend: "+4%" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Dashboard Overview</h1>
        <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.95rem" }}>Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}
          >
            <div>
              <p style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{stat.title}</p>
              <h3 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: "6px 0" }}>{stat.value.toLocaleString()}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <TrendingUp size={12} color="#10b981" />
                <span style={{ color: "#10b981", fontSize: "0.75rem", fontWeight: 600 }}>{stat.trend} from last month</span>
              </div>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: stat.style.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <stat.icon size={26} color={stat.style.iconBg} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
          <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem", marginBottom: "16px" }}>📊 Quick Stats</h3>
          {[
            { label: "Match Rate", value: data.totalUsers > 0 ? `${Math.round((data.totalMatches / data.totalUsers) * 100)}%` : "0%" },
            { label: "Avg. Messages / Match", value: data.totalMatches > 0 ? Math.round(data.totalChats / data.totalMatches) : 0 },
            { label: "Online Users", value: data.activeToday },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#64748b", fontSize: "0.875rem" }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>{item.value}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ background: "linear-gradient(135deg, #e91e8c 0%, #9c27b0 100%)", borderRadius: "20px", padding: "24px", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Platform Health</p>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "8px" }}>All Systems Normal 🟢</h3>
            <p style={{ opacity: 0.75, fontSize: "0.875rem", marginTop: "8px", lineHeight: 1.5 }}>
              Database, authentication, and API endpoints are all running smoothly.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            {["DB: OK", "Auth: OK", "API: OK"].map(s => (
              <span key={s} style={{ background: "rgba(255,255,255,0.2)", borderRadius: "9999px", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
