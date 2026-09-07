"use client";

import { useState, useEffect } from "react";

interface OgretmenProfil {
  id: string;
  adSoyad: string;
  unvan: string;
  sifre: string;
  rol: "yonetici" | "ogretmen";
}

interface OgrenciProfil {
  id: string;
  adSoyad: string;
  sinifGrup: string;
  avatar: string;
  pin: string;
  kayitTarihi: string;
}

interface SoruItem {
  id: number;
  title: string;
  fen: string;
  hint: string;
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
}

export default function OgretmenPage() {
  const [aktifKullanici, setAktifKullanici] = useState<OgretmenProfil | null>(null);
  const [sifre, setSifre] = useState("");
  const [sifreHata, setSifreHata] = useState(false);

  const [aktifSekme, setAktifSekme] = useState<"sonuclar" | "ogrenciler" | "sorular" | "ogretmenler">("sonuclar");
  const [yukleniyor, setYukleniyor] = useState(false);

  const [odevler, setOdevler] = useState<OdevKaydi[]>([]);
  const [ogrenciler, setOgrenciler] = useState<OgrenciProfil[]>([]);
  const [sorular, setSorular] = useState<SoruItem[]>([]);
  const [ogretmenler, setOgretmenler] = useState<OgretmenProfil[]>([]);
  const [arsivSayisi, setArsivSayisi] = useState(0);

  // Yeni Öğretmen Form Durumu
  const [yeniOgretmenAd, setYeniOgretmenAd] = useState("");
  const [yeniOgretmenUnvan, setYeniOgretmenUnvan] = useState("");
  const [yeniOgretmenSifre, setYeniOgretmenSifre] = useState("");

  function verileriGetir() {
    setYukleniyor(true);
    fetch("/api/odev", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.success && res.data) {
          setOdevler(res.data.aktifOdevler || []);
          setOgrenciler(res.data.ogrenciler || []);
          setSorular(res.data.sorular || []);
          setOgretmenler(res.data.ogretmenler || []);
          setArsivSayisi(Number(res.data.arsivSayisi) || 0);
        }
        setYukleniyor(false);
      })
      .catch(() => setYukleniyor(false));
  }

  useEffect(() => {
    if (aktifKullanici) verileriGetir();
  }, [aktifKullanici]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ogretmenGiris", sifre }),
      });
      const data = await res.json();
      if (data.success) {
        setAktifKullanici(data.data);
        setSifreHata(false);
      } else {
        setSifreHata(true);
      }
    } catch {
      setSifreHata(true);
    }
  }

  async function handleOgretmenEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!yeniOgretmenAd.trim() || !yeniOgretmenSifre.trim()) {
      alert("Lütfen isim ve şifre alanlarını doldurun!");
      return;
    }

    try {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ogretmenEkle",
          adSoyad: yeniOgretmenAd,
          unvan: yeniOgretmenUnvan,
          sifre: yeniOgretmenSifre,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Öğretmen sisteme eklendi!");
        setYeniOgretmenAd("");
        setYeniOgretmenUnvan("");
        setYeniOgretmenSifre("");
        verileriGetir();
      }
    } catch {
      alert("Öğretmen eklenirken hata oluştu.");
    }
  }

  async function handleOgretmenSil(id: string) {
    if (!confirm("Bu öğretmeni silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch("/api/odev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ogretmenSil", id }),
      });
      const data = await res.json();
      if (data.success) verileriGetir();
    } catch {
      alert("Hata oluştu.");
    }
  }

  if (!aktifKullanici) {
    return (
      <div style={{ maxWidth: "380px", width: "100%", backgroundColor: "#ffffff", padding: "24px", borderRadius: "20px", border: "4px solid #f59e0b", textAlign: "center", margin: "40px auto" }}>
        <span style={{ fontSize: "48px" }}>🔐</span>
        <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#1e293b", margin: "10px 0" }}>Öğretmen Giriş Paneli</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Öğretmen Şifresi"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "12px", border: "2px solid #cbd5e1", fontSize: "14px", textAlign: "center", marginBottom: "10px", boxSizing: "border-box" }}
          />
          {sifreHata && <div style={{ color: "#dc2626", fontSize: "11px", fontWeight: "bold", marginBottom: "8px" }}>❌ Hatalı şifre!</div>}
          <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#2563eb", color: "#ffffff", fontWeight: "900", borderRadius: "12px", border: "none", cursor: "pointer" }}>
            Giriş Yap 🚀
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "850px", width: "100%", backgroundColor: "#ffffff", padding: "20px", borderRadius: "24px", border: "3px solid #fde68a", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#1e293b", margin: 0 }}>♟️ Öğretmen Masası</h1>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Giriş Yapan: <b>{aktifKullanici.adSoyad}</b> ({aktifKullanici.unvan})</span>
        </div>
        <button type="button" onClick={() => setAktifKullanici(null)} style={{ padding: "6px 12px", backgroundColor: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "10px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
          Çıkış Yap
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px", flexWrap: "wrap" }}>
        <button type="button" onClick={() => setAktifSekme("sonuclar")} style={{ padding: "8px 14px", borderRadius: "12px", border: "none", backgroundColor: aktifSekme === "sonuclar" ? "#2563eb" : "#f1f5f9", color: aktifSekme === "sonuclar" ? "#fff" : "#64748b", fontWeight: "bold", cursor: "pointer" }}>
          📊 Ödevler ({odevler.length})
        </button>
        <button type="button" onClick={() => setAktifSekme("ogrenciler")} style={{ padding: "8px 14px", borderRadius: "12px", border: "none", backgroundColor: aktifSekme === "ogrenciler" ? "#8b5cf6" : "#f1f5f9", color: aktifSekme === "ogrenciler" ? "#fff" : "#64748b", fontWeight: "bold", cursor: "pointer" }}>
          👥 Öğrenciler & PIN ({ogrenciler.length})
        </button>
        <button type="button" onClick={() => setAktifSekme("sorular")} style={{ padding: "8px 14px", borderRadius: "12px", border: "none", backgroundColor: aktifSekme === "sorular" ? "#f59e0b" : "#f1f5f9", color: aktifSekme === "sorular" ? "#fff" : "#64748b", fontWeight: "bold", cursor: "pointer" }}>
          ⚙️ Sorular ({sorular.length})
        </button>
        <button type="button" onClick={() => setAktifSekme("ogretmenler")} style={{ padding: "8px 14px", borderRadius: "12px", border: "none", backgroundColor: aktifSekme === "ogretmenler" ? "#10b981" : "#f1f5f9", color: aktifSekme === "ogretmenler" ? "#fff" : "#64748b", fontWeight: "bold", cursor: "pointer" }}>
          👩‍🏫 Öğretmenler ({ogretmenler.length})
        </button>
      </div>

      {/* SEKME: ÖĞRETMEN YÖNETİMİ */}
      {aktifSekme === "ogretmenler" && (
        <div>
          <form onSubmit={handleOgretmenEkle} style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "900", margin: "0 0 10px 0" }}>➕ Sisteme Yeni Öğretmen Ekle</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "8px" }}>
              <input type="text" placeholder="Ad Soyad" value={yeniOgretmenAd} onChange={(e) => setYeniOgretmenAd(e.target.value)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              <input type="text" placeholder="Grup / Branş (Örn: Bolu Grubu)" value={yeniOgretmenUnvan} onChange={(e) => setYeniOgretmenUnvan(e.target.value)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              <input type="text" placeholder="Giriş Şifresi" value={yeniOgretmenSifre} onChange={(e) => setYeniOgretmenSifre(e.target.value)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Ekle</button>
            </div>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {ogretmenler.map((ogrt) => (
              <div key={ogrt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "bold" }}>👩‍🏫 {ogrt.adSoyad}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>{ogrt.unvan} • Giriş Şifresi: <b style={{ color: "#d97706" }}>{ogrt.sifre}</b></div>
                </div>
                {ogrt.id !== "admin-1" && (
                  <button type="button" onClick={() => handleOgretmenSil(ogrt.id)} style={{ padding: "4px 8px", backgroundColor: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>Sil</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
