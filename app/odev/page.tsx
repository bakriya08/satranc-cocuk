"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ogrenci {
  id: string;
  adSoyad: string;
  sinifGrup?: string;
  avatar: string;
  pin?: string;
}

interface Soru {
  id: number;
  tip: "normal" | "lichess";
  soru: string;
  secenekler: string[];
  dogruCevap: string;
  aciklama: string;
  lichessUrl?: string;
}

const VARSAYILAN_SORULAR: Soru[] = [
  {
    id: 1,
    tip: "normal",
    soru: "Satranç tahtasında 'At' taşı hangi harf şeklinde hareket eder?",
    secenekler: ["L harfi", "Düz çizgi", "Çapraz", "Kare"],
    dogruCevap: "L harfi",
    aciklama: "Atlar L şeklinde zıplar ve taşların üzerinden atlayabilir.",
  },
  {
    id: 2,
    tip: "normal",
    soru: "Başlangıç konumunda beyaz vezir hangi karede yer alır?",
    secenekler: ["Kendi rengindeki karede (d1)", "Köşede (a1)", "Şahın sağında", "İstediği karede"],
    dogruCevap: "Kendi rengindeki karede (d1)",
    aciklama: "Beyaz vezir beyaz karede (d1), siyah vezir siyah karede (d8) yer alır.",
  },
];

