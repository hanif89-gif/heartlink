"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, X } from "lucide-react";

interface MatchPopupProps {
  show: boolean;
  currentUser: { name: string | null; image: string | null };
  matchedUser: { name: string | null; image: string | null };
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

export default function MatchPopup({ show, currentUser, matchedUser, onSendMessage, onKeepSwiping }: MatchPopupProps) {
  const hearts = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      left: `${(i * 12 + 5) % 100}%`,
      fontSize: `${16 + i * 3}px`,
      yTarget: -500,
      rotate: i * 45,
      duration: 2 + i * 0.3,
      delay: i * 0.25,
    })), []
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Backdrop (clickable to dismiss) */}
          <div 
            onClick={onKeepSwiping} 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer" 
            style={{ zIndex: 1 }}
          />

          {/* Modal Container */}
          <motion.div 
            className="relative text-center px-6 py-10 md:px-8 md:py-12" 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            exit={{ scale: 0 }} 
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            style={{
              zIndex: 10,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "32px",
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
              maxWidth: "440px",
              width: "100%",
            }}
          >
            {/* Close Button */}
            <button 
              onClick={onKeepSwiping} 
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition border-none cursor-pointer"
              style={{ zIndex: 20 }}
            >
              <X size={20} />
            </button>

            {/* Floating hearts */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
              {hearts.map((h, i) => (
                <motion.div key={i} className="absolute text-pink-300" style={{ left: h.left, bottom: "-20px", fontSize: h.fontSize }}
                  animate={{ y: [0, h.yTarget], opacity: [1, 0], rotate: [0, h.rotate] }}
                  transition={{ duration: h.duration, repeat: Infinity, delay: h.delay, ease: "easeOut" }}>❤️</motion.div>
              ))}
            </div>

            <motion.div className="animate-heartbeat mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <Heart size={80} fill="#e9407e" color="#e9407e" className="mx-auto drop-shadow-lg" />
            </motion.div>

            <motion.h2 className="text-3xl font-black text-white mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              It&apos;s a Match! 🎉
            </motion.h2>

            <motion.div className="flex items-center justify-center gap-5 mb-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden mx-auto mb-2" style={{ boxShadow: "0 4px 20px rgba(233,64,126,0.4)" }}>
                  {currentUser.image ? <img src={currentUser.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white" style={{ background: "var(--pink-gradient)" }}>{currentUser.name?.charAt(0) || "?"}</div>}
                </div>
                <p className="text-white font-medium text-xs truncate max-w-[90px]">{currentUser.name}</p>
              </div>
              <span className="text-3xl">💕</span>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden mx-auto mb-2" style={{ boxShadow: "0 4px 20px rgba(233,64,126,0.4)" }}>
                  {matchedUser.image ? <img src={matchedUser.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white" style={{ background: "var(--pink-gradient)" }}>{matchedUser.name?.charAt(0) || "?"}</div>}
                </div>
                <p className="text-white font-medium text-xs truncate max-w-[90px]">{matchedUser.name}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col gap-3" 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.5 }}
              style={{ zIndex: 20, position: "relative" }}
            >
              <button 
                onClick={onSendMessage} 
                className="btn-heartlink w-full border-none cursor-pointer font-bold flex items-center justify-center gap-2"
                style={{ zIndex: 21 }}
              >
                <MessageCircle size={20} />Lanjut Chat
              </button>
              <button 
                onClick={onKeepSwiping} 
                className="btn-heartlink btn-outline w-full cursor-pointer font-bold" 
                style={{ color: "white", borderColor: "white", zIndex: 21 }}
              >
                Lanjut Swipe
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
