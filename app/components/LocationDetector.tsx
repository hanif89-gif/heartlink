"use client";

import { useState } from "react";
import { MapPin, Loader2, CheckCircle, XCircle } from "lucide-react";

interface LocationDetectorProps {
  onLocationDetected?: (data: {
    latitude: number;
    longitude: number;
    city: string | null;
    province: string | null;
  }) => void;
  currentCity?: string | null;
  currentProvince?: string | null;
}

export default function LocationDetector({
  onLocationDetected,
  currentCity,
  currentProvince,
}: LocationDetectorProps) {
  const [status, setStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");
  const [locationText, setLocationText] = useState(
    currentCity ? `${currentCity}${currentProvince ? `, ${currentProvince}` : ""}` : ""
  );
  const [error, setError] = useState("");

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolocation");
      setStatus("error");
      return;
    }

    setStatus("detecting");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await res.json();

          if (res.ok) {
            const { city, province } = data.location;
            setLocationText(
              `${city || "Unknown"}${province ? `, ${province}` : ""}`
            );
            setStatus("success");
            onLocationDetected?.({ latitude, longitude, city, province });
          } else {
            setError(data.message || "Gagal mendapatkan lokasi");
            setStatus("error");
          }
        } catch {
          setError("Gagal menghubungi server");
          setStatus("error");
        }
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Izin lokasi ditolak. Aktifkan di pengaturan browser.",
          2: "Lokasi tidak tersedia.",
          3: "Timeout mendapatkan lokasi.",
        };
        setError(messages[err.code] || "Error mendapatkan lokasi");
        setStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--pink-primary)" }}
          />
          <input
            type="text"
            value={locationText}
            placeholder="Your Location"
            readOnly
            className="input-heartlink"
            style={{ paddingLeft: "44px" }}
          />
        </div>
        <button
          type="button"
          onClick={detectLocation}
          disabled={status === "detecting"}
          className="btn-heartlink py-3.5 px-5 text-sm whitespace-nowrap"
        >
          {status === "detecting" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : status === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <MapPin size={18} />
          )}
          {status === "detecting" ? "Detecting..." : "Detect"}
        </button>
      </div>
      {status === "error" && (
        <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
          <XCircle size={14} />
          {error}
        </div>
      )}
      {status === "success" && (
        <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
          <CheckCircle size={14} />
          Lokasi terdeteksi!
        </div>
      )}
    </div>
  );
}
