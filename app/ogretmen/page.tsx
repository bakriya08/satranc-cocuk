"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SoruItem {
  id: number;
  title: string;
  fen: string;
  hint: string;
}

interface SoruAnalizItem {
  soruId: number;
  soruBaslik: string;
  hataliDeneme: number;
}

interface OdevKaydi {
  id: string;
  ogrenciAdi: string;
  toplamSoru: number;
  dogruSayisi: number;
  toplamHata: number;
  gecenSureSaniye: number;
  tamamlanmaTarihi: string;
  soruDetaylari: SoruAnalizItem[];
}

export default function OgretmenPage() {
  const [sifre, setSifre] = useState("");
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [aktifTab, setAktifTab] = useState<"ogrenciler" | "sorular" | "analiz">("ogrenciler");

  const [kayitlar, setKayitlar] = useState<OdevKaydi[]>([]);
  const [sorular, setSorular] = useState<SoruItem[]>([]);
  const [arsivSayisi, setArsivSayisi] = useState(0);
  const [seciliKarne, setSeciliKarne] = useState<OdevKaydi | null>(null);

  // Yeni Soru Formu
  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniFen, setYeniFen] = useState("");
  const [yeniIpucu, setYeniIpucu] = useState("");

  const DOGRU_SIFRE = "satranc123";

  async function verileriGetir() {
    try {
      const res = await fetch("/api/odev");
      const json = await res.json();
      if (json.success) {
        setKayitlar(json.data.aktifOdevler || []);
        setSorular(json.data.sorular || []);
        setArsivSayisi(json.data.arsivSayisi || 0);
      }
    } catch {}
  }

  useEffect(() => {
    if (girisYapildi) {
      verileriGetir();
    }
  }, [girisYapildi]);

  // Yeni Soru Ekleme
  async function handleSoruEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!yeniFen.trim() || !yeniBaslik.trim()) {
      alert("Lütfen başlık ve FEN kodunu girin!");
      return;
    }

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
      setSorular(data.data);
      setYeniBaslik("");
      setYeniFen("");
      setYeniIpucu("");
      alert("✅ Yeni soru ödev listesine eklendi!");
    }
  }

  // Soru Silme
  async function handleSoruSil(id: number) {
    if (confirm("Bu soruyu ödev listesinden silmek istediğinize emin misiniz?")) {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "soruSil", id }),
      });
      const data = await res.json();
      if (data.success) setSorular(data.data);
    }
  }

  // Haftayı Arşivleme & Sıfırlama
  async function handleHaftayiArsivle() {
    if (confirm("Mevcut teslimler arşive aktarılacak ve yeni hafta başlayacak. Emin misiniz?")) {
      await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "haftayiArsivle" }),
      });
      verileriGetir();
      alert("📁 Hafta arşivlendi! Yeni ödev dönemi başladı.");
    }
  }

  // CSV İndirme
  function csvIndir() {
    if (kayitlar.length === 0) return;
    let csv = "Öğrenci,Doğru,Toplam Soru,Hata Sayısı,Süre (sn),Teslim Tarihi\n";
    kayitlar.forEach((k) => {
      csv += `"${k.ogrenciAdi}",${k.dogruSayisi},${k.toplamSoru},${k.toplamHata},${k.gecenSureSaniye},"${k.tamamlanmaTarihi}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `satranc_odev_raporu_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  // Soru Bazlı Hata Hesaplama
  const soruHataSayilari: Record<number, { baslik: string; toplamHata: number }> = {};
  sorular.forEach((s) => {
    soruHataSayilari[s.id] = { baslik: s.title, toplamHata: 0 };
  });
  kayitlar.forEach((k) => {
    k.soruDetaylari?.forEach((sd) => {
      if (soruHataSayilari[sd.soruId]) {
        soruHataSayilari[sd.soruId].toplamHata += sd.hataliDeneme;
      }
    });
  });

  // 1. ŞİFRE GİRİŞ EKRANI
  if (!girisYapildi) {
    return (
      <div
        style={{
          maxWidth: "360px",
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "20px",
          border: "3px solid #cbd5e1",
          textAlign: "center",
          margin: "40px auto",
          boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ fontSize: "44px" }}>🔒</span>
        <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#1e293b", margin: "8px 0" }}>Öğretmen Girişi</h2>
        <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "16px" }}>Ödev yönetim paneline erişmek için şifrenizi girin.</p>
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (sifre === DOGRU_SIFRE) setGirisYapildi(true);
              else alert("Hatalı şifre!");
            }
          }}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "12px",
            border: "2px solid #cbd5e1",
            textAlign: "center",
            fontSize: "14px",
            outline: "none",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (sifre === DOGRU_SIFRE) setGirisYapildi(true);
            else alert("Hatalı şifre! (Varsayılan: satranc123)");
          }}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: "900",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Giriş Yap ➔
        </button>
      </div>
    );
  }

  // 2. YÖNETİCİ PANELİ
  return (
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        padding: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        border: "2px solid #e2e8f0",
        margin: "10px auto",
      }}
    >
      {/* ÜST BAŞLIK & İŞLEM BUTONLARI */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
            ♟️ Antrenör & Ödev Kontrol Merkezi
          </h1>
          <span style={{ fontSize: "11px", color: "#64748b" }}>
            Haftalık ödev yönetimi, canlı öğrenci karneleri ve taktik hata analizleri
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={csvIndir}
            disabled={kayitlar.length === 0}
            style={{ padding: "6px 12px", backgroundColor: "#10b981", color: "#ffffff", borderRadius: "10px", border: "none", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
          >
            📥 Excel/CSV İndir
          </button>
          <button
            type="button"
            onClick={handleHaftayiArsivle}
            style={{ padding: "6px 12px", backgroundColor: "#3b82f6", color: "#ffffff", borderRadius: "10px", border: "none", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
          >
            📁 Yeni Haftayı Başlat ({arsivSayisi} Arşiv)
          </button>
        </div>
      </div>

      {/* SEKMELER */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => setAktifTab("ogrenciler")}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: aktifTab === "ogrenciler" ? "#2563eb" : "#f1f5f9",
            color: aktifTab === "ogrenciler" ? "#ffffff" : "#475569",
            fontWeight: "800",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          👥 Öğrenci Teslimleri ({kayitlar.length})
        </button>

        <button
          type="button"
          onClick={() => setAktifTab("sorular")}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: aktifTab === "sorular" ? "#2563eb" : "#f1f5f9",
            color: aktifTab === "sorular" ? "#ffffff" : "#475569",
            fontWeight: "800",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          ⚙️ Ödev Sorularını Yönet ({sorular.length} Soru)
        </button>

        <button
          type="button"
          onClick={() => setAktifTab("analiz")}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: aktifTab === "analiz" ? "#2563eb" : "#f1f5f9",
            color: aktifTab === "analiz" ? "#ffffff" : "#475569",
            fontWeight: "800",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          📊 Soru Zorluk & Hata Analizi
        </button>
      </div>

      {/* 1. SEKME: ÖĞRENCİ TESLİMLERİ LİSTESİ */}
      {aktifTab === "ogrenciler" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "10px", color: "#334155" }}>Öğrenci Adı</th>
                <th style={{ padding: "10px", color: "#334155" }}>Başarı</th>
                <th style={{ padding: "10px", color: "#334155" }}>Hatalı Hamle</th>
                <th style={{ padding: "10px", color: "#334155" }}>Süre</th>
                <th style={{ padding: "10px", color: "#334155" }}>Tarih</th>
                <th style={{ padding: "10px", color: "#334155" }}>Karne</th>
              </tr>
            </thead>
            <tbody>
              {kayitlar.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                    Bu hafta henüz ödev teslim eden öğrenci bulunmuyor.
                  </td>
                </tr>
              ) : (
                kayitlar.map((k) => (
                  <tr key={k.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px", fontWeight: "800", color: "#0f172a" }}>👤 {k.ogrenciAdi}</td>
                    <td style={{ padding: "10px", fontWeight: "800", color: "#16a34a" }}>
                      ⭐ {k.dogruSayisi} / {k.toplamSoru}
                    </td>
                    <td style={{ padding: "10px", color: k.toplamHata > 0 ? "#dc2626" : "#64748b", fontWeight: "700" }}>
                      {k.toplamHata} Hata
                    </td>
                    <td style={{ padding: "10px", color: "#64748b" }}>{k.gecenSureSaniye} sn</td>
                    <td style={{ padding: "10px", color: "#64748b" }}>{k.tamamlanmaTarihi}</td>
                    <td style={{ padding: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setSeciliKarne(k)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#fef3c7",
                          color: "#b45309",
                          border: "1px solid #fde68a",
                          borderRadius: "8px",
                          fontSize: "10.5px",
                          fontWeight: "800",
                          cursor: "pointer",
                        }}
                      >
                        🔍 İncele
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. SEKME: KODSUZ SORU YÖNETİCİSİ */}
      {aktifTab === "sorular" && (
        <div>
          {/* Yeni Soru Ekleme Formu */}
          <form
            onSubmit={handleSoruEkle}
            style={{
              backgroundColor: "#f8fafc",
              padding: "16px",
              borderRadius: "16px",
              border: "2px dashed #93c5fd",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#1e3a8a" }}>
              ➕ Lichess / Chess.com'dan Yeni Soru Ekle:
            </span>

            <input
              type="text"
              placeholder="Soru Başlığı (Örn: 3. Görev: Çifte Şah Tuzağı 🎯)"
              value={yeniBaslik}
              onChange={(e) => setYeniBaslik(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "12px" }}
              required
            />

            <input
              type="text"
              placeholder="FEN Kodu (Örn: 6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1)"
              value={yeniFen}
              onChange={(e) => setYeniFen(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "12px", fontFamily: "monospace" }}
              required
            />

            <input
              type="text"
              placeholder="Çocuklar İçin İpucu (Örn: İpucu: Kaleyi son yataya indir!)"
              value={yeniIpucu}
              onChange={(e) => setYeniIpucu(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "12px" }}
            />

            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontWeight: "900",
                borderRadius: "10px",
                border: "none",
                fontSize: "12px",
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              ✅ Bu Soruyu Ödeve Ekle
            </button>
          </form>

          {/* Mevcut Sorular Listesi */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#334155" }}>Bu Haftanın Aktif Soruları:</span>
            {sorular.map((s, idx) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <div style={{ fontWeight: "800", fontSize: "12px", color: "#0f172a" }}>
                    {idx + 1}. {s.title}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>{s.fen}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSoruSil(s.id)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: "800",
                  }}
                >
                  Sil 🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SEKME: SORU BAZLI ZORLUK ANALİZİ */}
      {aktifTab === "analiz" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            Öğrencilerin en çok hangi soruda hatalı hamle yaptığını gösterir. Yüksek hata oranı olan konuları derste tekrar edebilirsiniz!
          </p>

          {Object.entries(soruHataSayilari).map(([sId, val]) => (
            <div
              key={sId}
              style={{
                backgroundColor: "#f8fafc",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: "800", fontSize: "12px", color: "#1e293b" }}>{val.baslik}</div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Tüm sınıf toplam hata sayısı</span>
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: "10px",
                  backgroundColor: val.toplamHata > 5 ? "#fee2e2" : "#f0fdf4",
                  color: val.toplamHata > 5 ? "#dc2626" : "#166534",
                  fontWeight: "900",
                  fontSize: "13px",
                }}
              >
                {val.toplamHata} Hata {val.toplamHata > 5 ? "⚠️ Zorlanıldı" : "✅ Rahat Çözüldü"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ÖĞRENCİ KARNESİ MODAL AÇILIR PENCERESİ */}
      {seciliKarne && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "20px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 20px 25px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>
                📜 Öğrenci Ödev Karnesi
              </h3>
              <button
                type="button"
                onClick={() => setSeciliKarne(null)}
                style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}
              >
                ✖
              </button>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "12px", marginBottom: "12px" }}>
              <div style={{ fontWeight: "900", fontSize: "14px", color: "#1e3a8a" }}>{seciliKarne.ogrenciAdi}</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                Teslim: {seciliKarne.tamamlanmaTarihi} • Toplam Süre: {seciliKarne.gecenSureSaniye} sn
              </div>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#16a34a", marginTop: "4px" }}>
                Başarı: {seciliKarne.dogruSayisi} / {seciliKarne.toplamSoru} Soru (%100)
              </div>
            </div>

            <div style={{ fontSize: "11px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>
              Soru Başına Denemeler:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
              {seciliKarne.soruDetaylari?.map((sd, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                >
                  <span style={{ fontWeight: "700", color: "#1e293b" }}>{sd.soruBaslik}</span>
                  <span style={{ fontWeight: "900", color: sd.hataliDeneme === 0 ? "#16a34a" : "#dc2626" }}>
                    {sd.hataliDeneme === 0 ? "İlk Seferde Doğru ⭐" : `${sd.hataliDeneme} Hatalı Deneme`}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSeciliKarne(null)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontWeight: "900",
                borderRadius: "12px",
                border: "none",
                fontSize: "12px",
                cursor: "pointer",
                marginTop: "14px",
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* ALT LİNKLER */}
      <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontSize: "11px", color: "#2563eb", fontWeight: "800", textDecoration: "none" }}>
          ⬅️ Ana Sayfaya Dön
        </Link>
        <button
          type="button"
          onClick={() => setGirisYapildi(false)}
          style={{ background: "none", border: "none", color: "#dc2626", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
        >
          Çıkış Yap ✖
        </button>
      </div>
    </div>
  );
}
