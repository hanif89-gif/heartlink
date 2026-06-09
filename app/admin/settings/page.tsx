"use client";

import { motion } from "framer-motion";
import { Save, AlertTriangle, UploadCloud, Bell, Shield, Palette } from "lucide-react";
import { useState } from "react";

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ background: "white", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: "20px" }}
  >
    <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fdf2f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <h2 style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem", margin: 0 }}>{title}</h2>
    </div>
    <div style={{ padding: "24px" }}>{children}</div>
  </motion.div>
);

const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    style={{ position: "relative", width: "52px", height: "28px", borderRadius: "9999px", border: "none", background: value ? "#e91e8c" : "#e2e8f0", cursor: "pointer", transition: "background 0.3s", padding: 0 }}
  >
    <div style={{ position: "absolute", top: "4px", left: value ? "28px" : "4px", width: "20px", height: "20px", borderRadius: "50%", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", transition: "left 0.3s" }} />
  </button>
);

export default function AdminSettings() {
  const [appName, setAppName] = useState("HeartLink");
  const [maintenance, setMaintenance] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Settings</h1>
        <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.95rem" }}>Configure platform settings and preferences.</p>
      </div>

      <Section title="General" icon={<Palette size={18} color="#e91e8c" />}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontWeight: 600, color: "#374151", fontSize: "0.875rem", marginBottom: "8px" }}>Application Name</label>
          <input
            type="text"
            value={appName}
            onChange={e => setAppName(e.target.value)}
            style={{ width: "100%", maxWidth: "400px", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.95rem", outline: "none", color: "#0f172a", fontFamily: "inherit" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: 600, color: "#374151", fontSize: "0.875rem", marginBottom: "8px" }}>Application Logo</label>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "16px", background: "#fdf2f8", border: "2px dashed #f9a8d4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "6px" }}>
              <img src="/img/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "white", cursor: "pointer", fontSize: "0.875rem", color: "#475569", fontWeight: 600 }}>
              <UploadCloud size={16} />
              Upload New Logo
            </button>
          </div>
        </div>
      </Section>

      <Section title="Notifications" icon={<Bell size={18} color="#e91e8c" />}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ fontWeight: 600, color: "#0f172a", margin: 0 }}>Email Notifications</h4>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>Receive email alerts for new reports and user activity.</p>
          </div>
          <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
        </div>
      </Section>

      <Section title="System Control" icon={<AlertTriangle size={18} color="#f59e0b" />}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ fontWeight: 600, color: "#0f172a", margin: 0 }}>Maintenance Mode</h4>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px", maxWidth: "400px" }}>
              When enabled, all users will see a maintenance screen. Admins can still log in.
            </p>
          </div>
          <Toggle value={maintenance} onChange={() => setMaintenance(!maintenance)} />
        </div>
        {maintenance && (
          <div style={{ marginTop: "16px", padding: "12px 16px", background: "#fffbeb", borderRadius: "12px", border: "1px solid #fde68a", color: "#92400e", fontSize: "0.875rem", fontWeight: 500 }}>
            ⚠️ Maintenance mode is ON. Users cannot access the app right now.
          </div>
        )}
      </Section>

      <Section title="Security" icon={<Shield size={18} color="#e91e8c" />}>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ padding: "10px 20px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
            Clear All Sessions
          </button>
          <button style={{ padding: "10px 20px", background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "12px", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
            Export User Data
          </button>
        </div>
      </Section>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: saving ? "#f9a8d4" : "linear-gradient(135deg, #e91e8c, #9c27b0)", color: "white", fontWeight: 700, padding: "14px 32px", borderRadius: "14px", border: "none", cursor: saving ? "not-allowed" : "pointer", fontSize: "0.95rem", boxShadow: "0 4px 16px rgba(233,30,140,0.3)", transition: "all 0.2s" }}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
