"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AVATARLAR = [
  { icon: "🐰", label: "Pamuk" },
  { icon: "🦊", label: "Tilki" },
  { icon: "🦁", label: "Aslan" },
  { icon: "🐼", label: "Panda" },
  { icon: "🦉", label: "Baykuş" },
  { icon: "🦄", label: "Unicorn" },
];

export default function KayitPage() {
  const router = useRouter();
  const [adSoyad, setAdSoyad] = useState("");
  const [sinifGrup, setSinifGrup] = useState("");
  const [seciliAvatar, setSeciliAvatar] = useState("🦁");
  const [pin, setPin] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);

  async function handleKayit(e: React.FormEvent) {
    e.preventDefault();
    if (!adSoyad.trim()) {
      alert("Lütfen adını ve soyadını yaz!");
      return;
    }

    setKaydediliyor(true);
    try {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ogrenciKayit",
          adSoyad: adSoyad.trim(),
          sinifGrup: sinifGrup.trim() || "Satranç Kulübü",
          avatar: seciliAvatar,
          pin: pin.trim() || "1234",
        }),
      });

      const json = await res.json();
      if (json.success) {
        // Tarayıcı hafızasına kaydet (Öğrenciyi otomatik tanısın)
        localStorage.setItem("satranc_ogrenci", JSON.stringify(json.data));
        alert(`🎉 Harika! Hoş geldin, ${adSoyad}! Hesabın oluşturuldu.`);
        router.push("/odev");
      } else {
        alert("Bir sorun oluştu, lütfen tekrar dene.");
      }
    } catch {
      alert("Bağlantı hatası oluştu.");
    }
    setKaydediliyor(false);
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "4px solid #f59e0b",
        boxShadow: "0 15px 30px rgba(245, 158, 11, 0.2)",
        margin: "10px auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "50px" }}>🌟</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#78350f", margin: "6px 0 2px 0" }}>
          Öğrenci Kulüp Kartı
        </h1>
        <p style={{ fontSize: "12px", color: "#92400e", fontWeight: "600", margin: 0 }}>
          Kendi profilini oluştur, satranç maceralarına başla!
        </p>
      </div>

      <form onSubmit={handleKayit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Ad Soyad */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "#334155", marginBottom: "4px" }}>
            👤 Adın ve Soyadın:
          </label>
          <input
            type="text"
            placeholder="Örn: Efe Yılmaz"
            value={adSoyad}
            onChange={(e) => setAdSoyad(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              fontSize: "13px",
              fontWeight: "bold",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Sınıf / Grup */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "#334155", marginBottom: "4px" }}>
            🏫 Sınıfın veya Grubun:
          </label>
          <input
            type="text"
            placeholder="Örn: 2-A veya Cumartesi Sabah"
            value={sinifGrup}
            onChange={(e) => setSinifGrup(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              fontSize: "13px",
              fontWeight: "bold",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Avatar Seçimi */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "#334155", marginBottom: "6px" }}>
            🦁 Sevimli Takım Arkadaşını Seç:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
            {AVATARLAR.map((av) => {
              const isSelected = seciliAvatar === av.icon;
              return (
                <button
                  key={av.icon}
                  type="button"
                  onClick={() => setSeciliAvatar(av.icon)}
                  style={{
                    padding: "8px 2px",
                    borderRadius: "12px",
                    border: isSelected ? "3px solid #f59e0b" : "2px solid #e2e8f0",
                    backgroundColor: isSelected ? "#fef3c7" : "#f8fafc",
                    fontSize: "22px",
                    cursor: "pointer",
                    transform: isSelected ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {av.icon}
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Kodu */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "#334155", marginBottom: "4px" }}>
            🔑 Kolay Şifren (PIN - İsteğe Bağlı):
          </label>
          <input
            type="text"
            maxLength={4}
            placeholder="Örn: 1234"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              fontSize: "13px",
              fontWeight: "bold",
              textAlign: "center",
              letterSpacing: "4px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={kaydediliyor}
          style={{
            marginTop: "6px",
            padding: "12px",
            backgroundColor: "#10b981",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "14px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
          }}
        >
          {kaydediliyor ? "Kaydediliyor... ⏳" : "Kayıt Ol ve Başla 🚀"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <Link href="/odev" style={{ fontSize: "11px", color: "#64748b", textDecoration: "none", fontWeight: "700" }}>
          Zaten kayıtlı mısın? Doğrudan Ödeve Git ➔
        </Link>
      </div>
    </div>
  );
}