export default function OdevPage() {
  const [aktifSekme, setAktifSekme] = useState<"ogrenci" | "ogretmen">("ogrenci");

  const [kayitliOgrenciler, setKayitliOgrenciler] = useState<Ogrenci[]>([]);
  const [aktifOgrenci, setAktifOgrenci] = useState<Ogrenci | null>(null);
  const [girisPin, setGirisPin] = useState("");
  const [secilenOgrenciId, setSecilenOgrenciId] = useState("");
  const [hata, setHata] = useState("");

  const [ogretmenSifre, setOgretmenSifre] = useState("");
  const [ogretmenGirisYapildi, setOgretmenGirisYapildi] = useState(false);
  const [ogretmenHata, setOgretmenHata] = useState("");

  const [yeniSoruMetni, setYeniSoruMetni] = useState("");
  const [secenek1, setSecenek1] = useState("");
  const [secenek2, setSecenek2] = useState("");
  const [secenek3, setSecenek3] = useState("");
  const [secenek4, setSecenek4] = useState("");
  const [dogruSecenekIndex, setDogruSecenekIndex] = useState(0);

  const [lichessBaslik, setLichessBaslik] = useState("");
  const [lichessLink, setLichessLink] = useState("");

  const [soruBasariMesaji, setSoruBasariMesaji] = useState("");
  const [sorularListesi, setSorularListesi] = useState<Soru[]>(VARSAYILAN_SORULAR);

  const [aktifSoruIndex, setAktifSoruIndex] = useState(0);
  const [verilenCevaplar, setVerilenCevaplar] = useState<Record<number, string>>({});
  const [testBitti, setTestBitti] = useState(false);
  const [puan, setPuan] = useState(0);

  useEffect(() => {
    try {
      // Tüm olası kayıt anahtarlarını kontrol ederek öğrencileri yüklüyoruz
      const kayitlar1 = localStorage.getItem("sevimliSatrancKulupKayitlari");
      const kayitlar2 = localStorage.getItem("satrancOgrenciler");
      
      let birlesikKayitlar: Ogrenci[] = [];
      if (kayitlar1) birlesikKayitlar = [...birlesikKayitlar, ...JSON.parse(kayitlar1)];
      if (kayitlar2) {
        const parsed2 = JSON.parse(kayitlar2);
        // Yinelenen kayıtları önlemek için ID kontrolü
        parsed2.forEach((p: Ogrenci) => {
          if (!birlesikKayitlar.some((b) => b.id === p.id)) {
            birlesikKayitlar.push(p);
          }
        });
      }

      setKayitliOgrenciler(birlesikKayitlar);

      const oturum = localStorage.getItem("aktifOgrenci");
      if (oturum) {
        setAktifOgrenci(JSON.parse(oturum));
      }

      const kaydedilenSorular = localStorage.getItem("ogretmenEklenenSorularVeLichess");
      if (kaydedilenSorular) {
        setSorularListesi(JSON.parse(kaydedilenSorular));
      }

      if (sessionStorage.getItem("ogretmenGirisDurumu") === "true") {
        setOgretmenGirisYapildi(true);
      }
    } catch {}
  }, []);

  function handleOgrenciGiris(e: React.FormEvent) {
    e.preventDefault();
    const ogrenci = kayitliOgrenciler.find((o) => o.id === secilenOgrenciId);
    if (!ogrenci) {
      setHata("Lütfen listeden isminizi seçin.");
      return;
    }

    // PIN kodu girilmemişse veya esnek kontrol istiyorsak varsayılan kabul edelim
    const kayitliPin = ogrenci.pin ? String(ogrenci.pin).trim() : "1234";
    const girilenPin = girisPin.trim();

    if (girilenPin !== kayitliPin && girilenPin !== "1234") {
      setHata("Hatalı PIN kodu! (Kayıt olurken belirlediğiniz PIN'i giriniz)");
      return;
    }

    setAktifOgrenci(ogrenci);
    localStorage.setItem("aktifOgrenci", JSON.stringify(ogrenci));
    setHata("");
    setGirisPin("");
  }

  function handleOgretmenGiris(e: React.FormEvent) {
    e.preventDefault();
    if (ogretmenSifre.trim() === "1453") {
      setOgretmenGirisYapildi(true);
      setOgretmenHata("");
      try {
        sessionStorage.setItem("ogretmenGirisDurumu", "true");
      } catch {}
    } else {
      setOgretmenHata("Hatalı öğretmen şifresi! (Şifre: 1453)");
    }
  }

  function handleOgretmenCikis() {
    setOgretmenGirisYapildi(false);
    setOgretmenSifre("");
    try {
      sessionStorage.removeItem("ogretmenGirisDurumu");
    } catch {}
  }

  function handleYeniSoruEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!yeniSoruMetni.trim() || !secenek1.trim() || !secenek2.trim()) return;

    const seceneklerDizi = [secenek1, secenek2, secenek3, secenek4].filter((s) => s.trim() !== "");
    const dogruMetin = seceneklerDizi[dogruSecenekIndex] || seceneklerDizi[0];

    const yeniSoru: Soru = {
      id: Date.now(),
      tip: "normal",
      soru: yeniSoruMetni.trim(),
      secenekler: seceneklerDizi,
      dogruCevap: dogruMetin,
      aciklama: "Öğretmen tarafından eklenen özel ödev sorusu.",
    };

    guncelleVeKaydet(yeniSoru);
    setYeniSoruMetni("");
    setSecenek1("");
    setSecenek2("");
    setSecenek3("");
    setSecenek4("");
  }

  function handleLichessEkle(e: React.FormEvent) {
    e.preventDefault();
    if (!lichessBaslik.trim() || !lichessLink.trim()) return;

    let temizUrl = lichessLink.trim();
    if (temizUrl.includes("lichess.org/study/") && !temizUrl.includes("/embed/")) {
      temizUrl = temizUrl.replace("lichess.org/study/", "lichess.org/study/embed/");
    } else if (temizUrl.includes("lichess.org/training/") && !temizUrl.includes("/embed/")) {
      temizUrl = temizUrl.replace("lichess.org/training/", "lichess.org/training/embed/");
    }

    const yeniLichessOdevi: Soru = {
      id: Date.now(),
      tip: "lichess",
      soru: `🌐 Lichess Çalışması: ${lichessBaslik.trim()}`,
      secenekler: ["Çalışmayı Çözdüm ve Tamamladım! ✅"],
      dogruCevap: "Çalışmayı Çözdüm ve Tamamladım! ✅",
      aciklama: "Öğretmeniniz tarafından Lichess üzerinden atanan interaktif çalışma.",
      lichessUrl: temizUrl,
    };

    guncelleVeKaydet(yeniLichessOdevi);
    setLichessBaslik("");
    setLichessLink("");
  }

  function guncelleVeKaydet(yeniSoru: Soru) {
    const guncelSorular = [...sorularListesi, yeniSoru];
    setSorularListesi(guncelSorular);
    try {
      localStorage.setItem("ogretmenEklenenSorularVeLichess", JSON.stringify(guncelSorular));
    } catch {}

    setSoruBasariMesaji("🎉 İçerik başarıyla sisteme eklendi!");
    setTimeout(() => setSoruBasariMesaji(""), 4000);
  }

  function handleCevapVer(secenek: string) {
    const soru = sorularListesi[aktifSoruIndex];
    const yeniCevaplar = { ...verilenCevaplar, [soru.id]: secenek };
    setVerilenCevaplar(yeniCevaplar);

    if (aktifSoruIndex < sorularListesi.length - 1) {
      setAktifSoruIndex(aktifSoruIndex + 1);
    } else {
      let dogruSayisi = 0;
      sorularListesi.forEach((s) => {
        if (yeniCevaplar[s.id] === s.dogruCevap || s.tip === "lichess") {
          dogruSayisi++;
        }
      });
      const hesaplananPuan = Math.round((dogruSayisi / sorularListesi.length) * 100);
      setPuan(hesaplananPuan);
      setTestBitti(true);
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
        border: "3px solid #ef4444",
        boxShadow: "0 10px 30px rgba(239, 68, 68, 0.1)",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "40px" }}>📚♟️</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#b91c1c", margin: "6px 0" }}>
          Haftalık Ödevler & Lichess Çalışma Merkezi
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Öğrenci olarak giriş yapıp ödevini çözebilirsin!
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => setAktifSekme("ogrenci")}
          style={{
            padding: "10px 20px",
            backgroundColor: aktifSekme === "ogrenci" ? "#ef4444" : "#f1f5f9",
            color: aktifSekme === "ogrenci" ? "#ffffff" : "#334155",
            borderRadius: "12px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          🎓 Öğrenci Ödev Ekranı
        </button>

        <button
          type="button"
          onClick={() => setAktifSekme("ogretmen")}
          style={{
            padding: "10px 20px",
            backgroundColor: aktifSekme === "ogretmen" ? "#b91c1c" : "#f1f5f9",
            color: aktifSekme === "ogretmen" ? "#ffffff" : "#334155",
            borderRadius: "12px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          👨‍🏫 Öğretmen Lichess / Soru Ekle
        </button>
      </div>

      {aktifSekme === "ogrenci" && (
        <div>
          {!aktifOgrenci ? (
            <div style={{ backgroundColor: "#fef2f2", padding: "20px", borderRadius: "18px", border: "2px solid #fecaca", maxWidth: "450px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#991b1b", margin: "0 0 14px 0", textAlign: "center" }}>
                🔑 Öğrenci Girişi
              </h2>

              {kayitliOgrenciler.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#b91c1c", marginBottom: "12px" }}>
                    Henüz sistemde kayıtlı öğrenci bulunmuyor. Önce kulübe kayıt olmalısın!
                  </p>
                  <Link
                    href="/kayit"
                    style={{
                      display: "inline-block",
                      padding: "10px 18px",
                      backgroundColor: "#8b5cf6",
                      color: "#ffffff",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    🌟 Hemen Kulübe Kayıt Ol
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleOgrenciGiris} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#991b1b", marginBottom: "4px" }}>
                      Öğrenci İsminizi Seçin *
                    </label>
                    <select
                      required
                      value={secilenOgrenciId}
                      onChange={(e) => setSecilenOgrenciId(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#ffffff" }}
                    >
                      <option value="">-- İsminizi Seçin ({kayitliOgrenciler.length} Öğrenci) --</option>
                      {kayitliOgrenciler.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.avatar || "⭐"} {o.adSoyad} {o.sinifGrup ? `(${o.sinifGrup})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#991b1b", marginBottom: "4px" }}>
                      PIN Kodunuz (Hatırlamıyorsanız 1234 yazabilirsiniz) *
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      required
                      value={girisPin}
                      onChange={(e) => setGirisPin(e.target.value)}
                      placeholder="****"
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", letterSpacing: "2px" }}
                    />
                  </div>

                  {hata && (
                    <div style={{ color: "#dc2626", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>
                      {hata}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "11px",
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "900",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    🚀 Giriş Yap ve Ödevleri Çöz
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "14px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "28px" }}>{aktifOgrenci.avatar || "⭐"}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b" }}>{aktifOgrenci.adSoyad}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{aktifOgrenci.sinifGrup || "Genel Grup"}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAktifOgrenci(null);
                    localStorage.removeItem("aktifOgrenci");
                    setTestBitti(false);
                    setAktifSoruIndex(0);
                  }}
                  style={{ padding: "6px 12px", backgroundColor: "#e2e8f0", color: "#334155", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
                >
                  Çıkış Yap 🚪
                </button>
              </div>

              {!testBitti ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "bold", color: "#b91c1c", marginBottom: "6px" }}>
                    <span>Ödev {aktifSoruIndex + 1} / {sorularListesi.length}</span>
                    <span>%{Math.round(((aktifSoruIndex + 1) / sorularListesi.length) * 100)} Tamamlandı</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "#fee2e2", borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
                    <div
                      style={{
                        width: `${((aktifSoruIndex + 1) / sorularListesi.length) * 100}%`,
                        height: "100%",
                        backgroundColor: "#ef4444",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>

                  <div style={{ backgroundColor: "#fff5f5", padding: "20px", borderRadius: "16px", border: "2px solid #fecaca", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#7f1d1d", margin: "0 0 16px 0" }}>
                      {sorularListesi[aktifSoruIndex].soru}
                    </h3>

                    {sorularListesi[aktifSoruIndex].tip === "lichess" && sorularListesi[aktifSoruIndex].lichessUrl && (
                      <div style={{ marginBottom: "16px", textAlign: "center" }}>
                        <iframe
                          src={sorularListesi[aktifSoruIndex].lichessUrl}
                          width="100%"
                          height="350px"
                          style={{ border: "2px solid #f87171", borderRadius: "12px" }}
                          title="Lichess Çalışması"
                        />
                        <div style={{ marginTop: "8px" }}>
                          <a
                            href={sorularListesi[aktifSoruIndex].lichessUrl?.replace("/embed/", "/")}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "12px", color: "#2563eb", fontWeight: "bold", textDecoration: "underline" }}
                          >
                            🌐 Lichess'te Tam Ekran Aç ↗
                          </a>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {sorularListesi[aktifSoruIndex].secenekler.map((secenek, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCevapVer(secenek)}
                          style={{
                            textAlign: "left",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            border: "1px solid #fca5a5",
                            backgroundColor: "#ffffff",
                            color: "#1e293b",
                            fontSize: "13px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {sorularListesi[aktifSoruIndex].tip === "lichess" ? secenek : `${String.fromCharCode(65 + idx)}) ${secenek}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <span style={{ fontSize: "50px" }}>🏆🎉</span>
                  <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#b91c1c", margin: "10px 0" }}>
                    Ödevleri Tamamladın, Tebrikler!
                  </h2>
                  <p style={{ fontSize: "14px", color: "#334155", margin: "0 0 20px 0" }}>
                    Başarı Puanın: <strong style={{ color: "#16a34a", fontSize: "18px" }}>{puan} Puan</strong>
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setTestBitti(false);
                      setAktifSoruIndex(0);
                      setVerilenCevaplar({});
                    }}
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#64748b",
                      color: "#ffffff",
                      borderRadius: "12px",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    🔄 Ödevi Tekrar Çöz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {aktifSekme === "ogretmen" && (
        <div>
          {!ogretmenGirisYapildi ? (
            <div style={{ backgroundColor: "#fdf2f8", padding: "20px", borderRadius: "18px", border: "2px solid #fbcfe8", maxWidth: "450px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#831843", margin: "0 0 14px 0", textAlign: "center" }}>
                🔐 Öğretmen Girişi (Şifre: 1453)
              </h2>

              <form onSubmit={handleOgretmenGiris} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#9d174d", marginBottom: "4px" }}>
                    Öğretmen Şifresi *
                  </label>
                  <input
                    type="password"
                    required
                    value={ogretmenSifre}
                    onChange={(e) => setOgretmenSifre(e.target.value)}
                    placeholder="Şifre girin (1453)"
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                {ogretmenHata && (
                  <div style={{ color: "#dc2626", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>
                    {ogretmenHata}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "11px",
                    backgroundColor: "#be185d",
                    color: "#ffffff",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: "900",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  🔓 Giriş Yap ve İçerik Ekle
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fdf4f8", padding: "14px 18px", borderRadius: "14px", border: "2px solid #fbcfe8" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#831843", margin: 0 }}>
                  👨‍🏫 Öğretmen Yönetim Paneli ({kayitliOgrenciler.length} Öğrenci Kayıtlı)
                </h2>
                <button
                  type="button"
                  onClick={handleOgretmenCikis}
                  style={{ padding: "6px 12px", backgroundColor: "#e2e8f0", color: "#334155", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
                >
                  Çıkış Yap 🚪
                </button>
              </div>

              {soruBasariMesaji && (
                <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "10px", borderRadius: "10px", fontWeight: "bold", fontSize: "12px", textAlign: "center" }}>
                  {soruBasariMesaji}
                </div>
              )}

              {/* LICHESS ÇALIŞMA EKLEME */}
              <div style={{ backgroundColor: "#eff6ff", padding: "20px", borderRadius: "18px", border: "2px solid #bfdbfe" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "900", color: "#1e3a8a", margin: "0 0 10px 0" }}>
                  🌐 Lichess Çalışması veya Bulmacası Ekle
                </h3>
                <form onSubmit={handleLichessEkle} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "bold", color: "#1e40af", display: "block", marginBottom: "2px" }}>Çalışma Başlığı *</label>
                    <input
                      type="text"
                      required
                      value={lichessBaslik}
                      onChange={(e) => setLichessBaslik(e.target.value)}
                      placeholder="Örn: Mat Taktikleri Çalışması #1"
                      style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #93c5fd", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "bold", color: "#1e40af", display: "block", marginBottom: "2px" }}>Lichess Çalışma / Bulmaca Linki *</label>
                    <input
                      type="url"
                      required
                      value={lichessLink}
                      onChange={(e) => setLichessLink(e.target.value)}
                      placeholder="Örn: https://lichess.org/study/ABC12345"
                      style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #93c5fd", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      marginTop: "6px",
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "900",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    🌐 Lichess Çalışmasını Ödev Olarak Ekle
                  </button>
                </form>
              </div>

              {/* KLASİK SORU EKLEME */}
              <div style={{ backgroundColor: "#fdf4f8", padding: "20px", borderRadius: "18px", border: "2px solid #fbcfe8" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "900", color: "#831843", margin: "0 0 10px 0" }}>
                  📝 Klasik Çoktan Seçmeli Soru Ekle
                </h3>
                <form onSubmit={handleYeniSoruEkle} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "bold", color: "#9d174d", display: "block", marginBottom: "2px" }}>Soru Metni *</label>
                    <textarea
                      required
                      rows={2}
                      value={yeniSoruMetni}
                      onChange={(e) => setYeniSoruMetni(e.target.value)}
                      placeholder="Örn: Hangi taş sadece çapraz gider?"
                      style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
                    <input type="text" required value={secenek1} onChange={(e) => setSecenek1(e.target.value)} placeholder="A Şıkkı" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", boxSizing: "border-box" }} />
                    <input type="text" required value={secenek2} onChange={(e) => setSecenek2(e.target.value)} placeholder="B Şıkkı" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", boxSizing: "border-box" }} />
                    <input type="text" value={secenek3} onChange={(e) => setSecenek3(e.target.value)} placeholder="C Şıkkı" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", boxSizing: "border-box" }} />
                    <input type="text" value={secenek4} onChange={(e) => setSecenek4(e.target.value)} placeholder="D Şıkkı" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "bold", color: "#9d174d", display: "block", marginBottom: "2px" }}>Doğru Şık</label>
                    <select
                      value={dogruSecenekIndex}
                      onChange={(e) => setDogruSecenekIndex(Number(e.target.value))}
                      style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", backgroundColor: "#ffffff" }}
                    >
                      <option value={0}>A Şıkkı</option>
                      <option value={1}>B Şıkkı</option>
                      <option value={2}>C Şıkkı</option>
                      <option value={3}>D Şıkkı</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    style={{
                      marginTop: "4px",
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#be185d",
                      color: "#ffffff",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "900",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    ➕ Klasik Soruyu Kayıt Et
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
