"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OdevKaydi {
  id: string;
  ogrenciAdi: string;
  toplamSoru: number;
  dogruSayisi: number;
  hataliHamleler: number;
  tamamlanmaTarihi: string;
  durum: "Tamamlandı" | "Kısmi";
}

export default function OgretmenPage() {
  const [sifre, setSifre] = useState("");
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [kayitlar, setKayitlar] = useState<OdevKaydi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  // Öğretmen Giriş Şifresi
  const DOGRU_SIFRE = "satranc123";

  async function verileriGetir() {
    setYukleniyor(true);
    try {
      const res = await fetch("/api/odev");
      const json = await res.json();
      if (json.success) {
        setKayitlar(json.data);
      }
    } catch {}
    setYukleniyor(false);
  }

  useEffect(() => {
    if (girisYapildi) {
      verileriGetir();
    }
  }, [girisYapildi]);

  async function listeyiTemizle() {
    if (confirm("Tüm ödev geçmişini temizlemek istediğinize emin misiniz?")) {
      await fetch("/api/odev", { method: "DELETE" });
      setKayitlar([]);
    }
  }

  function csvIndir() {
    if (kayitlar.length === 0) return;
    let csv = "Öğrenci Adı,Toplam Soru,Doğru Sayısı,Hatalı Hamle,Tarih,Durum\n";
    kayitlar.forEach((k) => {
      csv += `"${k.ogrenciAdi}",${k.toplamSoru},${k.dogruSayisi},${k.hataliHamleler},"${k.tamamlanmaTarihi}","${k.durum}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `odev_raporu_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  // 1. AŞAMA: ŞİFRE EKRANI
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
        <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#1e293b", margin: "8px 0" }}>
          Öğretmen Girişi
        </h2>
        <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "16px" }}>
          Ödev takip paneline erişmek için şifrenizi girin.
        </p>

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

  // 2. AŞAMA: ÖĞRETMEN TAKİP LİSTESİ
  return (
    <div
      style={{
        maxWidth: "750px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        border: "2px solid #e2e8f0",
        margin: "10px auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
            📋 Satranç Ödev Kontrol Paneli
          </h1>
          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
            Tamamlanan öğrenci ödevleri anlık olarak burada listelenir.
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={verileriGetir}
            style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
          >
            🔄 Yenile
          </button>
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
            onClick={listeyiTemizle}
            style={{ padding: "6px 12px", backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "10px", border: "none", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
          >
            🗑️ Temizle
          </button>
        </div>
      </div>

      {/* Özet Kartları */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
        <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "900", color: "#2563eb" }}>{kayitlar.length}</div>
          <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>Toplam Teslim</div>
        </div>
        <div style={{ backgroundColor: "#f0fdf4", padding: "12px", borderRadius: "14px", border: "1px solid #bbf7d0", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "900", color: "#16a34a" }}>
            {kayitlar.filter((k) => k.dogruSayisi === k.toplamSoru).length}
          </div>
          <div style={{ fontSize: "11px", color: "#15803d", fontWeight: "700" }}>%100 Başarı</div>
        </div>
        <div style={{ backgroundColor: "#fffbeb", padding: "12px", borderRadius: "14px", border: "1px solid #fde68a", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "900", color: "#d97706" }}>
            {kayitlar.reduce((acc, k) => acc + k.hataliHamleler, 0)}
          </div>
          <div style={{ fontSize: "11px", color: "#b45309", fontWeight: "700" }}>Toplam Yanlış Deneme</div>
        </div>
      </div>

      {/* TABLO */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
              <th style={{ padding: "10px", fontWeight: "800", color: "#334155" }}>Öğrenci Adı</th>
              <th style={{ padding: "10px", fontWeight: "800", color: "#334155" }}>Başarı</th>
              <th style={{ padding: "10px", fontWeight: "800", color: "#334155" }}>Hatalı Hamle</th>
              <th style={{ padding: "10px", fontWeight: "800", color: "#334155" }}>Teslim Tarihi</th>
              <th style={{ padding: "10px", fontWeight: "800", color: "#334155" }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {kayitlar.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                  {yukleniyor ? "Yükleniyor..." : "Henüz ödev teslim eden öğrenci bulunmuyor."}
                </td>
              </tr>
            ) : (
              kayitlar.map((k) => (
                <tr key={k.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px", fontWeight: "800", color: "#0f172a" }}>👤 {k.ogrenciAdi}</td>
                  <td style={{ padding: "10px", fontWeight: "800", color: "#16a34a" }}>
                    ⭐ {k.dogruSayisi} / {k.toplamSoru}
                  </td>
                  <td style={{ padding: "10px", color: k.hataliHamleler > 0 ? "#dc2626" : "#64748b", fontWeight: "700" }}>
                    {k.hataliHamleler} Yanlış
                  </td>
                  <td style={{ padding: "10px", color: "#64748b" }}>{k.tamamlanmaTarihi}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ backgroundColor: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: "8px", fontWeight: "800", fontSize: "10px" }}>
                      ✅ {k.durum}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
