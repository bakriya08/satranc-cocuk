"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AVATARLAR = ["🦁", "🦊", "🐼", "🐻", "🦄", "🐯", "🐰", "🐨", "🐸", "🚀", "⚡", "👑"];

export default function KayitPage() {
  const router = useRouter();

  const [adSoyad, setAdSoyad] = useState("");
  const [sinifGrup, setSinifGrup] = useState("");
  const [avatar, setAvatar] = useState("🦁");
  const [pin, setPin] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState("");

  // Başarılı kayıt sonrası sporcu kartı ve hesap bağlama durumu
  const [kayitTamamlandi, setKayitTamamlandi] = useState(false);
  const [kayitliOgrenci, setKayitliOgrenci] = useState<{
    id: string;
    adSoyad: string;
    sinifGrup: string;
    avatar: string;
    pin: string;
    kayitTarihi: string;
    lichessKadi?: string;
    chessComKadi?: string;
  } | null>(null);

  // Lichess ve Chess.com input state'leri
  const [lichess, setLichess] = useState("");
  const [chessCom, setChessCom] = useState("");
  const [hesaplarKaydedildi, setHesaplarKaydedildi] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adSoyad.trim()) {
      setHataMesaji("Lütfen öğrencinin adını ve soyadını yazın!");
      return;
    }

    const sonPin = pin.trim() || "1234";

    setYukleniyor(true);
    setHataMesaji("");

    try {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ogrenciKayit",
          adSoyad: adSoyad.trim(),
          sinifGrup: (sinifGrup || "Genel").trim(),
          avatar: avatar,
          pin: sonPin,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const ogrenciVerisi = { ...data.data, lichessKadi: "", chessComKadi: "" };
        localStorage.setItem("aktifOgrenci", JSON.stringify(ogrenciVerisi));

        setKayitliOgrenci(ogrenciVerisi);
        setKayitTamamlandi(true);
      } else {
        setHataMesaji(data.message || "Kayıt yapılırken bir sorun oluştu.");
      }
    } catch {
      setHataMesaji("Sunucu bağlantı hatası oluştu.");
    } finally {
      setYukleniyor(false);
    }
  }

  // Lichess ve Chess.com hesaplarını kaydetme
  function handleHesaplariBagla(e: React.FormEvent) {
    e.preventDefault();
    if (!kayitliOgrenci) return;

    const guncelOgrenci = {
      ...kayitliOgrenci,
      lichessKadi: lichess.trim(),
      chessComKadi: chessCom.trim(),
    };

    setKayitliOgrenci(guncelOgrenci);
    localStorage.setItem("aktifOgrenci", JSON.stringify(guncelOgrenci));

    // Kulüp kayıt listesine de yansıt (Öğretmen paneli için)
    try {
      const mevcutListe = JSON.parse(localStorage.getItem("sevimliSatrancKulupKayitlari") || "[]");
      const yeniListe = mevcutListe.map((item: any) => 
        item.id === guncelOgrenci.id ? { ...item, lichessKadi: lichess.trim(), chessComKadi: chessCom.trim() } : item
      );
      localStorage.setItem("sevimliSatrancKulupKayitlari", JSON.stringify(yeniListe));
    } catch {}

    setHesaplarKaydedildi(true);
  }

  // Kartı Canvas ile Resim (.png) Olarak İndirme
  function handleKartiIndir() {
    if (!kayitliOgrenci) return;

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 600, 360);
    gradient.addColorStop(0, "#312e81");
    gradient.addColorStop(0.5, "#4338ca");
    gradient.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, 600, 360, 24);
    ctx.fill();

    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 6;
    ctx.roundRect(10, 10, 580, 340, 20);
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("♟️ SATRANÇ KULÜBÜ RESMİ SPORCU KARTI ♟️", 300, 48);

    ctx.fillStyle = "#e0e7ff";
    ctx.font = "13px Arial";
    ctx.fillText("Türkiye Satranç Eğitim Ağı • Lisans No: #" + kayitliOgrenci.id.slice(-6), 300, 72);

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 90);
    ctx.lineTo(570, 90);
    ctx.stroke();

    ctx.font = "90px Arial";
    ctx.textAlign = "center";
    ctx.fillText(kayitliOgrenci.avatar, 110, 210);

    ctx.textAlign = "left";

    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 13px Arial";
    ctx.fillText("SPORCU ADI SOYADI", 200, 135);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.fillText(kayitliOgrenci.adSoyad, 200, 165);

    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 13px Arial";
    ctx.fillText("KULÜP / GRUP", 200, 205);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial";
    ctx.fillText(kayitliOgrenci.sinifGrup || "Genel Grubu", 200, 230);

    ctx.fillStyle = "#fef08a";
    ctx.roundRect(380, 255, 180, 65, 12);
    ctx.fill();
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 2;
    ctx.roundRect(380, 255, 180, 65, 12);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#854d0e";
    ctx.font = "bold 11px Arial";
    ctx.fillText("GİRİŞ KODUN (PIN)", 470, 275);
    ctx.fillStyle = "#a16207";
    ctx.font = "bold 26px Arial";
    ctx.fillText(kayitliOgrenci.pin, 470, 308);

    ctx.textAlign = "left";
    ctx.fillStyle = "#a5b4fc";
    ctx.font = "12px Arial";
    ctx.fillText("Kayıt Tarihi: " + kayitliOgrenci.kayitTarihi, 40, 315);

    const link = document.createElement("a");
    link.download = `${kayitliOgrenci.adSoyad.replace(/\s+/g, "_")}_Satranc_Karti.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "4px solid #8b5cf6",
        boxShadow: "0 15px 30px rgba(139, 92, 246, 0.15)",
        margin: "20px auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "50px" }}>👑</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#1e293b", margin: "8px 0" }}>
          Satranç Kulübüne Katıl!
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Kendi sporcu kartını oluştur, haftalık ödevleri çöz ve rozetleri topla!
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>
            👤 Öğrencinin Adı Soyadı *
          </label>
          <input
            type="text"
            placeholder="Örn: Efe Yılmaz"
            value={adSoyad}
            onChange={(e) => setAdSoyad(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>
            🏫 Sınıf veya Okul / Kulüp Grubu
          </label>
          <input
            type="text"
            placeholder="Örn: 2-A Sınıfı veya Bolu Grubu"
            value={sinifGrup}
            onChange={(e) => setSinifGrup(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>
            🦁 Kulüp Maskotunu Seç:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
            {AVATARLAR.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setAvatar(item)}
                style={{
                  fontSize: "26px",
                  padding: "8px 0",
                  backgroundColor: avatar === item ? "#ede9fe" : "#f8fafc",
                  border: avatar === item ? "3px solid #8b5cf6" : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transform: avatar === item ? "scale(1.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "800", color: "#334155" }}>
              🔑 4 Haneli Giriş PIN Kodu
            </label>
            <span style={{ fontSize: "11px", color: "#64748b" }}>(Boş bırakılırsa 1234 olur)</span>
          </div>
          <input
            type="text"
            maxLength={6}
            placeholder="Örn: 1234 veya doğum yılı"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              letterSpacing: "2px",
            }}
          />
        </div>

        {hataMesaji && (
          <div style={{ color: "#dc2626", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>
            {hataMesaji}
          </div>
        )}

        <button
          type="submit"
          disabled={yukleniyor}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#8b5cf6",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "14px",
            borderRadius: "14px",
            border: "none",
            cursor: yukleniyor ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
          }}
        >
          {yukleniyor ? "Kaydediliyor... ⏳" : "🌟 Kulübe Katıl ve Kartımı Al"}
        </button>
      </form>

      {/* BAŞARILI KAYIT SONRASI AÇILAN SPORCU LİSANS KARTI VE HESAP BAĞLAMA MODALI */}
      {kayitTamamlandi && kayitliOgrenci && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 100,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "24px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              textAlign: "center",
              maxHeight: "95vh",
              overflowY: "auto",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "2px" }}>🎉</div>
            <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#1e293b", margin: "0 0 4px 0" }}>
              Kulübe Hoş Geldin, {kayitliOgrenci.adSoyad}!
            </h2>
            <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "14px" }}>
              Sporcu kartınızı indirebilir ve hemen alt kısımdan Lichess / Chess.com hesaplarınızı bağlayabilirsiniz.
            </p>

            {/* KART ÖNİZLEMESİ */}
            <div
              style={{
                background: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #1e1b4b 100%)",
                borderRadius: "18px",
                border: "4px solid #fbbf24",
                padding: "16px",
                color: "#ffffff",
                textAlign: "left",
                boxShadow: "0 10px 25px rgba(67, 56, 202, 0.4)",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "8px", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "900", color: "#fbbf24", letterSpacing: "1px" }}>
                    ♟️ SATRANÇ KULÜBÜ
                  </div>
                  <div style={{ fontSize: "8px", color: "#c7d2fe" }}>Resmi Sporcu Kartı</div>
                </div>
                <div style={{ fontSize: "10px", color: "#fbbf24", fontWeight: "bold" }}>
                  #{kayitliOgrenci.id.slice(-6)}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    fontSize: "40px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "14px",
                    padding: "4px 8px",
                    border: "2px solid rgba(251, 191, 36, 0.4)",
                  }}
                >
                  {kayitliOgrenci.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "9px", color: "#93c5fd", fontWeight: "bold" }}>SPORCU ADI</div>
                  <div style={{ fontSize: "15px", fontWeight: "900", color: "#ffffff", marginBottom: "4px" }}>
                    {kayitliOgrenci.adSoyad}
                  </div>
                  <div style={{ fontSize: "9px", color: "#93c5fd", fontWeight: "bold" }}>KULÜP / SINIF</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold", color: "#e0e7ff" }}>
                    {kayitliOgrenci.sinifGrup}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  padding: "6px 10px",
                  backgroundColor: "#fef08a",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "2px solid #ca8a04",
                }}
              >
                <span style={{ fontSize: "10px", fontWeight: "bold", color: "#854d0e" }}>🔑 PIN Kodu:</span>
                <span style={{ fontSize: "16px", fontWeight: "900", color: "#a16207", letterSpacing: "2px" }}>
                  {kayitliOgrenci.pin}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleKartiIndir}
              style={{
                width: "100%",
                padding: "9px",
                backgroundColor: "#f59e0b",
                color: "#ffffff",
                borderRadius: "10px",
                border: "none",
                fontWeight: "900",
                fontSize: "12px",
                cursor: "pointer",
                marginBottom: "16px",
              }}
            >
              📸 Sporcu Kartını Resim Olarak İndir
            </button>

            {/* LİCHESS VE CHESS.COM HESABI BAĞLAMA ALANI (KAYIT OLDUKTAN SONRA GÖZÜKÜR) */}
            <div style={{ backgroundColor: "#f0fdf4", border: "2px solid #86efac", borderRadius: "16px", padding: "14px", marginBottom: "16px", textAlign: "left" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "900", color: "#166534", margin: "0 0 8px 0" }}>
                🌐 Lichess / Chess.com Hesabını Bağla
              </h3>
              
              {!hesaplarKaydedildi ? (
                <form onSubmit={handleHesaplariBagla} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "bold", color: "#15803d", display: "block", marginBottom: "2px" }}>Lichess Kullanıcı Adı</label>
                    <input
                      type="text"
                      placeholder="Örn: lichess_kadi"
                      value={lichess}
                      onChange={(e) => setLichess(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #86efac", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "bold", color: "#15803d", display: "block", marginBottom: "2px" }}>Chess.com Kullanıcı Adı</label>
                    <input
                      type="text"
                      placeholder="Örn: chesscom_kadi"
                      value={chessCom}
                      onChange={(e) => setChessCom(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #86efac", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      marginTop: "4px",
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#16a34a",
                      color: "#ffffff",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    ✨ Hesapları Kaydet ve Öğretmene Gönder
                  </button>
                </form>
              ) : (
                <div style={{ color: "#15803d", fontSize: "12px", fontWeight: "bold", textAlign: "center", padding: "6px" }}>
                  ✅ Platform hesapların başarıyla bağlandı!
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => router.push("/odev")}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                borderRadius: "12px",
                border: "none",
                fontWeight: "900",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              🚀 Ödevlerime Git ve Başla!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
