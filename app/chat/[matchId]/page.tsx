"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ChatBubble from "@/app/components/ChatBubble";
import ChatSidebar from "@/app/components/ChatSidebar";
import { Send, Plus, Loader2, ArrowLeft, Flag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Msg {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string | null; image: string | null };
}

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Reporting states
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reporting, setReporting] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages/${matchId}`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
        setOtherUser(data.otherUser);
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }, [matchId]);

  useEffect(() => { 
    fetchMessages(); 
  }, [fetchMessages]);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (res.ok) {
        setInput("");
        await fetchMessages();
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setSending(false); 
    }
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const sendRes = await fetch(`/api/messages/${matchId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: data.url }),
        });

        if (sendRes.ok) {
          await fetchMessages();
        } else {
          console.error("Failed to send image message");
        }
      } else {
        alert(data.message || "Gagal mengupload gambar");
      }
    } catch (err) {
      console.error("File upload error:", err);
      alert("Terjadi kesalahan saat mengunggah berkas");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason || reporting || !otherUser) return;
    setReporting(true);
    try {
      const fullReason = reportDetails.trim() 
        ? `[${reportReason}] ${reportDetails.trim()}` 
        : reportReason;

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          reportedUserId: otherUser.id, 
          reason: fullReason 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Laporan berhasil dikirim ke Admin. Terima kasih atas laporan Anda.");
        setIsReportOpen(false);
        setReportReason("");
        setReportDetails("");
      } else {
        alert(data.message || "Gagal mengirim laporan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setReporting(false);
    }
  };

  const getOnlineStatus = () => {
    if (!otherUser || !otherUser.updatedAt) {
      return { text: "Offline", color: "var(--text-light)" };
    }
    const lastActive = new Date(otherUser.updatedAt).getTime();
    const now = new Date().getTime();
    const isOnline = now - lastActive < 120000; // 2 minutes
    return {
      text: isOnline ? "Online" : "Offline",
      color: isOnline ? "#4caf50" : "var(--text-light)",
    };
  };

  const status = getOnlineStatus();

  return (
    <div className="bg-heartlink min-h-screen flex flex-col">
      <Navbar />
      <main style={{ flex: 1, maxWidth: "1152px", margin: "0 auto", width: "100%", display: "flex", padding: "16px", paddingTop: "96px", height: "100vh" }}>
        <div style={{ flex: 1, display: "flex", background: "rgba(255,255,255,0.2)", borderRadius: "32px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", position: "relative" }}>
          
          <ChatSidebar isMobileHidden={true} />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "rgba(255,255,255,0.3)" }}>
            {/* Chat Header */}
            {otherUser && (
              <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", borderBottom: "1px solid rgba(255,182,193,0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Link href="/chat" style={{ padding: "8px", borderRadius: "50%", display: "flex" }}>
                    <ArrowLeft size={20} style={{ color: "var(--pink-primary)" }} />
                  </Link>
                  {otherUser.image ? (
                    <img src={otherUser.image} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid #fce4ec" }} />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, background: "var(--pink-gradient)", flexShrink: 0 }}>
                      {otherUser.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-dark)", margin: 0 }}>{otherUser.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: status.color, display: "inline-block" }}></span>
                      <p style={{ fontSize: "0.75rem", color: status.color, margin: 0, fontWeight: 600 }}>{status.text}</p>
                    </div>
                  </div>
                </div>

                {/* Report User Icon */}
                <button
                  onClick={() => setIsReportOpen(true)}
                  title="Laporkan Pengguna"
                  style={{ border: "none", background: "rgba(255, 255, 255, 0.5)", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ec4899", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; e.currentTarget.style.color = "#ec4899"; }}
                >
                  <Flag size={18} />
                </button>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <Loader2 size={30} className="animate-spin" style={{ color: "var(--pink-primary)" }} />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
                  <span style={{ fontSize: "3rem", marginBottom: "8px" }}>👋</span>
                  <p style={{ color: "var(--text-gray)" }}>Mulai percakapan dengan {otherUser?.name}!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatBubble
                      key={msg.id}
                      content={msg.content}
                      isSent={msg.sender.id === session?.user?.id}
                      senderName={msg.sender.name || undefined}
                      senderImage={msg.sender.image}
                      timestamp={msg.createdAt}
                    />
                  ))}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "16px", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,182,193,0.3)" }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.7)", borderRadius: "9999px", padding: "8px 8px 8px 16px", boxShadow: "0 2px 8px rgba(233,64,126,0.1)" }}>
                <button 
                  type="button" 
                  onClick={handlePlusClick}
                  disabled={uploading}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0, border: "none", cursor: "pointer", background: "var(--pink-gradient)", opacity: uploading ? 0.6 : 1 }}
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: "8px 4px", background: "transparent", fontSize: "0.9rem", outline: "none", border: "none", color: "var(--text-dark)" }}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0, border: "none", cursor: "pointer", background: "var(--pink-gradient)", opacity: (sending || !input.trim()) ? 0.5 : 1, transition: "all 0.2s" }}
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {isReportOpen && otherUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsReportOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ zIndex: 10, background: "white", width: "100%", maxWidth: "420px", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Laporkan Pengguna</h3>
                <button onClick={() => setIsReportOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
              </div>

              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Apakah pengguna **{otherUser.name}** melakukan pelanggaran? Laporan Anda akan ditinjau oleh Admin secara rahasia.
              </p>

              <form onSubmit={handleReportSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Alasan Pelanggaran</label>
                  <select
                    required
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", fontSize: "0.875rem", background: "white" }}
                  >
                    <option value="">-- Pilih Alasan --</option>
                    <option value="Spam / Penipuan">Spam / Penipuan</option>
                    <option value="Pelecehan / Kata-kata Kasar">Pelecehan / Kata-kata Kasar</option>
                    <option value="Profil Palsu">Profil Palsu</option>
                    <option value="Foto Tidak Pantas">Foto Tidak Pantas</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Detail Tambahan (Opsional)</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Berikan informasi atau penjelasan singkat..."
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", fontSize: "0.875rem", fontFamily: "inherit", resize: "none" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button 
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 700, cursor: "pointer" }}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={!reportReason || reporting}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "white", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!reportReason || reporting) ? 0.6 : 1 }}
                  >
                    {reporting ? "Mengirim..." : "Kirim Laporan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
