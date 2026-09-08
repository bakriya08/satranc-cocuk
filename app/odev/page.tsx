"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ogrenci {
  id: string;
  adSoyad: string;
  sinifGrup?: string;
  avatar: string;
  pin: string;
  lichessKadi?: string;
  chessComKadi?: string;
}

interface Soru {
  id: number;
  soru: string;
  secenekler: string[];
  dogruCevap: string;
  aciklama: string;
}

const HAFTALIK_SORULAR: Soru[] = [
  {
    id: 1,
    soru: "Satranç tahtasında 'At' taşı hangi harf şeklinde hareket eder?",
    secenekler: ["L harfi", "Düz çizgi", "Çapraz", "Kare"],
    dogruCevap: "L harfi",
    aciklama: "Atlar L şeklinde zıplar ve taşların üzerinden atlayabilir.",
  },
  {
    id: 2,
    soru: "Başlangıç konumunda beyaz vezir hangi karede yer alır?",
    secenekler: ["Kendi rengindeki karede (d1)", "Köşede (a1)", "Şahın sağında", "İstediği karede"],
    dogruCevap: "Kendi rengindeki karede (d1)",
    aciklama: "Beyaz vezir beyaz karede (d1), siyah vezir siyah karede (d8) yer alır.",
  },
  {
    id: 3,
    soru: "Aynı anda iki taşı birden tehdit etme hamlesine ne ad verilir?",
    secenekler: ["Çatal", "Rok", "Pat", "Terfi"],
    dogruCevap: "Çatal",
    aciklama: "Çatal, bir taşla iki veya daha fazla rakip taşı aynı anda tehdit etmektir.",
  },
];

