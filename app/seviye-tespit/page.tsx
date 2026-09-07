"use client";

import { useState } from "react";
import Link from "next/link";

interface Soru {
  id: number;
  kategori: string;
  soruMetni: string;
  ipucu: string;
  secenekler: { id: string; metin: string; dogru: boolean }[];
}

const SEVIYE_TESTI_SORULARI: Soru[] = [
  {
    id: 1,
    kategori: "Temel Kurallar & Taş Tanıma",
    soruMetni: "1. Aşağıdaki taşlardan hangisi tahtada L harfi şeklinde zıplayarak ilerler?",
    ipucu: "Diğer taşların üzerinden de atlayabilen çevik taştır.",
    secenekler: [
      { id: "a", metin: "Kale", dogru: false },
      { id: "b", metin: "At", dogru: true },
      { id: "c", metin: "Fil", dogru: false },
    ],
  },
  {
    id: 2,
    kategori: "Başlangıç Konumu",
    soruMetni: "2. Beyaz taşlarla oynayacak olan bir oyuncunun, taşlarını doğru yerleştirmiş olması için Vezir hangi karede yer almalıdır?",
    ipucu: "Vezir kendi rengindeki kareyi sever (Beyaz vezir beyaz karede).",
    secenekler: [
      { id: "a", metin: "Kendi rengindeki karede (d1 karesi)", dogru: true },
      { id: "b", metin: "Köşede (a1 karesi)", dogru: false },
      { id: "c", metin: "Şahın yanında herhangi bir karede", dogru: false },
    ],
  },
  {
    id: 3,
    kategori: "Taş Değerleri",
    soruMetni: "3. Satranç tahtasında normal taşlar içinde en yüksek puan değerine sahip olan taş hangisidir?",
    ipucu: "9 puan değerindeki süper taştır.",
    secenekler: [
      { id: "a", metin: "Kale (5 Puan)", dogru: false },
      { id: "b", metin: "Vezir (9 Puan)", dogru: true },
      { id: "c", metin: "At (3 Puan)", dogru: false },
    ],
  },
  {
    id: 4,
    kategori: "Özel Hamleler",
    soruMetni: "5. Siyah piyonu iki kare ilerletirse, beyaz 'Geçerken Alma' (En Passant) kuralına göre bu piyonu nasıl alabilir?",
    ipucu: "Piyon sanki bir kare çıkmış gibi çaprazından vurarak alır.",
    secenekler: [
      { id: "a", metin: "Çapraz arkasındaki kareye inerek alır", dogru: true },
      { id: "b", metin: "Önünden düz vurarak alır", dogru: false },
      { id: "c", metin: "Geçerken alma kuralı sadece kaleler içindir", dogru: false },
    ],
  },
  {
    id: 5,
    kategori: "Taktik Motifler",
    soruMetni: "12. Aynı anda iki veya daha fazla taşı birden tehdit etme hamlesine ne ad verilir?",
    ipucu: "Genellikle at veya vezir tarafından yapılır.",
    secenekler: [
      { id: "a", metin: "Çatal hamlesi", dogru: true },
      { id: "b", metin: "Rok hamlesi", dogru: false },
      { id: "c", metin: "Pat durumu", dogru: false },
    ],
  },
  {
    id: 6,
    kategori: "Mat ve Şah",
    soruMetni: "15. Aynı anda iki taşla birden şah çekilmesi durumuna ne ad verilir?",
    ipucu: "Kurtulması en zor şah çekiş türüdür.",
    secenekler: [
      { id: "a", metin: "Çifte şah", dogru: true },
      { id: "b", metin: "Açmaz", dogru: false },
      { id: "c", metin: "Şiş", dogru: false },
    ],
  },
  {
    id: 7,
    kategori: "Beraberlik Kuralları",
    soruMetni: "18. Şah tehdit altında değilken oynayacak yasal hamlesi kalmayan tarafın durumu nedir?",
    ipucu: "Maç berabere biter.",
    secenekler: [
      { id: "a", metin: "Pat", dogru: true },
      { id: "b", metin: "Mat", dogru: false },
      { id: "c", metin: "Terfi", dogru: false },
    ],
  },
  {
    id: 8,
    kategori: "Açılışlar",
    soruMetni: "20. 1.e4 e5 2.Nf3 Nc6 3.Bb5 hamleleriyle başlayan dünyaca ünlü klasik açılış hangisidir?",
    ipucu: "İspanyol kökenli bir açılıştır.",
    secenekler: [
      { id: "a", metin: "İspanyol Açılışı (Ruy Lopez)", dogru: true },
      { id: "b", metin: "Vezir Gambiti", dogru: false },
      { id: "c", metin: "Sicilya Savunması", dogru: false },
    ],
  },
];

