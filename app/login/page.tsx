"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Email atau password salah");
      } else {
        const session = await getSession();
        if ((session?.user as any)?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/discover");
        }
      }
    } catch {
      setError("Terjadi error, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/discover" });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — Form Card Container (Pink Gradient) */}
      <div className="flex-1 lg:flex-[0.45] bg-heartlink flex items-center justify-center p-6 relative overflow-hidden">
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

          <motion.h2 
            className="text-2xl font-bold text-center mb-1" 
            style={{ color: "white" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back!
          </motion.h2>

          <motion.p 
            className="text-xs mb-8 text-center font-bold" 
            style={{ color: "#ffeef5" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Find your perfect match again 💖
          </motion.p>

          <div className="text-center mb-3">
            <span className="font-bold text-sm" style={{ color: "white" }}>Log in</span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-auth input-auth-icon"
                style={{ backgroundColor: 'white', color: 'var(--text-dark)' }}
                required
              />
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-auth input-auth-icon"
                style={{ backgroundColor: 'white', color: 'var(--text-dark)', paddingRight: '48px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
              {loading ? <Loader2 size={24} className="animate-spin" /> : "Log in"}
            </motion.button>

            <motion.div 
              className="text-center mt-2 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <Link href="#" className="text-[10px] transition font-medium hover:text-white" style={{ color: '#ffeef5' }}>Forget password</Link>
            </motion.div>
          </form>

          {/* Google Login */}
          <div className="text-center mt-2">
            <span className="text-[10px] font-medium" style={{ color: '#ffeef5' }}>Login with Google:</span>
          </div>
          <motion.div
            className="flex justify-center mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={handleGoogleLogin}
              className="hover:scale-110 transition transform"
              style={{ backgroundColor: 'white', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right — Light Pink Panel with Illustration */}
      <div className="hidden lg:flex flex-1 lg:flex-[0.55] flex-col items-center justify-center p-12 relative" style={{ backgroundColor: "#fcecf4" }}>
        <motion.div
          className="flex flex-col items-center text-center max-w-[400px]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img src="/img/logo.png" alt="HeartLink" className="w-40 h-40 object-contain mb-8" />

          {/* Couple Illustration */}
          <motion.div
            className="mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <img
              src="/img/gambar log in.png"
              alt="Couple Illustration"
              className="w-64 h-auto object-contain"
            />
          </motion.div>

          <p className="font-bold text-sm mb-12" style={{ color: "var(--pink-primary)" }}>
            Find your perfect match 💖
          </p>

          <Link
            href="/register"
            className="inline-block bg-[#eef0f2] hover:bg-[#e2e4e7] text-pink-500 font-bold text-xl py-4 px-16 rounded-full transition hover:shadow-lg w-full"
          >
            Register
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
