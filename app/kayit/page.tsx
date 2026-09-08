"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OgrenciKayit {
  id: string;
  adSoyad: string;
  karakter: string;
  veliAdi: string;
  pinKodu: string;
  lichessKadi: string;
  chessComKadi: string;
  seviye: string;
  tarih: string;
}

const KARAKTERLER = [
  { id: "aslan", ad: "Aslan Şakir", simge: "🦁" },
  { id: "tavsan", ad: "Tavşan Pamuk", simge: "🐰" },
  { id: "tilki", ad: "Dedektif Tilki", simge: "🦊" },
  { id: "baykus", ad: "Bilge Baykuş", simge: "🦉" },
  { id: "panda", ad: "Panda Po", simge: "🐼" },
  { id: "kedi", ad: "Sevimli Kedi", simge: "🐱" },
];

export default function KayitPage() {
  const [adSoyad, setAdSoyad] = useState("");
  const [secilenKarakter, setSecilenKarakter] = useState("🦁 Aslan Şakir");
  const [veliAdi, setVeliAdi] = useState("");
  const [pinKodu, setPinKodu] = useState("");
  const [lichessKadi, setLichessKadi] = useState("");
  const [chessComKadi, setChessComKadi] = useState("");
  const [seviye, setSeviye] = useState("Başlangıç");

  const [kayitliOgrenciler, setKayitliOgrenciler] = useState<OgrenciKayit[]>([]);
  const [mesaj, setMesaj] = useState<{ text: string; tip: "basari" | "hata" } | null>(null);

  useEffect(() => {
    try {
      const mevcut = localStorage.getItem("sevimliSatrancKulupKayitlari");
      if (mevcut) {
        setKayitliOgrenciler(JSON.parse(mevcut));
      }
    } catch {}
  }, []);

  function guncelleVeKaydet(yeniListe: OgrenciKayit[]) {
    setKayitliOgrenciler(yeniListe);
    try {
      localStorage.setItem("sevimliSatrancKulupKayitlari", JSON.stringify(yeniListe));
    } catch {}
  }

  function handleKayitOl(e: React.FormEvent) {
    e.preventDefault();
    if (!adSoyad.trim() || !pinKodu.trim() || !veliAdi.trim()) {
      setMesaj({ text: "⚠️ Lütfen Ad Soyad, Veli Adı ve gizli PIN kodunu doldurun!", tip: "hata" });
      return;
    }

    const yeniKayit: OgrenciKayit = {
      id: Date.now().toString(),
      adSoyad: adSoyad.trim(),
      karakter: secilenKarakter,
      veliAdi: veliAdi.trim(),
      pinKodu: pinKodu.trim(),
      lichessKadi: lichessKadi.trim() || "-",
      chessComKadi: chessComKadi.trim() || "-",
      seviye,
      tarih: new Date().toLocaleDateString("tr-TR"),
    };

    const guncelListe = [yeniKayit, ...kayitliOgrenciler];
    guncelleVeKaydet(guncelListe);

    setMesaj({ text: "🎉 Harika! Kulübe başarıyla kaydoldun ve hesapların öğretmene iletildi.", tip: "basari" });
    setAdSoyad("");
    setVeliAdi("");
    setPinKodu("");
    setLichessKadi("");
    setChessComKadi("");
    setTimeout(() => setMesaj(null), 5000);
  }

  function handleTemizle() {
    if (confirm("Tüm kayıtları silmek istediğinize emin misiniz?")) {
      setKayitliOgrenciler([]);
      localStorage.removeItem("sevimliSatrancKulupKayitlari");
    }
  }

  return (
    <div
      style={{
        maxWidth: "840px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #8b5cf6",
        boxShadow: "0 10px 30px rgba(139, 92, 246, 0.1)",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "40px" }}>🌟🎭</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#5b21b6", margin: "6px 0" }}>
          Sevimli Satranç Kulübü & Karakter Kaydı
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Karakterini seç, PIN kodunu belirle, Lichess / Chess.com hesaplarını bağla!
        </p>
      </div>

      {mesaj && (
        <div
          style={{
            backgroundColor: mesaj.tip === "basari" ? "#f0fdf4" : "#fef2f2",
            border: `2px solid ${mesaj.tip === "basari" ? "#22c55e" : "#ef4444"}`,
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
            color: mesaj.tip === "basari" ? "#15803d" : "#b91c1c",
            fontSize: "13px",
          }}
        >
          {mesaj.text}
        </div>
      )}

      {/* Kayıt Formu */}
      <form
        onSubmit={handleKayitOl}
        style={{
          backgroundColor: "#f5f3ff",
          padding: "20px",
          borderRadius: "18px",
          border: "2px solid #ddd6fe",
          marginBottom: "28px",
        }}
      >
        <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#4c1d95", margin: "0 0 14px 0" }}>
          🎨 Karakterini Seç ve Bilgilerini Doldur
        </h2>

        {/* Karakter Seçimi */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#5b21b6", marginBottom: "6px" }}>
            Maskot Karakterini Seç
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "8px" }}>
            {KARAKTERLER.map((k) => {
              const secili = secilenKarakter.includes(k.ad);
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setSecilenKarakter(`${k.simge} ${k.ad}`)}
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    border: secili ? "2px solid #7c3aed" : "1px solid #cbd5e1",
                    backgroundColor: secili ? "#ede9fe" : "#ffffff",
                    cursor: "pointer",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#334155",
                  }}
                >
                  <div style={{ fontSize: "24px" }}>{k.simge}</div>
                  <div style={{ fontSize: "11px", marginTop: "4px" }}>{k.ad}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#5b21b6", marginBottom: "4px" }}>
              Öğrenci Adı Soyadı *
            </label>
            <input
              type="text"
              required
              value={adSoyad}
              onChange={(e) => setAdSoyad(e.target.value)}
              placeholder="Örn: Zeynep Demir"
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#5b21b6", marginBottom: "4px" }}>
              Veli Adı Soyadı *
            </label>
            <input
              type="text"
              required
              value={veliAdi}
              onChange={(e) => setVeliAdi(e.target.value)}
              placeholder="Örn: Ahmet Demir (Veli)"
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#5b21b6", marginBottom: "4px" }}>
              Gizli PIN Kodu (Örn: 4 haneli şifre) *
            </label>
            <input
              type="password"
              maxLength={6}
              required
              value={pinKodu}
              onChange={(e) => setPinKodu(e.target.value)}
              placeholder="****"
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#5b21b6", marginBottom: "4px" }}>
              Satranç Seviyeniz
            </label>
            <select
              value={seviye}
              onChange={(e) => setSeviye(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#ffffff", boxSizing: "border-box" }}
            >
              <option value="Başlangıç">Başlangıç Seviyesi</option>
              <option value="Orta Seviye">Orta Seviye</option>
              <option value="İleri Seviye">İleri Seviye / Turnuva Oyuncusu</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#5b21b6", marginBottom: "4px" }}>
              🌐 Lichess Kullanıcı Adı
            </label>
            <input
              type="text"
              value={lichessKadi}
              onChange={(e) => setLichessKadi(e.target.value)}
              placeholder="Lichess kullanıcı adın"
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#5b21b6", marginBottom: "4px" }}>
              🌍 Chess.com Kullanıcı Adı
            </label>
            <input
              type="text"
              value={chessComKadi}
              onChange={(e) => setChessComKadi(e.target.value)}
              placeholder="Chess.com kullanıcı adın"
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#8b5cf6",
            color: "#ffffff",
            borderRadius: "12px",
            border: "none",
            fontWeight: "900",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
          }}
        >
          🚀 Kulübe Kaydol ve Hesapları Bağla
        </button>
      </form>

      {/* ÖĞRETMEN OTOMATİK GÖRÜNÜM PANELİ */}
      <div style={{ backgroundColor: "#faf5ff", padding: "20px", borderRadius: "18px", border: "2px solid #e9d5ff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#5b21b6", margin: 0 }}>
            👨‍🏫 Öğretmen Otomatik Gözükme Paneli ({kayitliOgrenciler.length} Kayıtlı Öğrenci)
          </h2>
          {kayitliOgrenciler.length > 0 && (
            <button
              type="button"
              onClick={handleTemizle}
              style={{ padding: "6px 12px", backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
            >
              Listeyi Temizle
            </button>
          )}
        </div>

        {kayitliOgrenciler.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", margin: "20px 0" }}>
            Henüz sisteme kayıtlı öğrenci bulunmuyor.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {kayitliOgrenciler.map((ogrenci, index) => (
              <div
                key={ogrenci.id || index}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #ddd6fe",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b" }}>
                    {index + 1}. {ogrenci.karakter} — {ogrenci.adSoyad} <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: "bold" }}>({ogrenci.seviye})</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Veli: {ogrenci.veliAdi} | PIN: •••• | Tarih: {ogrenci.tarih}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", padding: "4px 8px", backgroundColor: "#f1f5f9", borderRadius: "8px", fontWeight: "bold", color: "#334155" }}>
                    Lichess: {ogrenci.lichessKadi !== "-" ? (
                      <a href={`https://lichess.org/@/${ogrenci.lichessKadi}`} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                        {ogrenci.lichessKadi} ↗
                      </a>
                    ) : <span style={{ color: "#94a3b8" }}>Bağlanmadı</span>}
                  </span>
                  <span style={{ fontSize: "11px", padding: "4px 8px", backgroundColor: "#f7fee7", borderRadius: "8px", fontWeight: "bold", color: "#3f6212" }}>
                    Chess.com: {ogrenci.chessComKadi !== "-" ? (
                      <a href={`https://www.chess.com/member/${ogrenci.chessComKadi}`} target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", textDecoration: "underline" }}>
                        {ogrenci.chessComKadi} ↗
                      </a>
                    ) : <span style={{ color: "#94a3b8" }}>Bağlanmadı</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
