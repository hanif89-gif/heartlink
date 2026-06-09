"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader2, Heart } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!gender) {
      setError("Pilih gender terlebih dahulu");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, gender }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      router.push("/login");
    } catch {
      setError("Terjadi error, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — Form Card Container (Soft Pink Gradient) */}
      <div className="flex-1 lg:flex-[0.45] flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #ffa8d2 0%, #f4eff1 100%)' }}>
        <motion.div
          className="w-full rounded-[48px] shadow-2xl relative z-10"
          style={{ maxWidth: "480px", padding: "40px 48px", backgroundColor: "#e9407e" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <motion.div 
            className="flex flex-col items-center gap-2 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <img src="/img/logo.png" alt="HeartLink" className="w-24 h-24 object-contain" />
            <span className="text-3xl font-bold mt-1" style={{ color: "white" }}>
              HeartLink
            </span>
          </motion.div>

          <motion.p 
            className="text-[10px] mb-2 text-center font-bold" 
            style={{ color: "#ffeef5" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Find your perfect match 💖
          </motion.p>

          <motion.h2 
            className="text-2xl font-bold text-center mb-6" 
            style={{ color: "white" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Register
          </motion.h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <motion.div className="relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="input-auth input-auth-icon" style={{ backgroundColor: "white", color: "var(--text-dark)" }} required />
            </motion.div>
            
            <motion.div className="relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-auth input-auth-icon" style={{ backgroundColor: "white", color: "var(--text-dark)" }} required />
            </motion.div>

            <motion.div className="relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
              <Heart size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input-auth input-auth-icon"
                style={{
                  backgroundColor: "white",
                  color: gender ? "var(--text-dark)" : "#9ca3af",
                  appearance: "none",
                  cursor: "pointer"
                }}
                required
              >
                <option value="" disabled hidden>Select Gender</option>
                <option value="MALE" style={{ color: "var(--text-dark)" }}>Male</option>
                <option value="FEMALE" style={{ color: "var(--text-dark)" }}>Female</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" style={{ fontSize: "10px" }}>▼</div>
            </motion.div>
            
            <motion.div className="relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-auth input-auth-icon" style={{ backgroundColor: "white", color: "var(--text-dark)" }} required minLength={6} />
            </motion.div>
            
            <motion.div className="relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-auth input-auth-icon" style={{ backgroundColor: "white", color: "var(--text-dark)" }} required minLength={6} />
            </motion.div>
            
            <motion.button 
              type="submit" 
              disabled={loading} 
              className="btn-auth mt-2"
              style={{ backgroundColor: 'white', color: '#e9407e' }}
              whileHover={{ scale: 1.02, backgroundColor: '#ffeef5' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : "Register"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Right — Pink Gradient Panel with Illustration */}
      <div className="hidden lg:flex flex-1 lg:flex-[0.55] flex-col items-center justify-center p-12 relative bg-heartlink">
        <motion.div
          className="flex flex-col items-center text-center max-w-[400px]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img src="/img/logo.png" alt="HeartLink" className="w-32 h-32 object-contain mb-8" />

          {/* Couple Illustration */}
          <motion.div
            className="mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <img
              src="/img/gambar resgister.png"
              alt="Couple Illustration"
              className="w-72 h-auto object-contain"
            />
          </motion.div>

          <p className="font-bold text-xs mb-12" style={{ color: "var(--pink-primary)" }}>
            Start to find your perfect match 💖
          </p>

          <Link
            href="/login"
            className="inline-block bg-[#e84282] hover:bg-[#d6326e] text-white font-bold text-xl py-4 px-16 rounded-full transition hover:shadow-lg w-[80%] mx-auto text-center"
          >
            Log in
          </Link>
        </motion.div>
      </div>
    </div>
  );
}