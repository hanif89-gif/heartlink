"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface MatchData {
  id: string;
  otherUser: { id: string; name: string | null; image: string | null };
  lastMessage: { content: string; createdAt: string } | null;
}

export default function ChatSidebar({ isMobileHidden = false }: { isMobileHidden?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const currentMatchId = params?.matchId as string | undefined;
  
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      if (res.ok) setMatches(data.matches);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  return (
    <div
      className={isMobileHidden ? "hidden md:flex" : "flex"}
      style={{
        width: "320px",
        minWidth: "320px",
        flexShrink: 0,
        flexDirection: "column",
        height: "100%",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(255,182,193,0.4)",
      }}
    >
      <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,182,193,0.3)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--pink-primary)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          💬 Messages
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--pink-primary)" }} />
          </div>
        ) : matches.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 16px" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-gray)", margin: 0 }}>Belum ada chat. Mulai match dulu!</p>
          </div>
        ) : (
          matches.map((match) => {
            const isActive = currentMatchId === match.id;
            return (
              <motion.button
                key={match.id}
                onClick={() => router.push(`/chat/${match.id}`)}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "12px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "background-color 0.2s, box-shadow 0.2s",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  background: isActive ? "rgba(233, 64, 126, 0.15)" : "transparent",
                  boxShadow: isActive ? "0 4px 12px rgba(233, 64, 126, 0.08)" : "none",
                }}
              >
                {match.otherUser.image ? (
                  <img
                    src={match.otherUser.image}
                    alt=""
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: isActive ? "2px solid var(--pink-primary)" : "2px solid rgba(255,255,255,0.4)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                      background: "var(--pink-gradient)",
                    }}
                  >
                    {match.otherUser.name?.charAt(0) || "?"}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "var(--text-dark)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {match.otherUser.name}
                  </h3>
                  {match.lastMessage ? (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "var(--text-gray)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {match.lastMessage.content}
                    </p>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "var(--text-light)",
                        fontStyle: "italic",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Mulai chat...
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
