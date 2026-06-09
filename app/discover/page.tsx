"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ProfileCard from "@/app/components/ProfileCard";
import MatchPopup from "@/app/components/MatchPopup";
import { Loader2 } from "lucide-react";

interface DiscoverUser {
  id: string;
  name: string | null;
  age: number | null;
  bio: string | null;
  image: string | null;
  city: string | null;
  distance: number | null;
}

export default function DiscoverPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<{ id: string; name: string | null; image: string | null } | null>(null);
  const [matchId, setMatchId] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/discover");
      const data = await res.json();
      if (res.ok) {
        if (data.requireProfileSetup) {
          router.push("/profile");
          return;
        }
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Fetch discover error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSwipe = async (userId: string, isLike: boolean) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: userId, isLike }),
      });
      const data = await res.json();
      if (data.matched) {
        const other = data.match.user1.id === session?.user?.id ? data.match.user2 : data.match.user1;
        setMatchedUser(other);
        setMatchId(data.match.id);
        setShowMatch(true);

        // Save to localStorage so Navbar doesn't trigger duplicate popup
        const saved = typeof window !== "undefined" ? localStorage.getItem("heartlink_seen_matches") : null;
        let currentSeen: string[] = [];
        if (saved) {
          try {
            currentSeen = JSON.parse(saved);
          } catch (e) {}
        }
        if (!currentSeen.includes(data.match.id)) {
          currentSeen.push(data.match.id);
          if (typeof window !== "undefined") {
            localStorage.setItem("heartlink_seen_matches", JSON.stringify(currentSeen));
          }
        }
      }
    } catch (err) {
      console.error("Swipe error:", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(180deg, #ff4081 0%, #ff80ab 100%)" }}>
      {/* Background Bokeh Circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[-10%] w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-[-5%] w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-20 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />

      <Navbar />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-32 pb-8 h-screen flex flex-col items-center">
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
            <Loader2 size={40} className="animate-spin text-white" />
          </div>
        ) : users.length === 0 ? (
          <div className="fixed inset-0 flex flex-col items-center justify-center text-white text-center pointer-events-none z-0">
            <span className="text-6xl mb-4">😢</span>
            <h2 className="text-2xl font-bold mb-2 tracking-wide">Tidak ada user lagi</h2>
            <p className="text-white/80">Coba lagi nanti ya!</p>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-md relative flex items-center justify-center mt-4">
            {users.slice(0, 3).reverse().map((user, i, arr) => {
              const isTop = i === arr.length - 1;
              return (
                <div 
                  key={user.id} 
                  className="absolute w-full flex justify-center"
                  style={{
                    left: '50%',
                    top: '50%',
                    zIndex: i,
                    transform: `translate(-50%, -50%) scale(${1 - (arr.length - 1 - i) * 0.05}) translateY(${(arr.length - 1 - i) * 15}px)`
                  }}
                >
                  <ProfileCard
                    user={user}
                    variant="discover"
                    onLike={() => handleSwipe(user.id, true)}
                    onDislike={() => handleSwipe(user.id, false)}
                    drag={isTop}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <MatchPopup
        show={showMatch}
        currentUser={{ name: session?.user?.name || null, image: session?.user?.image || null }}
        matchedUser={matchedUser || { name: null, image: null }}
        onSendMessage={() => { setShowMatch(false); router.push(`/chat/${matchId}`); }}
        onKeepSwiping={() => setShowMatch(false)}
      />
    </div>
  );
}
