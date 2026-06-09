"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, HeartHandshake, MessageCircle } from "lucide-react";

interface Props {
  growthData: { month: string; users: number }[];
  growthPercent: number;
  totalUsers: number;
  totalMatches: number;
  totalMessages: number;
}

export default function AnalyticsClient({ growthData, growthPercent, totalUsers, totalMatches, totalMessages }: Props) {
  const maxUsers = Math.max(...growthData.map(d => d.users), 1);
  const isPositive = growthPercent >= 0;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Analytics</h1>
        <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.95rem" }}>Track application growth and user engagement metrics.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem", margin: 0 }}>User Growth (Last 6 Months)</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: isPositive ? "#10b981" : "#ef4444", background: isPositive ? "#f0fdf4" : "#fef2f2", padding: "4px 12px", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 600 }}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isPositive ? "+" : ""}{growthPercent}%
              </div>
            </div>

            <div style={{ height: "220px", display: "flex", alignItems: "flex-end", gap: "12px", padding: "0 4px" }}>
              {growthData.map((data, index) => {
                const heightPct = (data.users / maxUsers) * 100;
                return (
                  <div key={data.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative" }}>
                    <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, position: "absolute", top: `-${heightPct > 10 ? 24 : 20}px` }}>{data.users}</div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(heightPct, 2)}%` }}
                      transition={{ delay: index * 0.1, duration: 0.7, type: "spring" }}
                      style={{
                        width: "100%",
                        background: data.users === 0
                          ? "#e2e8f0"
                          : `linear-gradient(to top, #e91e8c, #f48fb1)`,
                        borderRadius: "8px 8px 0 0",
                        minHeight: "4px",
                      }}
                    />
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>{data.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Side Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Total Registered", value: totalUsers, icon: Users, bg: "#eff6ff", color: "#3b82f6" },
              { label: "Matches Made", value: totalMatches, icon: HeartHandshake, bg: "#fdf2f8", color: "#ec4899" },
              { label: "Messages Sent", value: totalMessages, icon: MessageCircle, bg: "#faf5ff", color: "#a855f7" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={22} color={item.color} />
                </div>
                <div>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600, margin: 0 }}>{item.label}</p>
                  <h4 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: "2px 0 0 0" }}>{item.value.toLocaleString()}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
