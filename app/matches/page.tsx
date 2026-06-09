"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ProfileCard from "@/app/components/ProfileCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface MatchData {
  id: string;
  otherUser: { id: string; name: string | null; image: string | null; age: number | null; bio: string | null; city: string | null };
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
  createdAt: string;
}

export default function MatchesPage() {
  const router = useRouter();
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
    <div className="bg-heartlink min-h-screen">
      <Navbar />
      <main style={{ paddingTop: "120px", paddingBottom: "32px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.h2 
          className="text-3xl font-bold text-white" 
          style={{ marginBottom: "32px" }}
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          💖 Your Match
        </motion.h2>

        {loading ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <Loader2 size={40} className="animate-spin text-white" />
          </div>
        ) : matches.length === 0 ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", textAlign: "center", color: "white" }}>
            <div style={{ pointerEvents: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "4rem", marginBottom: "16px" }}>💔</span>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "8px" }}>Belum ada match</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px" }}>Mulai swipe untuk menemukan match!</p>
              <button 
                onClick={() => router.push("/discover")} 
                className="transition hover:scale-105"
                style={{ backgroundColor: "white", color: "#e91e63", fontWeight: "bold", padding: "12px 32px", borderRadius: "9999px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
              >
                Discover
              </button>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center", width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
              {matches.map((match) => (
                <ProfileCard
                  key={match.id}
                  user={match.otherUser}
                  variant="match"
                  onChat={() => router.push(`/chat/${match.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