export default function SeviyeTespitPage() {
  const [aktifSoruIndex, setAktifSoruIndex] = useState(0);
  const [secilenCevaplar, setSecilenCevaplar] = useState<Record<number, string>>({});
  const [testBitti, setTestBitti] = useState(false);

  const soru = SEVIYE_TESTI_SORULARI[aktifSoruIndex];

  function handleCevapSec(secenekId: string) {
    setSecilenCevaplar({
      ...secilenCevaplar,
      [soru.id]: secenekId,
    });
  }

  function handleSonraki() {
    if (aktifSoruIndex < SEVIYE_TESTI_SORULARI.length - 1) {
      setAktifSoruIndex(aktifSoruIndex + 1);
    } else {
      setTestBitti(true);
    }
  }

  function handleOnceki() {
    if (aktifSoruIndex > 0) {
      setAktifSoruIndex(aktifSoruIndex - 1);
    }
  }

  function hesaplaSkor() {
    let dogruSayisi = 0;
    SEVIYE_TESTI_SORULARI.forEach((s) => {
      const verilenCevapId = secilenCevaplar[s.id];
      const dogruSecenek = s.secenekler.find((sec) => sec.dogru);
      if (verilenCevapId && dogruSecenek && verilenCevapId === dogruSecenek.id) {
        dogruSayisi++;
      }
    });
    return dogruSayisi;
  }

  const dogruPuan = hesaplaSkor();

  return (
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #10b981",
        boxShadow: "0 10px 30px rgba(16, 185, 129, 0.1)",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "40px" }}>🔍♟️</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#065f46", margin: "6px 0" }}>
          Satranç Seviye Tespit Sınavı
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          25 Soruluk Kapsamlı Bilgi ve Taktik Testi
        </p>
      </div>

      {!testBitti ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "bold", color: "#047857", marginBottom: "6px" }}>
            <span>Soru {aktifSoruIndex + 1} / {SEVIYE_TESTI_SORULARI.length} ({soru.kategori})</span>
            <span>%{Math.round(((aktifSoruIndex + 1) / SEVIYE_TESTI_SORULARI.length) * 100)} Tamamlandı</span>
          </div>
          <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
            <div
              style={{
                width: `${((aktifSoruIndex + 1) / SEVIYE_TESTI_SORULARI.length) * 100}%`,
                height: "100%",
                backgroundColor: "#10b981",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <div style={{ backgroundColor: "#ecfdf5", padding: "18px", borderRadius: "16px", border: "2px solid #a7f3d0", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#047857", marginBottom: "6px" }}>
              💡 İpucu: {soru.ipucu}
            </div>
            <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#064e3b", margin: "0 0 14px 0" }}>
              {soru.soruMetni}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {soru.secenekler.map((secenek) => {
                const secili = secilenCevaplar[soru.id] === secenek.id;
                return (
                  <button
                    key={secenek.id}
                    type="button"
                    onClick={() => handleCevapSec(secenek.id)}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: secili ? "2px solid #059669" : "1px solid #cbd5e1",
                      backgroundColor: secili ? "#d1fae5" : "#ffffff",
                      color: "#1e293b",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {secenek.id.toUpperCase()}) {secenek.metin}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleOnceki}
              disabled={aktifSoruIndex === 0}
              style={{
                padding: "8px 16px",
                backgroundColor: aktifSoruIndex === 0 ? "#cbd5e1" : "#64748b",
                color: "#ffffff",
                borderRadius: "10px",
                border: "none",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: aktifSoruIndex === 0 ? "not-allowed" : "pointer",
              }}
            >
              ⬅️ Önceki Soru
            </button>

            <button
              type="button"
              onClick={handleSonraki}
              style={{
                padding: "8px 20px",
                backgroundColor: "#10b981",
                color: "#ffffff",
                borderRadius: "10px",
                border: "none",
                fontWeight: "900",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {aktifSoruIndex === SEVIYE_TESTI_SORULARI.length - 1 ? "Sınavı Bitir ve Sonucu Gör 🎯" : "Sonraki Soru ➡️"}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <span style={{ fontSize: "50px" }}>🏆🎉</span>
          <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#065f46", margin: "10px 0" }}>
            Tebrikler, Seviye Tespit Sınavını Tamamladın!
          </h2>
          <p style={{ fontSize: "14px", color: "#334155", margin: "0 0 20px 0" }}>
            Toplam {SEVIYE_TESTI_SORULARI.length} sorudan <strong style={{ color: "#059669" }}>{dogruPuan} doğru</strong> yaptın.
          </p>

          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "2px solid #10b981",
              borderRadius: "16px",
              padding: "16px",
              maxWidth: "450px",
              margin: "0 auto 20px auto",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "900", color: "#065f46", marginBottom: "6px" }}>
              🎓 Seviye Değerlendirmen:
            </div>
            <p style={{ fontSize: "12px", color: "#064e3b", margin: 0, lineHeight: "1.5" }}>
              {dogruPuan >= 7
                ? "Harika bir satranç bilgisine sahipsin! Taktik ve açılış kurallarına oldukça hakimsin. Profesyonel turnuvalara hazırlanabilirsin! 🌟"
                : dogruPuan >= 4
                ? "İyi bir seviyedesin! Temel kuralları biliyorsun ancak taktiksel sorular için 'Derslerim' sekmesinden çalışmalar yapabilirsin. 👍"
                : "Satranç dünyasını keşfetmeye yeni başlıyorsun! '🎓 Derslerim' sekmesindeki modülleri inceleyerek kısa sürede harika yol alabilirsin. ♟️"}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => {
                setAktifSoruIndex(0);
                setSecilenCevaplar({});
                setTestBitti(false);
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
              🔄 Testi Tekrar Çöz
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
              🎓 Eksikleri Kapatmak İçin Derslere Git
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
