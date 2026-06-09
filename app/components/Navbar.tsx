"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Home, HeartHandshake, MessageCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatchPopup from "./MatchPopup";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  // States for real-time like notification and match
  const [activeLikeNotification, setActiveLikeNotification] = useState<any>(null);
  const [notifiedLikes, setNotifiedLikes] = useState<string[]>([]);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedUserInfo, setMatchedUserInfo] = useState<any>(null);
  const [matchIdInfo, setMatchIdInfo] = useState("");

  // Polling check for pending likes
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchPendingLikes = async () => {
      try {
        const res = await fetch("/api/notifications/likes");
        if (res.ok) {
          const data = await res.json();
          const pending = data.pendingLikes || [];
          
          // Find the first pending like we haven't notified yet
          const nextToNotify = pending.find((u: any) => !notifiedLikes.includes(u.id));
          if (nextToNotify && !activeLikeNotification) {
            setActiveLikeNotification(nextToNotify);
            setNotifiedLikes((prev) => [...prev, nextToNotify.id]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch pending likes:", err);
      }
    };

    fetchPendingLikes();
    const interval = setInterval(fetchPendingLikes, 5000);
    return () => clearInterval(interval);
  }, [session, notifiedLikes, activeLikeNotification]);

  // Polling check for new matches
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchPendingMatches = async () => {
      try {
        const res = await fetch("/api/notifications/matches");
        if (res.ok) {
          const data = await res.json();
          const matches = data.matches || [];
          
          // Get previously notified matches from localStorage
          const saved = typeof window !== "undefined" ? localStorage.getItem("heartlink_seen_matches") : null;
          let currentSeen: string[] = [];
          if (saved) {
            try {
              currentSeen = JSON.parse(saved);
            } catch (e) {}
          }

          // Find the first match we haven't notified yet
          const nextMatch = matches.find((m: any) => !currentSeen.includes(m.id));
          if (nextMatch && !showMatchPopup) {
            const other = nextMatch.user1.id === session?.user?.id ? nextMatch.user2 : nextMatch.user1;
            setMatchedUserInfo(other);
            setMatchIdInfo(nextMatch.id);
            setShowMatchPopup(true);

            // Mark as notified/seen in localStorage
            const updatedSeen = [...currentSeen, nextMatch.id];
            if (typeof window !== "undefined") {
              localStorage.setItem("heartlink_seen_matches", JSON.stringify(updatedSeen));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      }
    };

    fetchPendingMatches();
    const interval = setInterval(fetchPendingMatches, 5000);
    return () => clearInterval(interval);
  }, [session, showMatchPopup]);

  const handleLikeBack = async (otherUserId: string) => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: otherUserId, isLike: true }),
      });
      const data = await res.json();
      setActiveLikeNotification(null);
      
      if (data.matched) {
        const other = data.match.user1.id === session?.user?.id ? data.match.user2 : data.match.user1;
        setMatchedUserInfo(other);
        setMatchIdInfo(data.match.id);
        setShowMatchPopup(true);

        // Save to localStorage immediately so polling doesn't trigger again
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
      console.error("Error liking back from notification:", err);
    }
  };

  const handleSwipePass = async (otherUserId: string) => {
    if (!session?.user?.id) return;
    try {
      await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: otherUserId, isLike: false }),
      });
      setActiveLikeNotification(null);
    } catch (err) {
      console.error("Error passing from notification:", err);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/messages/unread");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [session]);

  const navItems = [
    { href: "/discover", icon: Home, label: "Home" },
    { href: "/matches", icon: HeartHandshake, label: "Matches" },
    { href: "/chat", icon: MessageCircle, label: "Chats", badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  return (
    <nav className="w-full px-4 md:px-8 py-3 flex flex-row items-center justify-between absolute top-0 left-0 right-0 z-50 bg-[#d81b60] shadow-md">
      {/* Left: Logo & Brand */}
      <Link href="/discover" className="flex items-center gap-2 md:gap-3 no-underline shrink-0">
        <img src="/img/logo.png" alt="HeartLink" className="w-9 h-9 md:w-12 md:h-12 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-extrabold leading-tight text-white tracking-wide">
            HeartLink
          </h1>
          <p className="text-[11px] font-medium leading-tight text-white/90 hidden sm:block">
            Find Your Perfect Match 💖
          </p>
        </div>
      </Link>

      {/* Right: Nav Icons & Profile */}
      <div className="flex items-center gap-3 md:gap-6 mt-0">
        {/* Nav Links */}
        <div className="flex items-center gap-4 md:gap-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center transition-transform hover:scale-110 no-underline"
                style={{
                  color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="md:w-[28px] md:h-[28px]" />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-pink-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          
          {/* Logout Icon */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center justify-center transition-transform hover:scale-110 no-underline bg-transparent border-none cursor-pointer"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            <LogOut size={24} strokeWidth={2} className="md:w-[28px] md:h-[28px]" />
          </button>
        </div>

        {/* User Profile */}
        {session?.user && (
          <Link href="/profile" className="flex flex-row md:flex-col items-center justify-center ml-2 md:ml-4 no-underline transition-transform hover:scale-105">
            {session.user.image ? (
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/50 bg-pink-50 flex items-center justify-center shrink-0">
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-gray-400 text-white font-bold text-base md:text-xl border-2 border-white/50">
                {session.user.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <span className="text-white text-xs font-bold mt-1 tracking-wide text-center max-w-[80px] truncate hidden sm:block">
              {session.user.name}
            </span>
          </Link>
        )}
      </div>

      {/* Toast Notification for incoming likes */}
      <AnimatePresence>
        {activeLikeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{
              position: "fixed",
              top: "80px",
              right: "24px",
              zIndex: 9999,
              width: "100%",
              maxWidth: "360px",
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.35)",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid white" }}>
                {activeLikeNotification.image ? (
                  <img src={activeLikeNotification.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ff4081, #ff80ab)", color: "white", fontWeight: "bold" }}>
                    {activeLikeNotification.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "white" }}>
                  {activeLikeNotification.name}, {activeLikeNotification.age} menyukai Anda! 💖
                </h4>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {activeLikeNotification.city || "Lokasi tidak diketahui"} • "{activeLikeNotification.bio || "Halo!"}"
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                onClick={() => handleSwipePass(activeLikeNotification.id)}
                className="transition"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Lanjut Swipe
              </button>
              <button
                onClick={() => handleLikeBack(activeLikeNotification.id)}
                className="transition hover:scale-105"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "16px",
                  border: "none",
                  background: "linear-gradient(135deg, #e9407e 0%, #ff80ab 100%)",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(233,64,126,0.3)",
                }}
              >
                Like Balik 💖
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MatchPopup
        show={showMatchPopup}
        currentUser={{ name: session?.user?.name || null, image: session?.user?.image || null }}
        matchedUser={matchedUserInfo || { name: null, image: null }}
        onSendMessage={() => { setShowMatchPopup(false); router.push(`/chat/${matchIdInfo}`); }}
        onKeepSwiping={() => setShowMatchPopup(false)}
      />
    </nav>
  );
}