export default function OdevPage() {
  const [kayitliOgrenciler, setKayitliOgrenciler] = useState<Ogrenci[]>([]);
  const [aktifOgrenci, setAktifOgrenci] = useState<Ogrenci | null>(null);
  const [girisPin, setGirisPin] = useState("");
  const [secilenOgrenciId, setSecilenOgrenciId] = useState("");
  const [hata, setHata] = useState("");

  // Soru çözme state'leri
  const [aktifSoruIndex, setAktifSoruIndex] = useState(0);
  const [verilenCevaplar, setVerilenCevaplar] = useState<Record<number, string>>({});
  const [testBitti, setTestBitti] = useState(false);
  const [puan, setPuan] = useState(0);

  useEffect(() => {
    try {
      // Hem yeni hem eski kayıt anahtarlarını kontrol et
      const kayitlar = localStorage.getItem("sevimliSatrancKulupKayitlari") || localStorage.getItem("satrancOgrenciler");
      if (kayitlar) {
        setKayitliOgrenciler(JSON.parse(kayitlar));
      }

      const oturum = localStorage.getItem("aktifOgrenci");
      if (oturum) {
        setAktifOgrenci(JSON.parse(oturum));
      }
    } catch {}
  }, []);

  function handleGiris(e: React.FormEvent) {
    e.preventDefault();
    const ogrenci = kayitliOgrenciler.find((o) => o.id === secilenOgrenciId);
    if (!ogrenci) {
      setHata("Lütfen bir öğrenci seçin.");
      return;
    }

    const pinKontrol = ogrenci.pin || "1234";
    if (girisPin.trim() !== pinKontrol) {
      setHata("Hatalı PIN kodu! Lütfen kayıt olurken belirlediğiniz PIN'i girin.");
      return;
    }

    setAktifOgrenci(ogrenci);
    localStorage.setItem("aktifOgrenci", JSON.stringify(ogrenci));
    setHata("");
    setGirisPin("");
  }

  function handleCevapVer(secenek: string) {
    const soru = HAFTALIK_SORULAR[aktifSoruIndex];
    const yeniCevaplar = { ...verilenCevaplar, [soru.id]: secenek };
    setVerilenCevaplar(yeniCevaplar);

    if (aktifSoruIndex < HAFTALIK_SORULAR.length - 1) {
      setAktifSoruIndex(aktifSoruIndex + 1);
    } else {
      // Testi bitir ve puan hesapla
      let dogruSayisi = 0;
      HAFTALIK_SORULAR.forEach((s) => {
        if (yeniCevaplar[s.id] === s.dogruCevap) {
          dogruSayisi++;
        }
      });
      const hesaplananPuan = Math.round((dogruSayisi / HAFTALIK_SORULAR.length) * 100);
      setPuan(hesaplananPuan);
      setTestBitti(true);
    }
  }

  function handleCikis() {
    setAktifOgrenci(null);
    localStorage.removeItem("aktifOgrenci");
    setTestBitti(false);
    setAktifSoruIndex(0);
    setVerilenCevaplar({});
  }

  return (
    <div
      style={{
        maxWidth: "800px",
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
        <span style={{ fontSize: "40px" }}>📚✏️</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#b91c1c", margin: "6px 0" }}>
          Haftalık Ödevler & Soru Çözüm Merkezi
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Öğrenci hesabınla giriş yap, haftanın sorularını çöz ve rozetini kazan!
        </p>
      </div>

      {!aktifOgrenci ? (
        /* GİRİŞ YAPMA EKRANI */
        <div style={{ backgroundColor: "#fef2f2", padding: "20px", borderRadius: "18px", border: "2px solid #fecaca", maxWidth: "450px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "900", color: "#991b1b", margin: "0 0 14px 0", textAlign: "center" }}>
            🔑 Ödev Çözmek İçin Giriş Yap
          </h2>

          {kayitliOgrenciler.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "#b91c1c", marginBottom: "12px" }}>
                Henüz kayıtlı öğrenci bulunmuyor. Önce kulübe kayıt olmalısın!
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
            <form onSubmit={handleGiris} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
                  <option value="">-- İsminizi Seçin --</option>
                  {kayitliOgrenciler.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.avatar} {o.adSoyad} {o.sinifGrup ? `(${o.sinifGrup})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#991b1b", marginBottom: "4px" }}>
                  PIN Kodunuz (Varsayılan: 1234) *
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
                🚀 Giriş Yap ve Soruları Çöz
              </button>
            </form>
          )}
        </div>
      ) : (
        /* SORU ÇÖZME EKRANI */
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "14px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "28px" }}>{aktifOgrenci.avatar}</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b" }}>{aktifOgrenci.adSoyad}</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>{aktifOgrenci.sinifGrup || "Genel Grup"}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCikis}
              style={{ padding: "6px 12px", backgroundColor: "#e2e8f0", color: "#334155", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
            >
              Çıkış Yap 🚪
            </button>
          </div>

          {!testBitti ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "bold", color: "#b91c1c", marginBottom: "6px" }}>
                <span>Soru {aktifSoruIndex + 1} / {HAFTALIK_SORULAR.length}</span>
                <span>%{Math.round(((aktifSoruIndex + 1) / HAFTALIK_SORULAR.length) * 100)} Tamamlandı</span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#fee2e2", borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
                <div
                  style={{
                    width: `${((aktifSoruIndex + 1) / HAFTALIK_SORULAR.length) * 100}%`,
                    height: "100%",
                    backgroundColor: "#ef4444",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              <div style={{ backgroundColor: "#fff5f5", padding: "20px", borderRadius: "16px", border: "2px solid #fecaca", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#7f1d1d", margin: "0 0 16px 0" }}>
                  {HAFTALIK_SORULAR[aktifSoruIndex].soru}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {HAFTALIK_SORULAR[aktifSoruIndex].secenekler.map((secenek, idx) => (
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
                      {String.fromCharCode(65 + idx)}) {secenek}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <span style={{ fontSize: "50px" }}>🏆🎉</span>
              <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#991b1b", margin: "10px 0" }}>
                Ödevleri Tamamladın, Tebrikler!
              </h2>
              <p style={{ fontSize: "14px", color: "#334155", margin: "0 0 20px 0" }}>
                Başarı Puanın: <strong style={{ color: "#16a34a", fontSize: "18px" }}>{puan} Puan</strong>
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
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
                <Link
                  href="/dersler"
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "900",
                    fontSize: "12px",
                  }}
                >
                  🎓 Derslere Git
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
