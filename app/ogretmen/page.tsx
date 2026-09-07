"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SoruAnalizItem {
  soruId: number;
  soruBaslik: string;
  hataliDeneme: number;
}

interface OdevKaydi {
  id: string;
  ogrenciAdi: string;
  sinifGrup?: string;
  avatar?: string;
  toplamSoru: number;
  dogruSayisi: number;
  toplamHata: number;
  gecenSureSaniye: number;
  tamamlanmaTarihi: string;
  soruDetaylari?: SoruAnalizItem[];
}

interface SoruItem {
  id: number;
  title: string;
  fen: string;
  hint: string;
}

export default function OgretmenPage() {
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [sifre, setSifre] = useState("");
  const [sifreHata, setSifreHata] = useState(false);

  const [aktifSekme, setAktifSekme] = useState<"sonuclar" | "sorular">("sonuclar");
  const [yukleniyor, setYukleniyor] = useState(false);

  const [odevler, setOdevler] = useState<OdevKaydi[]>([]);
  const [sorular, setSorular] = useState<SoruItem[]>([]);
  const [arsivSayisi, setArsivSayisi] = useState(0);

  // Soru Ekleme Form Durumu
  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniFen, setYeniFen] = useState("");
  const [yeniIpucu, setYeniIpucu] = useState("");
  const [islemMesaji, setIslemMesaji] = useState("");

  // Öğrenci Detay Modalı
  const [seciliOgrenci, setSeciliOgrenci] = useState<OdevKaydi | null>(null);

  function verileriGetir() {
    setYukleniyor(true);
    fetch("/api/odev", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.success && res.data) {
          setOdevler(Array.isArray(res.data.aktifOdevler) ? res.data.aktifOdevler : []);
          setSorular(Array.isArray(res.data.sorular) ? res.data.sorular : []);
          setArsivSayisi(Number(res.data.arsivSayisi) || 0);
        }
        setYukleniyor(false);
      })
      .catch(() => {
        setYukleniyor(false);
      });
  }

  useEffect(() => {
    if (girisYapildi) {
      verileriGetir();
    }
  }, [girisYapildi]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (sifre === "satranc123") {
      setGirisYapildi(true);
      setSifreHata(false);
    } else {
      setSifreHata(true);
    }
  }

  async function handleSoruEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!yeniBaslik.trim() || !yeniFen.trim()) {
      alert("Lütfen başlık ve FEN kodunu doldurun!");
      return;
    }

    try {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "soruEkle",
          title: yeniBaslik,
          fen: yeniFen,
          hint: yeniIpucu,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIslemMesaji("✅ Soru başarıyla eklendi!");
        setYeniBaslik("");
        setYeniFen("");
        setYeniIpucu("");
        verileriGetir();
        setTimeout(() => setIslemMesaji(""), 3000);
      }
    } catch {
      alert("Soru eklenirken hata oluştu.");
    }
  }

  async function handleSoruSil(id: number) {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "soruSil", id }),
      });
      const data = await res.json();
      if (data.success) {
        verileriGetir();
      }
    } catch {
      alert("Soru silinirken hata oluştu.");
    }
  }

  async function handleHaftayiArsivle() {
    if (!confirm("Bu haftaki tüm öğrenci ödevlerini arşivleyip yeni haftaya başlamak istiyor musunuz?")) return;
    try {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "haftayiArsivle" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Hafta başarıyla arşivlendi!");
        verileriGetir();
      }
    } catch {
      alert("Arşivleme hatası.");
    }
  }

  if (!girisYapildi) {
    return (
      <div
        style={{
          maxWidth: "380px",
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "20px",
          border: "4px solid #f59e0b",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
          margin: "40px auto",
        }}
      >
        <span style={{ fontSize: "48px" }}>🔐</span>
        <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#1e293b", margin: "10px 0" }}>
          Öğretmen Yönetim Paneli
        </h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>
          Lütfen devam etmek için öğretmen şifresini girin.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Öğretmen Şifresi (satranc123)"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              fontSize: "14px",
              textAlign: "center",
              marginBottom: "10px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          {sifreHata && (
            <div style={{ color: "#dc2626", fontSize: "11px", fontWeight: "bold", marginBottom: "8px" }}>
              ❌ Hatalı şifre! Tekrar deneyin.
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: "900",
              fontSize: "13px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Giriş Yap 🚀
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "24px",
        border: "3px solid #fde68a",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#1e293b", margin: 0 }}>
            ♟️ Öğretmen Kontrol Masası
          </h1>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Öğrenci ödev analizleri ve soru yönetim sistemi
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={verileriGetir}
            style={{
              padding: "6px 12px",
              backgroundColor: "#f1f5f9",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔄 Yenile
          </button>
          <button
            type="button"
            onClick={() => setGirisYapildi(false)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              border: "none",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* SEKME GEÇİŞLERİ */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>
        <button
          type="button"
          onClick={() => setAktifSekme("sonuclar")}
          style={{
            padding: "8px 16px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: aktifSekme === "sonuclar" ? "#2563eb" : "#f1f5f9",
            color: aktifSekme === "sonuclar" ? "#ffffff" : "#64748b",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          📊 Ödev Teslimleri ({odevler.length})
        </button>

        <button
          type="button"
          onClick={() => setAktifSekme("sorular")}
          style={{
            padding: "8px 16px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: aktifSekme === "sorular" ? "#2563eb" : "#f1f5f9",
            color: aktifSekme === "sorular" ? "#ffffff" : "#64748b",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          ⚙️ Ödev Sorularını Yönet ({sorular.length})
        </button>
      </div>

      {yukleniyor && (
        <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontSize: "13px" }}>
          Veriler güncelleniyor... ⏳
        </div>
      )}

      {/* SEKME 1: ÖDEV SONUÇLARI */}
      {aktifSekme === "sonuclar" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>
              Aktif Hafta Teslimleri
            </span>
            <button
              type="button"
              onClick={handleHaftayiArsivle}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f59e0b",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              📦 Haftayı Arşivle ({arsivSayisi} Arşiv)
            </button>
          </div>

          {odevler.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                backgroundColor: "#f8fafc",
                borderRadius: "16px",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Henüz bu hafta ödev teslim eden öğrenci bulunmuyor.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {odevler.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "28px" }}>{item.avatar || "🦁"}</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b" }}>
                        {item.ogrenciAdi}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        {item.sinifGrup || "Genel"} • {item.tamamlanmaTarihi}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Süre</div>
                      <div style={{ fontSize: "13px", fontWeight: "900", color: "#0284c7" }}>
                        {item.gecenSureSaniye} sn
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Hata</div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "900",
                          color: item.toplamHata > 0 ? "#dc2626" : "#16a34a",
                        }}
                      >
                        {item.toplamHata}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSeciliOgrenci(item)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#eff6ff",
                        color: "#2563eb",
                        border: "1px solid #bfdbfe",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      🔍 İncele
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SEKME 2: SORU YÖNETİMİ */}
      {aktifSekme === "sorular" && (
        <div>
          <form
            onSubmit={handleSoruEkle}
            style={{
              backgroundColor: "#f8fafc",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", margin: "0 0 10px 0" }}>
              ➕ Yeni Soru Ekle
            </h3>

            <input
              type="text"
              placeholder="Soru Başlığı (Örn: 1. Görev: Çoban Matı Taktik Darbesi 🎯)"
              value={yeniBaslik}
              onChange={(e) => setYeniBaslik(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                marginBottom: "8px",
                boxSizing: "border-box",
              }}
            />

            <input
              type="text"
              placeholder="FEN Kodu (Örn: r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4)"
              value={yeniFen}
              onChange={(e) => setYeniFen(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                marginBottom: "8px",
                boxSizing: "border-box",
              }}
            />

            <input
              type="text"
              placeholder="Çocuklar İçin İpucu (Örn: İpucu: Vezir zayıf f7 karesine saldırabilir!)"
              value={yeniIpucu}
              onChange={(e) => setYeniIpucu(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            />

            {islemMesaji && (
              <div style={{ color: "#16a34a", fontSize: "12px", fontWeight: "bold", marginBottom: "8px" }}>
                {islemMesaji}
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "900",
                cursor: "pointer",
              }}
            >
              Soruyu Kaydet 💾
            </button>
          </form>

          <h3 style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "10px" }}>
            Mevcut Ödev Soruları
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sorular.map((s, idx) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "900", color: "#1e293b" }}>
                    #{idx + 1} {s.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic" }}>
                    {s.hint}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSoruSil(s.id)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ÖĞRENCİ DETAYLI SORU KARNESİ */}
      {seciliOgrenci && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "20px",
              maxWidth: "450px",
              width: "100%",
              boxShadow: "0 20px 25px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "24px" }}>{seciliOgrenci.avatar || "🦁"}</span>
                <span style={{ fontSize: "15px", fontWeight: "900", color: "#1e293b" }}>
                  {seciliOgrenci.ogrenciAdi} - Soru Analizi
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSeciliOgrenci(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {seciliOgrenci.soruDetaylari && seciliOgrenci.soruDetaylari.length > 0 ? (
                seciliOgrenci.soruDetaylari.map((detay, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  >
                    <span style={{ fontWeight: "700", color: "#334155" }}>
                      {detay.soruBaslik || `Soru #${i + 1}`}
                    </span>
                    <span
                      style={{
                        fontWeight: "900",
                        color: detay.hataliDeneme === 0 ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {detay.hataliDeneme === 0 ? "İlk Seferde Doğru ✨" : `${detay.hataliDeneme} Hatalı Hamle`}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "12px", color: "#64748b", textAlign: "center" }}>
                  Detaylı soru verisi bulunamadı.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSeciliOgrenci(null)}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "900",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
