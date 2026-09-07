"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OgrenciKayit {
  id: string;
  adSoyad: string;
  lichessKadi: string;
  chessComKadi: string;
  seviye: string;
  tarih: string;
}

export default function KayitPage() {
  const [aktifSekme, setAktifSekme] = useState<"kayit" | "hesapBagla">("kayit");
  
  // Yeni Kayıt Formu State'leri
  const [adSoyad, setAdSoyad] = useState("");
  const [seviye, setSeviye] = useState("Başlangıç");
  
  // Hesap Bağlama Formu State'leri
  const [secilenOgrenciId, setSecilenOgrenciId] = useState("");
  const [lichessKadi, setLichessKadi] = useState("");
  const [chessComKadi, setChessComKadi] = useState("");
  
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

  // 1. Adım: Temel Kayıt Olma
  function handleTemelKayit(e: React.FormEvent) {
    e.preventDefault();
    if (!adSoyad.trim()) return;

    const yeniKayit: OgrenciKayit = {
      id: Date.now().toString(),
      adSoyad: adSoyad.trim(),
      lichessKadi: "-",
      chessComKadi: "-",
      seviye,
      tarih: new Date().toLocaleDateString("tr-TR"),
    };

    const guncelListe = [yeniKayit, ...kayitliOgrenciler];
    guncelleVeKaydet(guncelListe);

    setMesaj({ text: "🎉 Başarıyla kayıt oldunuz! Şimdi 'Lichess / Chess.com Hesabı Bağla' sekmesinden hesaplarınızı ekleyebilirsiniz.", tip: "basari" });
    setAdSoyad("");
    setTimeout(() => setMesaj(null), 5000);
  }

  // 2. Adım: Kayda Lichess / Chess.com Ekleme / Güncelleme
  function handleHesapBagla(e: React.FormEvent) {
    e.preventDefault();
    if (!secilenOgrenciId) {
      setMesaj({ text: "⚠️ Lütfen listeden öğrenci adınızı seçin!", tip: "hata" });
      return;
    }

    const guncelListe = kayitliOgrenciler.map((ogrenci) => {
      if (ogrenci.id === secilenOgrenciId) {
        return {
          ...ogrenci,
          lichessKadi: lichessKadi.trim() || ogrenci.lichessKadi,
          chessComKadi: chessComKadi.trim() || ogrenci.chessComKadi,
        };
      }
      return ogrenci;
    });

    guncelleVeKaydet(guncelListe);
    setMesaj({ text: "✨ Lichess ve Chess.com hesaplarınız başarıyla bağlandı! Öğretmen panelinde güncellendi.", tip: "basari" });
    setLichessKadi("");
    setChessComKadi("");
    setSecilenOgrenciId("");
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
        <span style={{ fontSize: "40px" }}>🌟👥</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#5b21b6", margin: "6px 0" }}>
          Sevimli Satranç Kulübü & Hesap Bağlama Sistemi
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Önce kulübe kayıt olun, ardından Lichess ve Chess.com hesaplarınızı kolayca bağlayın!
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

      {/* Sekme Değiştirme Butonları */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => setAktifSekme("kayit")}
          style={{
            padding: "10px 18px",
            backgroundColor: aktifSekme === "kayit" ? "#8b5cf6" : "#f1f5f9",
            color: aktifSekme === "kayit" ? "#ffffff" : "#334155",
            borderRadius: "12px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          1️⃣ Kulübe Yeni Kayıt Ol
        </button>

        <button
          type="button"
          onClick={() => setAktifSekme("hesapBagla")}
          style={{
            padding: "10px 18px",
            backgroundColor: aktifSekme === "hesapBagla" ? "#2563eb" : "#f1f5f9",
            color: aktifSekme === "hesapBagla" ? "#ffffff" : "#334155",
            borderRadius: "12px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          2️⃣ Lichess / Chess.com Hesabı Ekle & Bağla
        </button>
      </div>

      {/* SEKME 1: YENİ KAYIT OLMA */}
      {aktifSekme === "kayit" && (
        <form
          onSubmit={handleTemelKayit}
          style={{
            backgroundColor: "#f5f3ff",
            padding: "20px",
            borderRadius: "18px",
            border: "2px solid #ddd6fe",
            marginBottom: "28px",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#4c1d95", margin: "0 0 14px 0" }}>
            📝 Adım 1: Temel Kulüp Kaydı
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#5b21b6", marginBottom: "4px" }}>
                Ad Soyad *
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
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            🚀 Kaydı Tamamla (Sonra Hesap Bağla)
          </button>
        </form>
      )}

      {/* SEKME 2: LICHESS VE CHESS.COM HESABI BAĞLAMA */}
      {aktifSekme === "hesapBagla" && (
        <form
          onSubmit={handleHesapBagla}
          style={{
            backgroundColor: "#eff6ff",
            padding: "20px",
            borderRadius: "18px",
            border: "2px solid #bfdbfe",
            marginBottom: "28px",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#1e3a8a", margin: "0 0 14px 0" }}>
            🔗 Adım 2: Lichess ve Chess.com Hesaplarını Bağla
          </h2>

          {kayitliOgrenciler.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#b91c1c", fontWeight: "bold" }}>
              ⚠️ Önce "Kulübe Yeni Kayıt Ol" sekmesinden adınızı kaydetmelisiniz!
            </p>
          ) : (
            <>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#1e40af", marginBottom: "4px" }}>
                  Kayıtlı İsminizi Seçin *
                </label>
                <select
                  required
                  value={secilenOgrenciId}
                  onChange={(e) => setSecilenOgrenciId(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#ffffff" }}
                >
                  <option value="">-- Listeden İsminizi Seçin --</option>
                  {kayitliOgrenciler.map((ogrenci) => (
                    <option key={ogrenci.id} value={ogrenci.id}>
                      {ogrenci.adSoyad} ({ogrenci.seviye})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#1e40af", marginBottom: "4px" }}>
                    🌐 Lichess Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    value={lichessKadi}
                    onChange={(e) => setLichessKadi(e.target.value)}
                    placeholder="Örn: lichess_kullanici"
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#1e40af", marginBottom: "4px" }}>
                    🌍 Chess.com Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    value={chessComKadi}
                    onChange={(e) => setChessComKadi(e.target.value)}
                    placeholder="Örn: chesscom_kullanici"
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: "900",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                🔗 Hesapları Güncelle ve Öğretmene Gönder
              </button>
            </>
          )}
        </form>
      )}

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
                    {index + 1}. {ogrenci.adSoyad} <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: "bold" }}>({ogrenci.seviye})</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Kayıt: {ogrenci.tarih}
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
