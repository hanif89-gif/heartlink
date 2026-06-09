"use client";

import { MapPin, X, Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
  user: {
    id: string;
    name: string | null;
    age: number | null;
    bio: string | null;
    image: string | null;
    city: string | null;
    distance?: number | null;
  };
  variant?: "discover" | "match";
  onLike?: () => void;
  onDislike?: () => void;
  onChat?: () => void;
  drag?: boolean;
}

export default function ProfileCard({
  user,
  variant = "discover",
  onLike,
  onDislike,
  onChat,
  drag = false,
}: ProfileCardProps) {
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100 && onLike) {
      onLike();
    } else if (info.offset.x < -100 && onDislike) {
      onDislike();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      drag={drag ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, rotate: 2 }}
      style={{
        width: "100%",
        maxWidth: "320px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Photo */}
      <div style={{ position: "relative", width: "100%", height: "360px", backgroundColor: "#ffeef5", overflow: "hidden" }}>
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "72px",
              fontWeight: 700,
              color: "white",
              background: "var(--pink-gradient)",
            }}
          >
            {user.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)" }} />
      </div>

      {/* Info */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "var(--text-dark)" }}>
          {user.name || "Unknown"}{user.age ? `, ${user.age}` : ""}
        </h3>

        {user.bio && (
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "0.875rem",
              color: "var(--text-gray)",
              lineHeight: "1.5",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {user.bio}
          </p>
        )}

        {user.city && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px" }}>
            <MapPin size={14} style={{ color: "var(--pink-primary)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-gray)" }}>
              {user.city}
              {user.distance !== undefined && user.distance !== null && (
                <span style={{ marginLeft: "4px", fontSize: "0.75rem", color: "var(--text-light)" }}>• {user.distance} km</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ padding: "0 20px 20px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        {variant === "discover" ? (
          <>
            <motion.button
              onClick={onDislike}
              whileHover={{ scale: 1.05, backgroundColor: "#fff5f5" }}
              whileTap={{ scale: 0.95 }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                border: "2px solid #ff4444",
                color: "#ff4444",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              <X size={24} />
              <span style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Next</span>
            </motion.button>
            <motion.button
              onClick={onLike}
              whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(233, 64, 126, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                border: "none",
                background: "var(--pink-gradient)",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "var(--shadow-button)",
              }}
            >
              <Heart size={24} fill="white" />
              <span style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Like</span>
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={onChat}
            whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(233, 64, 126, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              background: "var(--pink-gradient)",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "9999px",
              cursor: "pointer",
              boxShadow: "var(--shadow-button)",
              fontSize: "0.875rem",
            }}
          >
            <MessageCircle size={18} />
            Start Chat
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
