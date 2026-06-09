"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Heart, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  const previewUsers = [
    {
      name: "Jessica Jane",
      age: 22,
      bio: "Love music & fishing 🎵",
      city: "Cimahi",
      image: "/img/Jessica.png",
    },
    {
      name: "Luna Maya",
      age: 32,
      bio: "Love music & coffee ☕",
      city: "Bandung",
      image: "/img/Luna.png",
    },
    {
      name: "Eriko Lim",
      age: 27,
      bio: "Love Game and sport 🎮",
      city: "Bandung",
      image: "/img/Eriko.png",
    },
  ];

  return (
    <div className="bg-heartlink min-h-screen relative overflow-hidden">
      {/* Decorative blobs */}
      <div style={{ position: "absolute", left: "-80px", bottom: "-80px", width: "320px", height: "320px", background: "rgba(255,255,255,0.08)", borderRadius: "50%", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", right: "-40px", top: "100px", width: "260px", height: "260px", background: "rgba(255,255,255,0.08)", borderRadius: "50%", filter: "blur(50px)" }} />

      {/* Header / Navbar */}
      <header className="landing-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/img/logo.png" alt="HeartLink" style={{ width: "44px", height: "44px", objectFit: "contain" }} />
          <div>
            <h1 style={{ color: "white", fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>HeartLink</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: 0 }}>Find Your Perfect Match</p>
          </div>
        </div>
        <div className="landing-header-buttons" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link href="/login" style={{ color: "white", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>
            Log in
          </Link>
          <Link href="/register" style={{ color: "white", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem", background: "rgba(255,255,255,0.18)", padding: "8px 22px", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.3)" }}>
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section — Two Column */}
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "72px" }}>
        <div className="landing-container">

          {/* LEFT — Text + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="landing-left"
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "9999px", padding: "6px 16px", width: "fit-content" }}
            >
              <Sparkles size={14} color="white" />
              <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 600 }}>Dating App #1 in Indonesia</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="landing-title"
            >
              Find Your<br />
              <span style={{ color: "#ffe0f0" }}>Perfect Match</span><br />
              Today 💖
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="landing-subtext"
              style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", lineHeight: 1.7, margin: 0, maxWidth: "420px" }}
            >
              Swipe, match, dan mulai cerita cinta baru bersama ribuan orang nyata yang menunggumu.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="landing-actions"
              style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}
            >
              <Link
                href="/register"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "white", color: "#e91e8c", fontWeight: 700, fontSize: "1.05rem", padding: "16px 36px", borderRadius: "9999px", textDecoration: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link href="/login" style={{ color: "white", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem", opacity: 0.9 }}>
                Sudah punya akun? →
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="landing-stats"
              style={{ display: "flex", gap: "32px", marginTop: "8px" }}
            >
              {[
                { label: "Users Registered", value: "10K+" },
                { label: "Matches Made", value: "50K+" },
                { label: "Happy Couples", value: "2K+" },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ color: "white", fontWeight: 800, fontSize: "1.4rem" }}>{stat.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — Staggered Profile Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="landing-cards-container"
          >
            {previewUsers.map((user, index) => {
              const offsets = [
                { left: "0px", top: "40px", rotate: "-6deg", zIndex: 10, scale: 0.92 },
                { left: "100px", top: "0px", rotate: "0deg", zIndex: 20, scale: 1 },
                { left: "200px", top: "40px", rotate: "6deg", zIndex: 10, scale: 0.92 },
              ];
              const o = offsets[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.15 }}
                  whileHover={{ y: -12, scale: Number(o.scale) + 0.05, zIndex: 30, transition: { duration: 0.2 } }}
                  style={{
                    position: "absolute",
                    left: o.left,
                    top: o.top,
                    width: "195px",
                    background: "white",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
                    transform: `rotate(${o.rotate}) scale(${o.scale})`,
                    zIndex: o.zIndex,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ height: "215px", overflow: "hidden", background: "#fce4ec" }}>
                    <img src={user.image} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", margin: 0 }}>{user.name}, {user.age}</h3>
                    <p style={{ fontSize: "11px", color: "#888", marginTop: "4px", margin: "4px 0 0 0" }}>{user.bio}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                      <MapPin size={11} color="#ef4444" />
                      <span style={{ fontSize: "11px", color: "#888" }}>{user.city}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                      <button style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #fce4ec", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#f48fb1", cursor: "pointer", fontSize: "15px", fontWeight: 700 }}>✕</button>
                      <button style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#e9407e,#d63384)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(233,64,126,0.5)" }}>
                        <Heart size={15} fill="white" color="white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </main>
    </div>
  );
}