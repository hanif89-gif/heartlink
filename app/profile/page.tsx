"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import LocationDetector from "@/app/components/LocationDetector";
import { Loader2, Camera } from "lucide-react";
import { motion } from "framer-motion";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  age: number | null;
  gender: string | null;
  bio: string | null;
  city: string | null;
  province: string | null;
}

export default function ProfilePage() {
  const { update } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", age: "", bio: "", gender: "", city: "" });

  const [detectingLocation, setDetectingLocation] = useState(false);

  const detectLocation = async () => {
    if (!navigator.geolocation) return alert("Browser tidak mendukung GPS");
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });
          const data = await res.json();
          if (res.ok && data.location?.city) {
            setForm((prev) => ({ ...prev, city: data.location.city }));
            setMessage("Lokasi berhasil dideteksi! 📍");
          }
        } catch {}
        setDetectingLocation(false);
      },
      () => { setDetectingLocation(false); alert("Gagal mendapatkan lokasi"); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setForm({
          name: data.user.name || "",
          age: data.user.age?.toString() || "",
          bio: data.user.bio || "",
          gender: data.user.gender || "",
          city: data.user.city || "",
        });
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile berhasil diupdate! ✅ Mengarahkan ke Discover...");
        setUser(data.user);
        await update({
          name: form.name,
          age: parseInt(form.age),
          gender: form.gender
        });
        setTimeout(() => {
          window.location.href = "/discover";
        }, 1500);
      } else {
        setMessage(data.message || "Gagal update");
      }
    } catch { setMessage("Error server"); } finally { setSaving(false); }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/profile/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, image: data.url } : prev);
        await update({ image: data.url });
        setMessage("Foto berhasil diupload! 📸");
      } else {
        setMessage(data.message || "Upload gagal");
      }
    } catch { setMessage("Error upload"); } finally { setUploading(false); }
  };

  if (loading) {
    return (
      <div className="bg-heartlink min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]"><Loader2 size={40} className="animate-spin text-white" /></div>
      </div>
    );
  }

  return (
    <div className="bg-heartlink min-h-screen flex flex-col w-full relative">
      <Navbar />
      <div className="flex-1 flex w-full justify-center items-start w-full px-4" style={{ paddingTop: "140px", paddingBottom: "48px" }}>
        <main className="w-full max-w-5xl flex justify-center" style={{ marginTop: "32px" }}>
          <motion.div 
            className="bg-white p-8 md:p-12 w-full shadow-2xl flex flex-col md:flex-row items-center"
            style={{ borderRadius: "64px", gap: "48px" }}
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Left Column: Photo */}
            <div className="flex flex-col items-center gap-6 md:w-1/3">
              <div className="w-64 h-64 md:w-72 md:h-80 overflow-hidden border-4 border-pink-100 shadow-inner bg-pink-50 flex items-center justify-center relative" style={{ borderRadius: "32px" }}>
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl font-bold text-white w-full h-full flex items-center justify-center" style={{ background: "var(--pink-gradient)" }}>
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <label className="bg-black text-white p-3 rounded-2xl cursor-pointer hover:scale-110 transition shadow-lg flex items-center justify-center mt-2">
                {uploading ? <Loader2 size={28} className="animate-spin" /> : <Camera size={28} fill="currentColor" />}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {/* Right Column: Form */}
            <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
              <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: "#ff6b9e" }}>
                Edit Your Profile
              </h2>

              <form onSubmit={handleSave} className="flex flex-col w-full" style={{ gap: "20px" }}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  className="w-full rounded-full font-bold outline-none text-lg" 
                  style={{ backgroundColor: "#dbdbdb", padding: "16px 24px", color: "#ff6b9e" }}
                />
                <input 
                  type="number" 
                  placeholder="Your Age" 
                  value={form.age} 
                  onChange={(e) => setForm({ ...form, age: e.target.value })} 
                  className="w-full rounded-full font-bold outline-none text-lg" 
                  style={{ backgroundColor: "#dbdbdb", padding: "16px 24px", color: "#ff6b9e" }}
                  min={17} max={99} 
                />
                <input 
                  type="text"
                  placeholder="Explain yourself" 
                  value={form.bio} 
                  onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                  className="w-full rounded-full font-bold outline-none text-lg" 
                  style={{ backgroundColor: "#dbdbdb", padding: "16px 24px", color: "#ff6b9e" }}
                />
                
                <div className="relative w-full">
                  <input 
                    type="text"
                    placeholder="Your Location" 
                    value={form.city} 
                    onChange={(e) => setForm({ ...form, city: e.target.value })} 
                    className="w-full rounded-full font-bold outline-none text-lg" 
                    style={{ backgroundColor: "#dbdbdb", padding: "16px 56px 16px 24px", color: "#ff6b9e" }}
                  />
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition"
                    style={{ color: "#ff6b9e" }}
                    title="Deteksi Lokasi GPS"
                  >
                    {detectingLocation ? <Loader2 size={24} className="animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
                  </button>
                </div>

                <select 
                  value={form.gender} 
                  onChange={(e) => setForm({ ...form, gender: e.target.value })} 
                  className="w-full rounded-full font-bold outline-none text-lg appearance-none cursor-pointer"
                  style={{ backgroundColor: "#dbdbdb", padding: "16px 24px", color: form.gender ? "#ff6b9e" : "rgba(255, 107, 158, 0.6)" }}
                >
                  <option value="" disabled>Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>

                {message && (
                  <div className={`p-4 rounded-3xl text-center font-bold text-sm mt-2 ${message.includes("✅") || message.includes("📸") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message}
                  </div>
                )}

                <div className="flex justify-center mt-4">
                  <button type="submit" disabled={saving} className="text-white font-bold rounded-full transition-all hover:scale-105 shadow-xl disabled:opacity-70 flex items-center justify-center min-w-[200px]" style={{ backgroundColor: "#f03e83", padding: "16px 48px", fontSize: "20px" }}>
                    {saving ? <Loader2 size={28} className="animate-spin" /> : "Confirm"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
