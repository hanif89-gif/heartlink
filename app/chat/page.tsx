"use client";

import Navbar from "@/app/components/Navbar";
import ChatSidebar from "@/app/components/ChatSidebar";
import { motion } from "framer-motion";

export default function ChatListPage() {
  return (
    <div className="bg-heartlink min-h-screen flex flex-col">
      <Navbar />
      <main style={{ flex: 1, maxWidth: "1152px", margin: "0 auto", width: "100%", display: "flex", padding: "16px", paddingTop: "96px", height: "100vh" }}>
        {/* Chat container */}
        <div style={{ flex: 1, display: "flex", background: "rgba(255,255,255,0.2)", borderRadius: "32px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}>
          
          <ChatSidebar />
          
          {/* Right side placeholder for desktop */}
          <div className="hidden md:flex" style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", background: "rgba(255,255,255,0.3)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>💬</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--pink-primary)", marginBottom: "8px" }}>Select a Conversation</h3>
              <p style={{ color: "var(--text-gray)" }}>Choose a match from the sidebar to start chatting.</p>
            </motion.div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
